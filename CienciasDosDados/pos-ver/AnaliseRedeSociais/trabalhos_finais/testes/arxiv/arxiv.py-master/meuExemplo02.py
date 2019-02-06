import arxiv # https://github.com/lukasschwab/arxiv.py
import pandas as pd

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
results = arxiv.query(search_query="cat:math.AT", max_results = 1)
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
'''
print([r for r in results if r.get("title", None)])

output = []
for result in results:
	#output['id'] = result['id']
	print(result['id'])
'''		
output['title'] = result['title'].rstrip('\n')
output['authors'] = [d['name'] for d in result['authors']]
output['published'] = result['published']
output['summary'] = result['summary'].rstrip('\n')
'''
