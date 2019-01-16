import networkx as nx
import matplotlib.pyplot as plt

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
print(degree)

print(G_symmetric.edges(data = True))


nx.spring_layout(G_symmetric)
nx.draw_networkx(G_symmetric)

plt.show()
