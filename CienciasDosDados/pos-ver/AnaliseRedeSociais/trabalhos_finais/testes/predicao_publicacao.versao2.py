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

results = arxiv.query(search_query="cat:math.AT", start = 1, max_results = 10000)
'''
#V3
Quantidades de artigos baixados:  9937
Quantidades de artigos filtrados para o ano de 2016 =  416
Quantidades de artigos filtrados para o ano de 2017 =  498
(444, 5)
(491, 5)
Name:
Type: Graph
Number of nodes: 296
Number of edges: 209
Average degree:   1.4122
Name:
Type: Graph
Number of nodes: 296
Number of edges: 232
Average degree:   1.5676
'''

print('Quantidades de artigos baixados: ', len(list(results)))

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

print('Quantidades de artigos filtrados para o ano de 2016 = ', len(artigos_2016))
print('Quantidades de artigos filtrados para o ano de 2017 = ', len(artigos_2017))

def get_autores(artigos):
    autores = set()
    for artigo in artigos:
        for autor in artigo[0]:
            autores.add(autor)
    return autores

# Apenas autores que tenham alguma publicação nos dois anos
autores_validos = get_autores(artigos_2016).intersection(get_autores(artigos_2017))

# Lista para todos os artigos de um dados autor
def gerar_lista_autor_artigos(artigos):
    nos = []
    for artigo in artigos:
        for autor in artigo[0]:
            if autor in autores_validos:
                no = [
                    autor, # 'author'
                    artigo[1], # 'id'
                    artigo[2], # 'title'
                    artigo[3], # 'summary'
                    artigo[4]] # 'published_year'
                nos.append(no)
    return nos

def gerar_dataframe_autor_artigos(artigos):
    df = pd.DataFrame(
        gerar_lista_autor_artigos(artigos), 
        columns=['author', 'id', 'title', 'summary', 'published_year'])
    return df

df_autor_artigos_2016 = gerar_dataframe_autor_artigos(artigos_2016)
print(df_autor_artigos_2016.shape)
df_autor_artigos_2016.to_csv(
    'nos_autores_2016_cat:math.AT.V3.csv',
    # Mapeamento dos colunas (para importar no Gephi é obrigatorio ter: 'Id' e 'Label')
    # columns=['Id', 'Label', 'title', 'summary', 'published_year'], 
    columns=['author', 'id', 'title', 'summary', 'published_year'], 
    encoding='utf-8', index=False, sep='@')

df_autor_artigos_2017 = gerar_dataframe_autor_artigos(artigos_2017)
print(df_autor_artigos_2017.shape)
df_autor_artigos_2017.to_csv(
    'nos_autores_2017_cat:math.AT.V3.csv',
    # Mapeamento dos colunas (para importar no Gephi é obrigatorio ter: 'Id' e 'Label')
    # columns=['Id', 'Label', 'title', 'summary', 'published_year'], 
    columns=['author', 'id', 'title', 'summary', 'published_year'], 
    encoding='utf-8', index=False, sep='@')

# Construindo o grafo com nós para CADA AUTOR dos artigos:
# Para cada autor em 'authors' (desse artigo específico) deve-se criar um nó 
# (usando como 'label' o nome do autor e colocando [id, title, summary, year] como metadados do nó).
# E também criar todas as arestas ligando (de forma não direcionada) 
# todos esses autores do mesmo artigo.
def gerar_grafo(df_artigos):
    
    G = nx.Graph()

    #Adiciona os nós
    for row in df_artigos.iterrows():
        no = row[1]['author']
        if not G.has_node(no):
            G.add_node(no)
    
    #Adiciona as arestas
    for i in set(df_artigos.id):
        df = df_artigos[df_artigos['id'] == i]
        lista_autores = list(df['author'])
        title = list(set(df['title']))
        summary = list(set(df['summary']))
        for a1, a2 in itertools.combinations(lista_autores, 2):
            G.add_edge(a1, a2, id = i, title = title[0], summary = summary[0])        

    return G

grafo_2016 = gerar_grafo(df_autor_artigos_2016)
grafo_2017 = gerar_grafo(df_autor_artigos_2017)

assert(grafo_2016.number_of_nodes() == grafo_2017.number_of_nodes()) 

print(nx.info(grafo_2016))
print(nx.info(grafo_2017))

#grafo_2016.number_of_edges()
#grafo_2017.number_of_edges()
#list(grafo_2016.edges(data=True))[0]
# --> 'http://arxiv.org/abs/1603.08773v3'
#lista = [(v, u, d) for v, u, d in grafo_2016.edges(data=True) if d['id'] == 'http://arxiv.org/abs/1603.08773v3']
# len(lista)

# export your data into Gephi’s GEXF format:
nx.write_gexf(grafo_2016, 'grafo_2016.V3.gexf')

# fell_whitehead_path = nx.shortest_path(G, source="Margaret Fell", target="George Whitehead")

# nx.connected_components(G)
#  G.neighbors(1)
# nx.degree(G,2)
# G[1][2].update({0: 5})
# G.edges[1, 2].update({0: 5})

# Mapeamento dos colunas (para importar no Gephi é obrigatorio ter): 
# [Source,Target,Type,Weight]
# Onde:
# Source = 'Id' (author)
# Target = 'Id' (author)
# Type = undirected
# Weight = 1 "sem peso"