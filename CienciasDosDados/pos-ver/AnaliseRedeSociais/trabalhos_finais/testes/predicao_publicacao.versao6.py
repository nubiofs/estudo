import arxiv # https://github.com/lukasschwab/arxiv.py
import pandas as pd
from datetime import datetime
import networkx as nx
import itertools

results = arxiv.query(search_query="cat:math.AT", max_results = 10000)
'''
#V7
Quantidades de artigos baixados:  9938
Quantidades de artigos filtrados para o ano de 2016 =  416
Quantidades de artigos filtrados para o ano de 2017 =  498
(1065, 5)
(1278, 5)
Name:
Type: Graph
Number of nodes: 819
Number of edges: 884
Average degree:   2.1587
Name:
Type: Graph
Number of nodes: 956
Number of edges: 1055
Average degree:   2.2071
'''

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
                artigo[1], # 'id'
                autor, # 'author'
                artigo[2], # 'title'
                artigo[3], # 'summary'
                artigo[4]] # 'published_year'
            registros.append(registro)

    df = pd.DataFrame(
        registros, 
        columns=['id', 'author', 'title', 'summary', 'published_year'])

    return df

df_autor_artigos_2016 = gerar_dataframe_autor_artigos(artigos_2016)
print('\ndf_autor_artigos_2016.shape: ', df_autor_artigos_2016.shape)
df_autor_artigos_2016.to_csv(
    'nos_autores_2016_cat:math.AT.V6.a.csv',
    columns=['id', 'author', 'title', 'summary', 'published_year'], 
    encoding='utf-8', index=False, sep='@')

df_autor_artigos_2017 = gerar_dataframe_autor_artigos(artigos_2017)
print('df_autor_artigos_2017.shape: ', df_autor_artigos_2017.shape)
df_autor_artigos_2017.to_csv(
    'nos_autores_2017_cat:math.AT.V6.a.csv',
    columns=['id', 'author', 'title', 'summary', 'published_year'], 
    encoding='utf-8', index=False, sep='@')

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
            G.add_edge(a1, a2, id_link = i, title = title[0], summary = summary[0], Weight = 3)        

    return G

grafo_2016 = gerar_grafo(df_autor_artigos_2016)
grafo_2017 = gerar_grafo(df_autor_artigos_2017)

print('\nInformações dos grafos (antes da adição das arresta de predição): \n')
print('- grafo 2016: \n', nx.info(grafo_2016))
print('- grafo 2017: \n', nx.info(grafo_2017))

# Obter todos os nós 'autores' que podem ser preditos (podem ou não publicar 
# no futuro com base no valor '2' da distância entre eles):
lista_autores_predicao = []
for n1 in grafo_2016.nodes:
    # Faz todo o rastreamento de vizinhos dos vizinhos a apartir do nó 'n1'
    for n2 in grafo_2016.neighbors(n1):
        #print('Vizinho de ({}): {}'.format(n1, n2))
        assert(nx.shortest_path_length(grafo_2016, source=n1, target=n2) == 1)
        for n3 in grafo_2016.neighbors(n2):
            #print('\tVizinho de ({}): {}'.format(n2, n3))
            assert(nx.shortest_path_length(grafo_2016, source=n2, target=n3) == 1)
            if nx.shortest_path_length(grafo_2016, source=n1, target=n3) == 2:
                #print('\t\t({}) e ({}) tem distância igual a 2'.format(n1, n3))
                if not [n1, n3] in lista_autores_predicao:
                    lista_autores_predicao.append([n1, n3]) #Uma lista de listas

print('\nQuantidade de possiveis predições: {}'.format(len(lista_autores_predicao)))

def get_autores(artigos):
    autores = set()
    for artigo in artigos:
        for autor in artigo[0]:
            autores.add(autor)
    return autores

# Apenas autores que tenham alguma publicação nos dois anos
autores_validos = get_autores(artigos_2016).intersection(get_autores(artigos_2017))

for n1, n2 in lista_autores_predicao:
    #assert(nx.shortest_path_length(grafo_2016, source=n1, target=n2) == 2)
    # (apenas se o nó 'autor' estive publicado nos dois anos seguidos)
    # Colocar o calculo para ver se predição "(sim - VP) ou (não - VN)" aqui:
    if n1 in autores_validos and n2 in autores_validos:
        # O valor '?' para o atributo id_link serve pra informar que é uma predição de publicação.
        # O valor '6' para o atributo Weight serve pra diferenciar no gráfico que é uma aresta de predição
        grafo_2016.add_edge(n1, n2, id_link = '?', title = 'title', summary = 'summary', Weight = 6)
    
print('\nInformações dos grafos (depois da adição das arresta de predição): \n')
print('- grafo 2016: \n', nx.info(grafo_2016))
print('- grafo 2017: \n', nx.info(grafo_2017))

# export your data into Gephi’s GEXF format:
nx.write_gexf(grafo_2016, 'grafo_2016.V6.b.gexf')
nx.write_gexf(grafo_2017, 'grafo_2017.V6.b.gexf')

# VARIOS EXEMPLOS VER:

#assert(['Sarah Yeakel', 'Paul G. Goerss'] in lista_autores_predicao)
#assert(nx.shortest_path_length(grafo_2016, source='Sarah Yeakel', target='Paul G. Goerss') == 2)

# fell_whitehead_path = nx.shortest_path(G, source="Margaret Fell", target="George Whitehead")
# nx.connected_components(G)
# G.neighbors(1)
# nx.degree(G,2)
# G[1][2].update({0: 5})
# G.edges[1, 2].update({0: 5})
