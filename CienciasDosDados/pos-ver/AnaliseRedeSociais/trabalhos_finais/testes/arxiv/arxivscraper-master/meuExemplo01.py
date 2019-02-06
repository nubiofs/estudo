import arxivscraper # https://github.com/Mahdisadjadi/arxivscraper
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

# from=' + self.f + '&until=

# Category = "physics" + "Condensed Matter"
# scraper = arxivscraper.Scraper(category = 'physics:cond-mat', date_from = '2016-01-01', date_until = '2017-01-01', t = 3)

scraper = arxivscraper.Scraper(category = 'stat', 
	date_from = '2016-01-01', date_until = '2017-01-01', t = 3,
	filters={'categories':['stat.ml'], 'abstract':['learning']})

# TODO (start=0&max_results=10)
# http://export.arxiv.org/api/query?search_query=all:electron&start=0&max_results=10

output = scraper.scrape()

cols = ('id', 'title', 'categories', 'abstract', 'doi', 'created', 'updated', 'authors')
df = pd.DataFrame(output, columns = cols)

'''
df.to_csv(
	'physics_CondensedMatter_2016_2017.csv',
	columns=['id', 'title', 'authors', 'abstract'], 
 	encoding='utf-8', index=False, sep='@')
'''

df.to_csv(
	'stat.ml_2016_2017.csv',
	columns=['id', 'title', 'authors', 'abstract'], 
 	encoding='utf-8', index=False, sep='@')



