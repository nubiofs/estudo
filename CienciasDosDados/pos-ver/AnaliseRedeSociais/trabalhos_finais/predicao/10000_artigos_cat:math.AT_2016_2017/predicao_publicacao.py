import arxiv # https://github.com/lukasschwab/arxiv.py
import pandas as pd
from datetime import datetime
import networkx as nx
import itertools
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

# Downloads necessarios, apenas uma vez, para os processos de Tokenize e Stop Words:
# Use the NLTK Downloader to obtain the resource
# Downloading package punkt to ~/nltk_data...
#nltk.download('punkt')
#nltk.download()

def obter_autores_artigos_from_arxiv(from_arxiv):

    df_autor_artigos_2016 = []
    df_autor_artigos_2017 = []

    if from_arxiv:

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

    else: # from_csv já gerado

        df_autor_artigos_2016 = pd.read_csv(
            'registros_autores_artigos_2016_cat:math.AT.csv',
            encoding='utf-8', sep='@')

        df_autor_artigos_2017 = pd.read_csv(
            'registros_autores_artigos_2017_cat:math.AT.csv',
            encoding='utf-8', sep='@')

    return df_autor_artigos_2016, df_autor_artigos_2017 

#
# Construindo o grafo não direcionado com nós para CADA AUTOR dos artigos.
# Para cada autor em 'authors' (de um artigo específico) deve-se criar um nó 
# (usando como 'label' o nome do autor) e para as arestas que ligam os autores do artigo
# (coloca-se os metadados [id_link, title, summary, Weight]).
# Obs.: O valor '3', para o atributo Weight das arestas, significa o relacionamento de 
# publicação num mesmo artigo no ano. 
#
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

#df_2016, df_2017 = obter_autores_artigos_from_arxiv(True)
df_2016, df_2017 = obter_autores_artigos_from_arxiv(False)

grafo_2016 = gerar_grafo(df_2016)
grafo_2017 = gerar_grafo(df_2017)

print('\nInformações do grafo (antes da adição das arresta de predição): ')
print('- grafo 2016: \n', nx.info(grafo_2016))

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

#
# Obter todos os nós 'autores' que, com base no valor '2' da distância entre eles, podem 
# ser preditos em 2016 (ou seja, que podem ou não publicar em conjunto no ano de 2017).
# Obs.: Também será adicionado nos nós 'autores' vizinhos o atributo 'summary_tokenize_stop_word' da 
# concatenação de todos os identificadores únicos dos artigos que o autor participa. 
#
lista_autores_predicao_em_2016_para_2017 = []
for n1 in grafo_2016.nodes:
    # Obter apenas autores que tenham alguma publicação nos dois anos
    if grafo_2017.has_node(n1): 
        # Faz todo o rastreamento de vizinhos dos vizinhos a apartir do nó 'n1'
        for n2 in grafo_2016.neighbors(n1):
            assert(nx.shortest_path_length(grafo_2016, source=n1, target=n2) == 1)
            adicionar_summary_tokenize_stop_word_para_autores(grafo_2016, n1, n2)
            for n3 in grafo_2016.neighbors(n2):
                # Obter apenas autores que tenham alguma publicação nos dois anos
                if grafo_2017.has_node(n3): 
                    assert(nx.shortest_path_length(grafo_2016, source=n2, target=n3) == 1)
                    adicionar_summary_tokenize_stop_word_para_autores(grafo_2016, n2, n3)
                    if (nx.shortest_path_length(grafo_2016, source=n1, target=n3) == 2) and (not [n1, n3] in lista_autores_predicao_em_2016_para_2017):
                        lista_autores_predicao_em_2016_para_2017.append([n1, n3]) #Uma lista de listas

#
# Calculo para ver se predição "(sim - VP / FP) ou (não - VN / FN)":
#
def calculo_coeficiente_predicao(n1, n2):

    def jaccard(a, b):
        c = a.intersection(b)
        return float(len(c)) / (len(a) + len(b) - len(c))

    words1 = set(grafo_2016.node[n1]['summary_tokenize_stop_word'])
    words2 = set(grafo_2016.node[n2]['summary_tokenize_stop_word'])

    return jaccard(words1, words2)

#
# Adiciona aresta para n1 e n2 (no grafo do ano 2016), apenas se os nós 'autor' 
# tiverem publicado nos dois anos seguidos (2016 e 2017) e tiverem calculo de 
# coeficiente predição suficiente:
#
for n1, n2 in lista_autores_predicao_em_2016_para_2017:

    id_link = ''

    if calculo_coeficiente_predicao(n1, n2) >= 0.1:
        id_link = 'YES?'
    else:
        id_link = 'NO?'

    # Obs.:
    # O valor 'YES? / NO?' para o atributo id_link serve pra informar que é uma predição de publicação para 2017.
    # O valor '6' para o atributo Weight serve pra diferenciar no gráfico que é uma aresta de predição
    grafo_2016.add_edge(n1, n2, id_link = id_link, title = 'title', summary = 'summary', Weight = 6)

print('\nInformações do grafo (depois da adição das arresta de predição): ')
print('- grafo 2016: \n', nx.info(grafo_2016))
quantidade_total_arestas_predicao_2016 = len(list([(u, v) for u, v, d in grafo_2016.edges(data=True) if d['Weight'] == 6]))
print('Quantidade arestas preditivas adicionadas para 2016: ', quantidade_total_arestas_predicao_2016)

#
# Calculos da matriz de confusão:
#
print("\n* Matriz de confusão: ")
lista_aresta_predicao_yes_2016 = list([(u, v) for u, v, d in grafo_2016.edges(data=True) if (d['Weight'] == 6) and (d['id_link'] == 'YES?')])
quantidade_arestas_predicao_yes_2016 = len(lista_aresta_predicao_yes_2016)
print('\tQuantidade arestas predição YES para 2016: ', quantidade_arestas_predicao_yes_2016)
quantidade_arestas_predicao_yes_2016_acertos = 0
quantidade_arestas_predicao_yes_2016_erros = 0
for u, v in lista_aresta_predicao_yes_2016:
    if grafo_2017.has_edge(u, v):
        quantidade_arestas_predicao_yes_2016_acertos = quantidade_arestas_predicao_yes_2016_acertos + 1
    else:
        quantidade_arestas_predicao_yes_2016_erros = quantidade_arestas_predicao_yes_2016_erros + 1
print('\t\tQuantidade acertos para predição yes (Verdadeiro Positivo): ', quantidade_arestas_predicao_yes_2016_acertos)
print('\t\tQuantidade erros para predição yes (Falso Positivo): ', quantidade_arestas_predicao_yes_2016_erros)
quantidade_verdadeiro_positivo = quantidade_arestas_predicao_yes_2016_acertos / quantidade_arestas_predicao_yes_2016
quantidade_falso_positivo = quantidade_arestas_predicao_yes_2016_erros / quantidade_arestas_predicao_yes_2016
print('\tPercentual acertos para verdadeiro positivo: ', quantidade_verdadeiro_positivo)
print('\tPercentual acertos para falso positivo: ', quantidade_falso_positivo)

lista_aresta_predicao_no_2016 = list([(u, v) for u, v, d in grafo_2016.edges(data=True) if (d['Weight'] == 6) and (d['id_link'] == 'NO?')])
quantidade_arestas_predicao_no_2016 = len(lista_aresta_predicao_no_2016)
print('\n\tQuantidade arestas predição NO para 2016: ', quantidade_arestas_predicao_no_2016)
quantidade_arestas_predicao_no_2016_acertos = 0
quantidade_arestas_predicao_no_2016_erros = 0
for u, v in lista_aresta_predicao_no_2016:
    if not grafo_2017.has_edge(u, v):
        quantidade_arestas_predicao_no_2016_acertos = quantidade_arestas_predicao_no_2016_acertos + 1
    else:
        quantidade_arestas_predicao_no_2016_erros = quantidade_arestas_predicao_no_2016_erros + 1
print('\t\tQuantidade acertos para predição no (Verdadeiro Negativo): ', quantidade_arestas_predicao_no_2016_acertos)
print('\t\tQuantidade erros para predição no (Falso Negativo): ', quantidade_arestas_predicao_no_2016_erros)
quantidade_verdadeiro_negativo = quantidade_arestas_predicao_no_2016_acertos / quantidade_arestas_predicao_no_2016
quantidade_falso_negativo = quantidade_arestas_predicao_no_2016_erros / quantidade_arestas_predicao_no_2016
print('\tPercentual acertos para verdadeiro negativo: ', quantidade_verdadeiro_negativo)
print('\tPercentual acertos para false negativo: ', quantidade_falso_negativo)

print('\nPercentual de acertos final: ', 
    (quantidade_arestas_predicao_yes_2016_acertos + quantidade_arestas_predicao_no_2016_acertos) / quantidade_total_arestas_predicao_2016)
print('Percentual de erros final: ', 
    (quantidade_arestas_predicao_yes_2016_erros + quantidade_arestas_predicao_no_2016_erros) / quantidade_total_arestas_predicao_2016)

#
# export your data into Gephi’s GEXF format:
#
for n, d in grafo_2016.nodes(data=True):
    lista = grafo_2016.node[n]['summary_tokenize_stop_word']
    #Transformar para uma concatenção das stop_word (pois o gephi não lê 'lista de lista')
    grafo_2016.node[n]['summary_tokenize_stop_word'] = '[#]'.join(lista)
nx.write_gexf(grafo_2016, 'grafo_2016_in_gephi.gexf')
nx.write_gexf(grafo_2017, 'grafo_2017_in_gephi.gexf')
