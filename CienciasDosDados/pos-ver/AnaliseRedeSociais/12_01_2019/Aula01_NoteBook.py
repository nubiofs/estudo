# https://www.datacamp.com/community/tutorials/social-network-analysis-python
# aula1: https://www.datacamp.com/community/tutorials/social-network-analysis-python

#%%
import networkx as nx
import matplotlib.pyplot as plt
#get_ipython().run_line_magic('matplotlib', 'inline')

G_symmetric = nx.Graph()

G_symmetric.add_edge('Amitabh Bachchan','Abhishek Bachchan')
G_symmetric.add_edge('Amitabh Bachchan','Aamir Khan')
G_symmetric.add_edge('Amitabh Bachchan','Akshay Kumar')
G_symmetric.add_edge('Amitabh Bachchan','Dev Annand')
G_symmetric.add_edge('Amitabh Bachchan','Aamir Khan')
G_symmetric.add_edge('Amitabh Bachchan','Akshay Kumar')
G_symmetric.add_edge('Amitabh Bachchan','Dev Anand')
G_symmetric.add_edge('Dev Anand','Aamir Khan')

degree = nx.degree(G_symmetric, 'Dev Anand')
print('degree = %s' % degree)

coeficientDev = nx.clustering(G_symmetric, 'Dev Anand')
print('coeficientDev = %s' % coeficientDev)

coeficientAbhishek = nx.clustering(G_symmetric, 'Abhishek Bachchan')
print('coeficientAbhishek = %s' % coeficientAbhishek)

average = nx.average_clustering(G_symmetric)
print('average = %s' % average)

shortest_path = nx.shortest_path(G_symmetric, 'Dev Anand', 'Akshay Kumar')
print('shortest_path = %s' % shortest_path)

shortest_length = nx.shortest_path_length(G_symmetric, 'Dev Anand', 'Akshay Kumar')
print('shortest_length = %s' % shortest_length)

eccentricity = nx.eccentricity(G_symmetric)
eccentricityDev = nx.eccentricity(G_symmetric, 'Dev Anand')
eccentricityAbhishek = nx.eccentricity(G_symmetric, 'Abhishek Bachchan')
print('eccentricity = %s' % shortest_length)
print('eccentricityDev = %s' % eccentricityDev)
print('eccentricityAbhishek = %s' % eccentricityAbhishek)

degree_centrality = nx.degree_centrality(G_symmetric)
print('degree_centrality = %s' % degree_centrality)

eigenvector_centrality = nx.eigenvector_centrality(G_symmetric)
print('eigenvector_centrality = %s' % eigenvector_centrality)

betweenness_centrality = nx.betweenness_centrality(G_symmetric)
print('betweenness_centrality = %s' % betweenness_centrality)

nx.draw_networkx(G_symmetric)

#plt.show()

#########
#Facebook
G_fb = nx.read_edgelist('facebook_combined.txt', create_using = nx.Graph(), nodetype = int)

print(nx.info(G_fb))

nx.draw_networkx(G_fb)

plt.show()

pos = nx.spring_layout(G_fb)
betCent = nx.betweenness_centrality(G_fb, normalized=True, endpoints=True)

node_color = [20000.0 * G_fb.degree(v) for v in G_fb]
node_size = [v * 10000 for v in betCent.values()]

plt.figure(figsize=(20,20))
nx.draw_networkx(G_fb, pos=pos, with_labels=False, node_color = node_color, node_size=node_size)
plt.axis('off')

#ver se precisa:
#plt.show()

#%%
G_asymmetric = nx.DiGraph()
G_asymmetric.add_edge('A','B')
G_asymmetric.add_edge('A','D')
G_asymmetric.add_edge('C','A')
G_asymmetric.add_edge('D','E')

nx.spring_layout(G_asymmetric)
nx.draw_networkx(G_asymmetric)

plt.show()

'''
highest_betweenness_centrality = sorted(betCent, key = betCent.get, reverse = True)[:5]
print(highest_betweenness_centrality)
'''

#%%
G_weighted = nx.Graph()

G_weighted.add_edge('Amitabh Bachchan','Abhishek Bachchan', weight = 25)
G_weighted.add_edge('Amitabh Bachchan','Aamir Khan', weight = 2)
G_weighted.add_edge('Amitabh Bachchan','Akshay Kumar', weight = 5)
G_weighted.add_edge('Amitabh Bachchan','Dev Annand', weight = 15)
G_weighted.add_edge('Amitabh Bachchan','Aamir Khan', weight = 13)
G_weighted.add_edge('Amitabh Bachchan','Akshay Kumar', weight = 24)
G_weighted.add_edge('Amitabh Bachchan','Dev Anand', weight = 52)
G_weighted.add_edge('Dev Anand','Aamir Khan', weight = 25)

#Ver os metadados
print(G_weighted.edges(data = True))

nx.spring_layout(G_weighted)
nx.draw_networkx(G_weighted)

plt.show()

#%%
G = nx.MultiGraph()

G.add_edge('A','B', relation = 'neighbor')
G.add_edge('A','B', relation = 'friend')
G.add_edge('B','C', relation = 'neighbor')
G.add_edge('D','C', relation = 'friend')

print(G.edges(data = True))

nx.spring_layout(G)
nx.draw_networkx(G)

plt.show()

#%%

