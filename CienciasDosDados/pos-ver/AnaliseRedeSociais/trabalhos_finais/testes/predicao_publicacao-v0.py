import arxiv # https://github.com/lukasschwab/arxiv.py
import pandas as pd
from datetime import datetime
import networkx as nx

#results = arxiv.query(search_query="cat:math.AT", start = 2000, max_results = 10000)
results = arxiv.query(search_query="cat:math.AT", start = 2000, max_results = 1000)

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

def gerar_nos(artigos):
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

def gerar_dataframes_nos(artigos_2016, artigos_2017):

    df1 = pd.DataFrame(gerar_nos(artigos_2016), columns=['author', 'id', 'title', 'summary', 'published_year'])
    df2 = pd.DataFrame(gerar_nos(artigos_2017), columns=['author', 'id', 'title', 'summary', 'published_year'])
    return df1, df2

df_nos_autores_2016, df_nos_autores_2017 = gerar_dataframes_nos(artigos_2016, artigos_2017)

print(df_nos_autores_2016.shape)
print(df_nos_autores_2017.shape)

df_nos_autores_2016.to_csv(
    'nos_autores_2016_cat:math.AT.csv',
    # Mapeamento dos colunas (para importar no Gephi é obrigatorio ter: 'Id' e 'Label')
    # columns=['Id', 'Label', 'title', 'summary', 'published_year'], 
    columns=['author', 'id', 'title', 'summary', 'published_year'], 
    encoding='utf-8', index=False, sep='@')


df_nos_autores_2017.to_csv(
    'nos_autores_2017_cat:math.AT.csv',
    # Mapeamento dos colunas (para importar no Gephi é obrigatorio ter: 'Id' e 'Label')
    # columns=['Id', 'Label', 'title', 'summary', 'published_year'], 
    columns=['author', 'id', 'title', 'summary', 'published_year'], 
    encoding='utf-8', index=False, sep='@')

# Aqui seria o local para criar os nós do grafo.
# Para cada autor em 'authors' (desse artigo específico) deve-se criar um nó 
# (usando como 'label' o nome do autor e colocando [id, title, summary, year] como metadados do nó).
# E também criar todas as arestas ligando (de forma não direcionada) 
# todos esses autores do mesmo artigo.
'''
def gerar_grafos(df_artigos):
    # G = nx.from_pandas_edgelist(df_artigos, 'author', 'author', ['id', 'title', 'summary', 'published_year'])
    G = nx.from_pandas_edgelist(df = df_artigos, source = 'author', target = 'author', edge_attr = ['id', 'title', 'summary', 'published_year'])
    return G

G = gerar_grafos(df_nos_autores_2016)
'''

# teste+
# Construindo o grafo
def gerar_nos_grafo(df_artigos):
    G = nx.Graph()
    for row in df_artigos.iterrows():
        G.add_node(
            row[1]['author'], 
            id = row[1]['id'], 
            title = row[1]['title'], 
            summary = row[1]['summary'], 
            published_year = row[1]['published_year'])
    return G
#G_2016.add_edge(n1, n2, weight=row[1]['Weight'])
grafo_2016 = gerar_nos_grafo(df_nos_autores_2016)

# https://pandas.pydata.org/pandas-docs/stable/user_guide/groupby.html
for name, group in df_artigos_2016.groupby(['id', 'author']):
    print(name)
'''
('http://arxiv.org/abs/1612.06793v1', 'Andrzej Kozlowski')
('http://arxiv.org/abs/1612.06793v1', 'Kohhei Yamaguchi')
('http://arxiv.org/abs/1612.07142v1', 'Daniel Tanré')
('http://arxiv.org/abs/1612.08816v5', 'Daisuke Kishimoto')
('http://arxiv.org/abs/1612.08816v5', 'Sho Hasui')
'''

# https://www.shanelynn.ie/summarising-aggregation-and-grouping-data-in-python-pandas/
# list(df_artigos_2016[df_artigos_2016['id'] == 'http://arxiv.org/abs/1612.08816v5']['author'])

# df_artigos_2016.groupby(['id']).groups['http://arxiv.org/abs/1612.08816v5']
# df_artigos_2016[df_artigos_2016['id'] == 'http://arxiv.org/abs/1612.08816v5'].groupby('author')
'''
gp = df_artigos_2016.groupby('id')
for _, group in gp:
    print(group['author'])
'''

# g1 = df1.groupby( [ "Name", "City"] ).count()

'''
# https://www.tutorialspoint.com/python_pandas/python_pandas_groupby.htm
grouped = df.groupby('Year')
print grouped.get_group(2014)
'''
# df_artigos_2016.groupby('id').groups

# ===>
# export your data into Gephi’s GEXF format:
# nx.write_gexf(G, 'quaker_network.gexf')

# fell_whitehead_path = nx.shortest_path(G, source="Margaret Fell", target="George Whitehead")

'''
for n in grafo.nodes():
     print(n, grafo.node[n]['id'])
'''

#  [(n, v) for n, v, d in grafo.nodes(data=True) if n.d['id'] == v.d['id']]

# [grafo.add_edge(u, v, d) for u, v, d in grafo.edges(data=True) if d['weight'] == 6]

# teste-

# print(nx.info(grafo))

# nx.connected_components(G)
#  G.neighbors(1)
# nx.degree(G,2)
# G[1][2].update({0: 5})
# G.edges[1, 2].update({0: 5})

# len(list(grafo_2016.nodes()))
# list(grafo_2016.nodes(data=True))[0]
# df_artigos_2016[df_artigos_2016['author'] == 'Laurentiu Maxim']
'''
http://arxiv.org/abs/1602.04943v1
http://arxiv.org/abs/1607.05521v1 
'''


# Mapeamento dos colunas (para importar no Gephi é obrigatorio ter): 
# [Source,Target,Type,Weight]
# Onde:
# Source = 'Id' (author)
# Target = 'Id' (author)
# Type = undirected
# Weight = 1 "sem peso"