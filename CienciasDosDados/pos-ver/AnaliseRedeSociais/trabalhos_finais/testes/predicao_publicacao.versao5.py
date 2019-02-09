import arxiv # https://github.com/lukasschwab/arxiv.py
import pandas as pd
from datetime import datetime
import networkx as nx
import itertools

#results = arxiv.query(search_query="cat:math.AT", start = 2000, max_results = 1000)
'''
run predicao_publicacao.versao2.py
Quantidades de artigos baixados:  1000
Quantidades de artigos filtrados para o ano de 2016 =  109
Quantidades de artigos filtrados para o ano de 2017 =  164
(104, 5)
(107, 5)
Name:
Type: Graph
Number of nodes: 67
Number of edges: 50
Average degree:   1.4925
Name:
Type: Graph
Number of nodes: 67
Number of edges: 44
Average degree:   1.3134
'''

#results = arxiv.query(search_query="cat:math.AT", start = 2000, max_results = 10000)
'''
#V2
Quantidades de artigos baixados:  7938
Quantidades de artigos filtrados para o ano de 2016 =  398
Quantidades de artigos filtrados para o ano de 2017 =  498
(420, 5)
(475, 5)
Name:
Type: Graph
Number of nodes: 284
Number of edges: 200
Average degree:   1.4085
Name:
Type: Graph
Number of nodes: 284
Number of edges: 216
Average degree:   1.5211
'''

#results = arxiv.query(search_query="cat:math.AT", start = 2000, max_results = 1000)
'''
#V4
Quantidades de artigos baixados:  1000
Quantidades de artigos filtrados para o ano de 2016 =  109
Quantidades de artigos filtrados para o ano de 2017 =  164
(277, 5)
(429, 5)
Name:
Type: Graph
Number of nodes: 214
Number of edges: 217
Average degree:   2.0280
Name:
Type: Graph
Number of nodes: 344
Number of edges: 379
Average degree:   2.2035
'''

#results = arxiv.query(search_query="cat:math.AT", max_results = 10000)
'''
#V5
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

results = arxiv.query(search_query="cat:math.AT", start = 2000, max_results = 500)
'''
#V6
Quantidades de artigos baixados:  500
Quantidades de artigos filtrados para o ano de 2016 =  100
Quantidades de artigos filtrados para o ano de 2017 =  154
(254, 5)
(403, 5)
Name:
Type: Graph
Number of nodes: 206
Number of edges: 205
Average degree:   1.9903
Name:
Type: Graph
Number of nodes: 323
Number of edges: 355
Average degree:   2.1981
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

print('\nQuantidades de artigos filtrados para o ano de 2016 = ', len(artigos_2016))
print('Quantidades de artigos filtrados para o ano de 2017 = ', len(artigos_2017))

# Lista para todos os registros para um dado artigo e seu autores
def gerar_registros_artigo_com_autores(artigos):
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
    return registros

def gerar_dataframe_autor_artigos(artigos):
    df = pd.DataFrame(
        gerar_registros_artigo_com_autores(artigos), 
        columns=['id', 'author', 'title', 'summary', 'published_year'])
    return df

df_autor_artigos_2016 = gerar_dataframe_autor_artigos(artigos_2016)
print('\ndf_autor_artigos_2016.shape: ', df_autor_artigos_2016.shape)
df_autor_artigos_2016.to_csv(
    'nos_autores_2016_cat:math.AT.V6.a.csv',
    # Mapeamento dos colunas (para importar no Gephi é obrigatorio ter: 'Id' e 'Label')
    # columns=['Id', 'Label', 'title', 'summary', 'published_year'], 
    columns=['id', 'author', 'title', 'summary', 'published_year'], 
    encoding='utf-8', index=False, sep='@')

df_autor_artigos_2017 = gerar_dataframe_autor_artigos(artigos_2017)
print('df_autor_artigos_2017.shape: ', df_autor_artigos_2017.shape)
df_autor_artigos_2017.to_csv(
    'nos_autores_2017_cat:math.AT.V6.a.csv',
    # Mapeamento dos colunas (para importar no Gephi é obrigatorio ter: 'Id' e 'Label')
    # columns=['Id', 'Label', 'title', 'summary', 'published_year'], 
    columns=['id', 'author', 'title', 'summary', 'published_year'], 
    encoding='utf-8', index=False, sep='@')

# Construindo o grafo com nós para CADA AUTOR dos artigos:
# Para cada autor em 'authors' (desse artigo específico) deve-se criar um nó 
# (usando como 'label' o nome do autor e colocando [id, title, summary, year] como metadados do nó).
# E também criar todas as arestas ligando (de forma não direcionada) 
# todos esses autores do mesmo artigo.
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

# Obtem todas as arestas que possuem o nó:
# grafo_2016.edges(['Kate Ponto'])

# Obtem todas as arestas que possuem os dois nós ou pelo menos um deles:
#grafo_2016.edges(['Kate Ponto', 'Sarah Yeakel'])

# Obter todos os nós que podem ser preditos:
lista_autores_predicao = []
for n0 in grafo_2016.nodes:
    # Faz todo o rastreamento de vizinhos dos vizinhos a apartir do nó 'n0'
    for n1 in grafo_2016.neighbors(n0):
        #print('Vizinho de ({}): {}'.format(n0, n1))
        assert(nx.shortest_path_length(grafo_2016, source=n0, target=n1) == 1)
        for n2 in grafo_2016.neighbors(n1):
            #print('\tVizinho de ({}): {}'.format(n1, n2))
            assert(nx.shortest_path_length(grafo_2016, source=n1, target=n2) == 1)
            if nx.shortest_path_length(grafo_2016, source=n0, target=n2) == 2:
                #print('\t\t({}) e ({}) tem distância igual a 2'.format(n0, n2))
                if not [n0, n2] in lista_autores_predicao:
                    lista_autores_predicao.append([n0, n2]) #Uma lista de listas

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
    grafo_2016.add_edge(n1, n2, id_link = '?', title = 'title', summary = 'summary', Weight = 6)
    
print('\nQuantidade de predições: {}'.format(len(lista_autores_predicao)))

print('\nInformações dos grafos (depois da adição das arresta de predição): \n')
print('- grafo 2016: \n', nx.info(grafo_2016))
print('- grafo 2017: \n', nx.info(grafo_2017))

# export your data into Gephi’s GEXF format:
nx.write_gexf(grafo_2016, 'grafo_2016.V6.a.gexf')
nx.write_gexf(grafo_2017, 'grafo_2017.V6.a.gexf')

# VARIOS EXEMPLOS VER:

#assert(['Sarah Yeakel', 'Paul G. Goerss'] in lista_autores_predicao)
#assert(nx.shortest_path_length(grafo_2016, source='Sarah Yeakel', target='Paul G. Goerss') == 2)

# fell_whitehead_path = nx.shortest_path(G, source="Margaret Fell", target="George Whitehead")
# nx.connected_components(G)
# G.neighbors(1)
# nx.degree(G,2)
# G[1][2].update({0: 5})
# G.edges[1, 2].update({0: 5})
