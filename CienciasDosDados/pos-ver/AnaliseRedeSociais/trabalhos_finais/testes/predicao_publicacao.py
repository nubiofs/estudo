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
        data_published = datetime.strptime(r.get('published'), '%Y-%m-%dT%H:%M:%SZ')
        if data_published.year == 2016:
            artigos_2016.append((
                r.get('id'), 
                r.get('title'), 
                autores,
                r.get('summary'),
                data_published.year))
        elif data_published.year == 2017:
            artigos_2017.append((
                r.get('id'), 
                r.get('title'), 
                autores,
                r.get('summary'),
                data_published.year))

print('Quantidades de artigos filtrados para o ano de 2016 = ', len(artigos_2016))
print('Quantidades de artigos filtrados para o ano de 2017 = ', len(artigos_2017))

def get_autores(artigos):
    autores = set()
    for art in artigos:
        for aut in art[2]:
            autores.add(aut)
    return autores

def gerar_dataframes(artigos_2016, artigos_2017):

    # Apenas autores que tenham alguma publicação nos dois anos
    autores_validos = get_autores(artigos_2016).intersection(get_autores(artigos_2017))

    def gerar_nos(artigos):
        nos = []
        for artigo in artigos:
            for autor in artigo[2]:
                if autor in autores_validos:
                    no = [
                        artigo[0], # 'id'
                        artigo[1], # 'title'
                        autor, # 'author'
                        artigo[3], # 'summary'
                        artigo[4]] # 'published_year'
                    nos.append(no)
        return nos

    df1 = pd.DataFrame(gerar_nos(artigos_2016), columns=['id', 'title', 'author', 'summary', 'published_year'])
    df2 = pd.DataFrame(gerar_nos(artigos_2017), columns=['id', 'title', 'author', 'summary', 'published_year'])
    return df1, df2

df_artigos_2016, df_artigos_2017 = gerar_dataframes(artigos_2016, artigos_2017)

print(df_artigos_2016.shape)
print(df_artigos_2017.shape)

df_artigos_2016.to_csv(
    'cat:math.AT_2016_full.csv',
    columns=['id', 'title', 'author', 'summary', 'published_year'], 
    encoding='utf-8', index=False, sep='@')

df_artigos_2017.to_csv(
    'cat:math.AT_2017_full.csv',
    columns=['id', 'title', 'author', 'summary', 'published_year'], 
    encoding='utf-8', index=False, sep='@')

# Aqui seria o local para criar os nós do grafo.
# Para cada autor em 'authors' (desse artigo específico) deve-se criar um nó 
# (usando como 'label' o nome do autor e colocando [id, title, summary, year] como metadados do nó).
# E também criar todas as arestas ligando (de forma não direcionada) 
# todos esses autores do mesmo artigo.
def gerar_grafos(df_artigos):
    # G = nx.from_pandas_edgelist(df_artigos, 'author', 'author', ['id', 'title', 'summary', 'published_year'])
    G = nx.from_pandas_edgelist(df = df_artigos, source = 'author', target = 'author', edge_attr = ['id', 'title', 'summary', 'published_year'])
    return G

G = gerar_grafos(df_artigos_2016)

# list(G.nodes(data=True))[0]
