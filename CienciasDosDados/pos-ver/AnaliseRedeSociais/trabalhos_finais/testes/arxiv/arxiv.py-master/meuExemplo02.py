import arxiv # https://github.com/lukasschwab/arxiv.py
import pandas as pd
from datetime import datetime

'''
Table: search_query field prefixes prefix 	explanation

ti 		Title
au 		Author
abs 	Abstract
co 		Comment
jr 		Journal Reference
cat 	Subject Category
rn 		Report Number
id 		Id (use id_list instead)
all 	All of the above 
'''

# results é uma lista de json's
#results = arxiv.query(search_query="cat:math.AT", max_results = 1000)
results = arxiv.query(search_query="cat:math.AT", start = 2000, max_results = 6000)

print('Quantidades de artigos baixados: ', len(list(results)))

'''
 > results[0]
   
{'id': 'http://arxiv.org/abs/math/9503230v1',
 'guidislink': True,
 'updated': '1995-03-29T00:00:00Z',
 'updated_parsed': time.struct_time(tm_year=1995, tm_mon=3, tm_mday=29, tm_hour=0, tm_min=0, tm_sec=0, tm_wday=2, tm_yday=88, tm_isdst=0),
 'published': '1995-03-29T00:00:00Z',
 'published_parsed': time.struct_time(tm_year=1995, tm_mon=3, tm_mday=29, tm_hour=0, tm_min=0, tm_sec=0, tm_wday=2, tm_yday=88, tm_isdst=0),
 'title': 'On the cohomology of SL(2,Z[1/p])',
 'title_detail': {'type': 'text/plain',
  'language': None,
  'base': 'http://export.arxiv.org/api/query?search_query=cat%3Amath.AT&id_list=&start=0&max_results=1000&sortBy=relevance&sortOrder=descending',
  'value': 'On the cohomology of SL(2,Z[1/p])'},
 'summary': 'In this paper we compute the integral cohomology of the discrete groups\nSL(2,Z[1/p]), where p is any prime.',
 'summary_detail': {'type': 'text/plain',
  'language': None,
  'base': 'http://export.arxiv.org/api/query?search_query=cat%3Amath.AT&id_list=&start=0&max_results=1000&sortBy=relevance&sortOrder=descending',
  'value': 'In this paper we compute the integral cohomology of the discrete groups\nSL(2,Z[1/p]), where p is any prime.'},
 'authors': ['Alejandro Adem', 'Nadim Naffah'],
 'author_detail': {'name': 'Nadim Naffah'},
 'author': 'Nadim Naffah',
 'links': [{'href': 'http://arxiv.org/abs/math/9503230v1',
   'rel': 'alternate',
   'type': 'text/html'},
  {'title': 'pdf',
   'href': 'http://arxiv.org/pdf/math/9503230v1',
   'rel': 'related',
   'type': 'application/pdf'}],
 'arxiv_primary_category': {'term': 'math.AT',
  'scheme': 'http://arxiv.org/schemas/atom'},
 'tags': [{'term': 'math.AT',
   'scheme': 'http://arxiv.org/schemas/atom',
   'label': None}],
 'pdf_url': 'http://arxiv.org/pdf/math/9503230v1',
 'affiliation': 'None',
 'arxiv_url': 'http://arxiv.org/abs/math/9503230v1',
 'arxiv_comment': None,
 'journal_reference': None,
 'doi': None}

'''

'''
results[0].get('id')
Out[2]: 'http://arxiv.org/abs/math/9503230v1'

results[0].get('title')
Out[3]: 'On the cohomology of SL(2,Z[1/p])'

results[0].get('authors')
Out[4]: ['Alejandro Adem', 'Nadim Naffah']

results[0].get('published')
Out[5]: '1995-03-29T00:00:00Z'

results[0].get('summary')
Out[6]: 'In this paper we compute the integral cohomology of the discrete groups\nSL(2,Z[1/p]), where p is any prime.'

'''

'''
print([r for r in results if r.get("title", None)])
output = []
for result in results:
	#output['id'] = result['id']
	print(result['id'])
'''

'''		
output['title'] = result['title'].rstrip('\n')
output['authors'] = [d['name'] for d in result['authors']]
output['published'] = result['published']
output['summary'] = result['summary'].rstrip('\n')
'''

artigos_2016 = []
for r in results:
  data_published = datetime.strptime(r.get('published'), '%Y-%m-%dT%H:%M:%SZ')
  if data_published.year == 2016:
    autores = r.get('authors')
    if len(list(autores)) > 1:
      artigos_2016.append((
        r.get('id'), 
        r.get('title'), 
        autores,
        r.get('summary'),
        data_published.year))
    # Aqui seria o local para criar os nós do grafo.
    # Para cada autor em 'authors' (desse artigo específico) deve-se criar um nó 
    # (usando como 'label' o nome do autor e colocando [id, title, summary, year] como metadados do nó).
    # E também criar todas as arestas ligando (de forma não direcionada) 
    # todos esses autores do mesmo artigo.

print('Quantidades de artigos filtrados para o ano de 2016 = ', len(artigos_2016))

df_artigos_2016 = pd.DataFrame(artigos_2016, 
  columns=['id', 'title', 'authors', 'summary', 'published_year'])

print(df_artigos_2016.shape)

autores_2016 = set()
for art in artigos_2016:
  for aut in art[2]:
    autores_2016.add(aut)

print('Quantidades de autores = ', len(autores_2016))

df_artigos_2016.to_csv(
	'cat:math.AT_2016_3000Titles.csv',
	columns=['id', 'title', 'authors', 'summary', 'published_year'], 
 	encoding='utf-8', index=False, sep='@')
