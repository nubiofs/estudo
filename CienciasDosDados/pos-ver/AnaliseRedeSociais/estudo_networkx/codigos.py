# https://www.datacamp.com/community/tutorials/social-network-analysis-python

#%%
import networkx as nx
import matplotlib.pyplot as plt

# Symmetric Networks
G_symmetric = nx.Graph()
G_symmetric.add_edge('Amitabh Bachchan','Abhishek Bachchan')
G_symmetric.add_edge('Amitabh Bachchan','Aamir Khan')
G_symmetric.add_edge('Amitabh Bachchan','Akshay Kumar')
G_symmetric.add_edge('Amitabh Bachchan','Dev Anand')
G_symmetric.add_edge('Abhishek Bachchan','Aamir Khan')
G_symmetric.add_edge('Abhishek Bachchan','Akshay Kumar')
G_symmetric.add_edge('Abhishek Bachchan','Dev Anand')
G_symmetric.add_edge('Dev Anand','Aamir Khan')

nx.spring_layout(G_symmetric)
nx.draw_networkx(G_symmetric)    
plt.show()

# Asymmetric Networks
G_asymmetric = nx.DiGraph()
G_asymmetric.add_edge('A','B')
G_asymmetric.add_edge('A','D')
G_asymmetric.add_edge('C','A')
G_asymmetric.add_edge('D','E')

nx.spring_layout(G_asymmetric)
nx.draw_networkx(G_asymmetric)    
plt.show()

#Weighted Networks
G_weighted = nx.Graph()
G_weighted.add_edge('Amitabh Bachchan','Abhishek Bachchan', weight=25)
G_weighted.add_edge('Amitabh Bachchan','Aaamir Khan', weight=8)
G_weighted.add_edge('Amitabh Bachchan','Akshay Kumar', weight=11)
G_weighted.add_edge('Amitabh Bachchan','Dev Anand', weight=1)
G_weighted.add_edge('Abhishek Bachchan','Aaamir Khan', weight=4)
G_weighted.add_edge('Abhishek Bachchan','Akshay Kumar',weight=7)
G_weighted.add_edge('Abhishek Bachchan','Dev Anand', weight=1)
G_weighted.add_edge('Dev Anand','Aaamir Khan',weight=1)

nx.spring_layout(G_weighted)
nx.draw_networkx(G_weighted)    
plt.show()

#Multigraph
G = nx.MultiGraph()
G.add_edge('A','B',relation = 'neighbor')
G.add_edge('A','B',relation = 'friend')
G.add_edge('B','C', relation = 'neighbor')
G.add_edge('D','C',relation = 'friend')

#nx.draw_networkx(G)    
#plt.show()
G.edges(data=True)

# Degree (Degree of a node defines the number of connections a node has.)
nx.degree(G_symmetric, 'Dev Anand') # 3

# Clustering Coefficient ()
nx.clustering(G_symmetric, 'Dev Anand') # 1
nx.clustering(G_symmetric, 'Abhishek Bachchan') # 0,67
nx.average_clustering(G_symmetric) # 0,87

# Distance
nx.shortest_path(G_symmetric, 'Dev Anand', 'Akshay Kumar')
nx.shortest_path_length(G_symmetric, 'Dev Anand', 'Akshay Kumar')

T = nx.bfs_tree(G_symmetric, 'Dev Anand')
nx.draw_networkx(T)    
plt.show()

# Eccentricity
nx.eccentricity(G_symmetric)
nx.eccentricity(G_symmetric, 'Dev Anand')
nx.eccentricity(G_symmetric, 'Abhishek Bachchan')

# Degree Centrality
nx.degree_centrality(G_symmetric)

# Eigenvector Centrality
nx.eigenvector_centrality(G_symmetric)

# Betweenness Centrality
nx.betweenness_centrality(G_symmetric)



#%%
