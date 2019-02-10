import arxiv # https://github.com/lukasschwab/arxiv.py
import pandas as pd
from datetime import datetime
import networkx as nx
import itertools
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

# Downloads necessarios, apenas uma vez, para os processos de Tokenize e Stop Words:
#nltk.download('punkt')
#nltk.download()
# Use the NLTK Downloader to obtain the resource
# Downloading package punkt to ~/nltk_data...

def obter_autores_artigos_from_arxiv(from_arxiv):

    autores_validos = []
    df_autor_artigos_2016 = []
    df_autor_artigos_2017 = []

    # Obter apenas autores que tenham alguma publicação nos dois anos
    def get_autores_validos(artigo1, artigo2):
        autores1 = set()
        for artigo in artigo1:
            for autor in artigo[0]:
                autores1.add(autor)
        autores2 = set()
        for artigo in artigo2:
            for autor in artigo[0]:
                autores2.add(autor)

        return autores1.intersection(autores2)
    
    if from_arxiv:

        #results = arxiv.query(search_query="cat:math.AT", start = 2000, max_results = 500)
        results = arxiv.query(search_query="cat:math.AT", max_results = 10000)
        print('\nQuantidades de artigos baixados: ', len(list(results)))

        artigos_2016 = []
        artigos_2017 = []
        for r in results:
            autores = r.get('authors')
            if len(list(autores)) > 1:
                id = r.get('id')
                title = r.get('title')
                summary = r.get('summary')
                data_published = datetime.strptime(r.get('published'), '%Y-%m-%dT%H:%M:%SZ')
                if data_published.year == 2016:
                    artigos_2016.append((
                        autores,
                        id, 
                        title, 
                        summary,
                        data_published.year))
                elif data_published.year == 2017:
                    artigos_2017.append((
                        autores,
                        id, 
                        title, 
                        summary,
                        data_published.year))

        print('\nQuantidades de artigos filtrados, com mais de um autor, para o ano de 2016 = ', len(artigos_2016))
        print('Quantidades de artigos filtrados, com mais de um autor, para o ano de 2017 = ', len(artigos_2017))

        # Gerar dataFrame para todos os registros de um dado artigo e seus respectivos autores
        def gerar_dataframe_autor_artigos(artigos):

            # registros de artigo com autores
            registros = []
            for artigo in artigos:
                for autor in artigo[0]:
                    registro = [
                        autor, # 'author'
                        artigo[1], # 'id'
                        artigo[2], # 'title'
                        artigo[3], # 'summary'
                        artigo[4]] # 'published_year'
                    registros.append(registro)

            df = pd.DataFrame(
                registros, columns=['author', 'id', 'title', 'summary', 'published_year'])

            return df

        df_autor_artigos_2016 = gerar_dataframe_autor_artigos(artigos_2016)
        print('\ndf_autor_artigos_2016.shape: ', df_autor_artigos_2016.shape)
        df_autor_artigos_2016.to_csv(
            'registros_autores_artigos_2016_cat:math.AT.csv',
            columns=['author', 'id', 'title', 'summary', 'published_year'], 
            encoding='utf-8', index=False, sep='@')

        df_autor_artigos_2017 = gerar_dataframe_autor_artigos(artigos_2017)
        print('df_autor_artigos_2017.shape: ', df_autor_artigos_2017.shape)
        df_autor_artigos_2017.to_csv(
            'registros_autores_artigos_2017_cat:math.AT.csv',
            columns=['author', 'id', 'title', 'summary', 'published_year'], 
            encoding='utf-8', index=False, sep='@')

        autores_validos = get_autores_validos(artigos_2016, artigos_2017)

    else: # from_csv já gerado

        df_autor_artigos_2016 = pd.read_csv(
            'registros_autores_artigos_2016_cat:math.AT.csv',
            encoding='utf-8', sep='@')

        df_autor_artigos_2017 = pd.read_csv(
            'registros_autores_artigos_2017_cat:math.AT.csv',
            encoding='utf-8', sep='@')

        lista1 = set()
        for i, row in df_autor_artigos_2016.iterrows():
            lista1.add(row['author'])
        
        lista2 = set()
        for i, row in df_autor_artigos_2017.iterrows():
            lista2.add(row['author'])

        autores_validos = lista1.intersection(lista2)
        
    return autores_validos, df_autor_artigos_2016, df_autor_artigos_2017 

# Construindo o grafo não direcionado com nós para CADA AUTOR dos artigos.
# Para cada autor em 'authors' (de um artigo específico) deve-se criar um nó 
# (usando como 'label' o nome do autor) e para as arestas que ligam os autores do artigo
# (coloca-se os metadados [id_link, title, summary, Weight]).
# Obs.: O valor '3', para o atributo Weight das arestas, significa o relacionamento de 
# publicação num mesmo artigo no ano. 
def gerar_grafo(df_artigos):
    
    G = nx.Graph()

    #Adiciona as arestas com os nós
    for i in set(df_artigos.id):
        df = df_artigos[df_artigos['id'] == i]
        lista_autores = list(df['author'])
        title = list(set(df['title']))
        summary = list(set(df['summary']))
        for a1, a2 in itertools.combinations(lista_autores, 2):
            G.add_node(a1, summary_tokenize_stop_word = list())
            G.add_node(a2, summary_tokenize_stop_word = list())
            G.add_edge(a1, a2, id_link = i, title = title[0], summary = summary[0], Weight = 3)        

    return G

#autores_validos, df_2016, df_2017 = obter_autores_artigos_from_arxiv(True)
autores_validos, df_2016, df_2017 = obter_autores_artigos_from_arxiv(False)

grafo_2016 = gerar_grafo(df_2016)
grafo_2017 = gerar_grafo(df_2017)

print('\nInformações dos grafos (antes da adição das arresta de predição): \n')
print('- grafo 2016: \n', nx.info(grafo_2016))
print('- grafo 2017: \n', nx.info(grafo_2017))

def adicionar_summary_tokenize_stop_word_para_autores(grafo, n1, n2):

    dd = grafo.get_edge_data(n1, n2)
    summary = dd.get('summary')
    stop_words = set(stopwords.words('english'))
    tokens = word_tokenize(summary)
    filtered_sentence = [w for w in tokens if (not w in stop_words) and (w.isalpha())]
    for s in filtered_sentence:
        if not s in grafo.node[n1]['summary_tokenize_stop_word']:
            grafo.node[n1]['summary_tokenize_stop_word'].append(s)
        if not s in grafo.node[n2]['summary_tokenize_stop_word']:
            grafo.node[n2]['summary_tokenize_stop_word'].append(s)

lista_autores_predicao_em_2016_para_2017 = []
# Obter todos os nós 'autores' que, com base no valor '2' da distância entre eles, podem 
# ser preditos em 2016 (ou seja, que podem ou não publicar em conjunto no ano de 2017).
# Obs.: Também será adicionado nos nós 'autores' vizinhos o atributo 'summary_tokenize_stop_word' da 
# concatenação de todos os identificadores únicos dos artigos que o autor participa. 
for n1 in grafo_2016.nodes:
    # Faz todo o rastreamento de vizinhos dos vizinhos a apartir do nó 'n1'
    for n2 in grafo_2016.neighbors(n1):
        assert(nx.shortest_path_length(grafo_2016, source=n1, target=n2) == 1)
        adicionar_summary_tokenize_stop_word_para_autores(grafo_2016, n1, n2)
        for n3 in grafo_2016.neighbors(n2):
            assert(nx.shortest_path_length(grafo_2016, source=n2, target=n3) == 1)
            adicionar_summary_tokenize_stop_word_para_autores(grafo_2016, n2, n3)
            if nx.shortest_path_length(grafo_2016, source=n1, target=n3) == 2:
                if not [n1, n3] in lista_autores_predicao_em_2016_para_2017:
                    lista_autores_predicao_em_2016_para_2017.append([n1, n3]) #Uma lista de listas

# Calculo para ver se predição "(sim - VP / FP) ou (não - VN / FN)":
def calculo_coeficiente_predicao(n1, n2):

    def jaccard(a, b):
        c = a.intersection(b)
        return float(len(c)) / (len(a) + len(b) - len(c))

    words1 = set(grafo_2016.node[n1]['summary_tokenize_stop_word'])
    words2 = set(grafo_2016.node[n2]['summary_tokenize_stop_word'])

    return jaccard(words1, words2)

# Adiciona aresta para n1 e n2 (no grafo do ano 2016), apenas se os nós 'autor' 
# tiverem publicado nos dois anos seguidos (2016 e 2017) e tiverem calculo de 
# coeficiente predição suficiente:
for n1, n2 in lista_autores_predicao_em_2016_para_2017:

    if n1 in autores_validos and n2 in autores_validos:
        
        id_link = ''

        if calculo_coeficiente_predicao(n1, n2) >= 0.1:
            id_link = 'YES?'
        else:
            id_link = 'NO?'

        # Obs.:
        # O valor 'YES? / NO?' para o atributo id_link serve pra informar que é uma predição de publicação para 2017.
        # O valor '6' para o atributo Weight serve pra diferenciar no gráfico que é uma aresta de predição
        grafo_2016.add_edge(n1, n2, id_link = id_link, title = 'title', summary = 'summary', Weight = 6)


# Calculo da matriz de confusão:

print('\nInformações dos grafos (depois da adição das arresta de predição): \n')
print('- grafo 2016: \n', nx.info(grafo_2016))
print('- grafo 2017: \n', nx.info(grafo_2017))

# export your data into Gephi’s GEXF format:
for n, d in grafo_2016.nodes(data=True):
    lista = grafo_2016.node[n]['summary_tokenize_stop_word']
    #Transformar para uma concatenção das stop_word (pois o gephi não lê 'lista de lista')
    grafo_2016.node[n]['summary_tokenize_stop_word'] = '[#]'.join(lista)
nx.write_gexf(grafo_2016, 'grafo_2016_in_gephi.gexf')
nx.write_gexf(grafo_2017, 'grafo_2017_in_gephi.gexf')
