:Author: Rafael Soto
:Author: Robert Anderson
:Version: |release|
:License: Create Commons with attribution

**************************************
  Serviço de Mapas na Web - Geoserver
**************************************
   
.. contents::

Uma das principais componentes de um solução webgis é o servidor de mapas. O servidor de mapas é o responsavel por processar todas as fontes de dados presentes em diferentes tipos de bases, sejam elas arquivo, banco de dados, serviços na web e outros. Os dados processados são organizados na estrutura de layers e estas estarão disponiveis na web, através do protocolo HTTP, para serem consumidas no formato de imagem ou textual(vetores).

A OGC(Open Geospatial Consortium - http://www.ogc.org) regulamenta diversos padrões e formatos com especificações abertos para serem utilizados omo base nos OGC WebServices. Dentre estes serviços podemos destacar o WMS(Web Map Service), WFS(Web Feature Service) e o WCS(Web Coverage Services) que iremos trabalhar durante este modulo do roteiro.

No mundo opensource existem diversos servidores de mapas disponíveis onde podemos destacar o mapserver(http://umnmapserver.org) e geoserver(http://geoserver.org), ambos mantidos pela OSGEO(http://osgeo.org). O mapserver é considerado um dos mais antigos servidores de mapas opensource, escrito em *c/c++* e amplamente utilizado. Não iremos abordar o mapserver neste roteiro.

Geoserver é um servidor de mapas opensource escrito em Java que possibilita aos seus usuários o compartilhamento e edição de dados geoespaciais. Concebido sob uma otica de interoperabilidade de informações a partir do uso massivo de padrões abertos o geoserver hoje é considerado um dos melhores softwares do seu seguimento. A partir de uma interface totalmente web de gerenciamento, com alguns clicks e pouco entendimento já é possível publicar uma camada de dados geográficos na web. 

Durante este capítulo iremos abordar assuntos práticos, totalmente direcionados a configuração e disponibilização de camadas de dados geográficos na web. Como de praxe, sem muita conversa vamos ao que interessa!

##########################
Inicializando o Geoserver
##########################

Para poupar tempo, estamos utilizando o geoserver instalado na distribuição *LIVE DVD OSGEO*. Não iremos precisar seguir nenhum passo de instalação, apenas configurar o que for necessário para o nosso trabalho. Vamos inicializar o geoserver e fazer as primeiras demonstrações.

1. Acessar a opção no menu *Geospatial >> Web Services >> Start Geoserver*

.. image:: images/menu_start_geoserver.png


2. Se tudo correr bem uma tela com um OK deve surgir

.. image:: images/finish_init.png


3. O geoserver disponibiliza toda a sua interface de administração em formato web. Para iniciarmos as nossas configurações vamos efetuar o login como administrador do geoserver. 

	* Usuario: admin
	* Senha: geoserver
	
4. Na proxima sessão vamos iniciar configurando as nossas camadas.


##########################
Configurando Layer Mundo
##########################

Vamos criar nesta sessão as nossas camadas que serão utilizadas como base de fundo para os nossos mapas(BASE LAYER) e tambem como base de sobreposição. 

1. A nossa camada mundo é composta de um arquivo raster com uma imagem de satelite no formato tiff e um arquivo shapefile com os poligonos de todos os países do planeta. Vamos abrir a pasta *~/Desktop/GeoDojoEnv/data/world*

.. image:: images/pasta_world.png


2. Agora vamos copiar a pasta world para a pasta *~/Desktop/GeoDojoEnv/geoserver_data_dir/data/*

.. image:: images/copy_world.png


3. Vamos criar um namespace *geodojo* para o nosso roteiro para que tudo fique centralizado nele.

.. image:: images/create_workspace.png


.. image:: images/new_workspace.png

4. Vamos criar um novo *datastore* para adicionar os arquivos que irão compor a camada mundo.


	4.1. Primeiro vamos criar um datastore para o arquivo shapefile
	
	a) Acessando opção para criar um novo datastore shapefile
		.. image:: images/new_data_store1.png
	
	b) Configurando o datastore shapefile
		.. image:: images/new_vector_datastore1.png
	
	c) Datasource criado e pronto para a publicação dos seus dados
		.. image:: images/new_vector_datastore2.png


	4.2. Vamos criar um outro datastore para o arquivo raster
	
	
	a) Acessando opção para criar um novo datastore raster
		.. image:: images/new_data_store2.png
	
	b) Configurando o datastore raster
		.. image:: images/new_raster_datastore1.png
	
	c) Datasource criado e pronto para a publicação dos seus dados
		.. image:: images/new_raster_datastore2.png
	
	
	

	4.3. Vamos publicar uma nova *layer* com os dados do nosso shapefile datastore que acabamos de configurar
	
	a) Acessando opção para criar nova layer
		.. image:: images/add_new_layer.png
	
	b) Configurando a nova layer. Atentar para a geração dos enquadramentos
		.. image:: images/add_new_layer2.png
	
	
	4.4. Vamos publicar a *layer* com os dados do datastore raster
	
	a) Acessando opção para criar nova layer
		.. image:: images/add_new_layer_raster.png
	
	b) Configurando a nova layer
		.. image:: images/add_new_layer2_raster.png
	


5. Apos a criação de datastore e publicação dos dados no formato de serviço, podemos testar se tudo está funcionando corretamente. O geoserver disponibiliza uma ferramenta chamada *LayerPreview* onde é possível consumir os serviços e testa-los.
	
a) Acessando a ferramenta layer preview
	.. image:: images/layer_preview_1.png
	
b) Visualizando a camada mundo vetorial publicada
	.. image:: images/shapefile_layer_preview.png
		
c) Visualizando a camada mundo raster publicada
	.. image:: images/raster_layer_preview.png


6. Vamos precisar agrupar as duas camadas em apenas uma para poupar requisições ao servidor de aplicação e compor a nossa camada base. Para isso vamos usar o recurso do geoserver denominado *LayerGroup*
	
a) Acessando a funcionalidade para a criação de um layer group.	
	.. image:: images/new_layer_group.png

b) Agrupando as camadas. Atente para a sobreposição correta.	
	.. image:: images/new_layer_group.png
	
	
7. Agora vamos visualizar a nossa nova camada que na verdade é uma agregação de camadas.
	
	
.. image:: images/layer_group_preview.png
			
	
8. O próximo passo é estilizar a camada vetorial mundo. Note que da forma atual, o preenchimento dos poligonos está sobrepondo a camada raster. A nossa layer tambem não possui nenhuma label com os nomes dos paises. O geoserver utiliza o padrão *SLD* para definir estilos visuais de mapas. 

	Dica para quem quiser aprofundar os estudos no SLD
	http://tinyurl.com/34oqolf
	
	
Para facilitar o trabalho neste tutorial, já existe um arquivo SLD prontinho que foi criado especialmente para atender a nossa camada mundo. Vamos aprender nesta etapa como se define um estilo no geoserver.. Tomem cuidado pois é algo muitoooooo dificil! :)

a) Arquivo SLD
	.. literalinclude:: artifacts/country.sld
		:language: xml
	
b) Acessando a funcionalidade para adicionar um novo estilo	
	.. image:: images/add_new_style.png
	
c) Copiar e colar o xml SLD acima.
	.. image:: images/define_sld_country.png
	
d) Acessar a layer group e definir o estilo country para a camada vetorial
	.. image:: images/define_sld_country_2.png
	
e) Verificar o resultado no layer preview
	.. image:: images/sld_layer_preview.png 
	
	
############################
Configurando Layers Postgis
############################

Na seção anterior configuramos a camada mundo a partir de arquivos de dados geograficos. Nesta seção vamos aprender a configurar camadas a partir de tabelas de dados geográficos presentes na base postgis.
	
Primeiramento vamos criar um novo datastore que vai apontar para o nosso banco de dados *geodojo*

.. image:: images/add_postgis_datasource_1.png
	
Em seguida adicionar o datasource Postgis. Será exibida uma lista com todas as tabelas e views que possuem colunas geograficas presente no base de dados.

.. image:: images/lista_layers_geodojo.png

Vamos iniciar a publicação de algumas tabelas que configuramos anteriormente no Postgis. Note que algumas tabelas são derivadas de operações espaciais realizadas logo será possível visualizar o resultado.

=========================
Camada Limites Politicos
=========================

A camada de limites politicos consiste na divisão dos estados e divisão de municipios.


1. Publicar as layers *UF* e *Municipio*.

a) Resultado da camada de UF
	.. image:: images/layer_preview_uf.png

b) Resultado da camada de Municipio
	.. image:: images/layer_preview_municipio.png


2. Criar uma layer group com as layers *uf* e *municipio*

	
3. Definir o estilo SLD para a camada UF.


.. literalinclude:: artifacts/uf.sld
	:language: xml


4. Definir o estilo SLD para a camada Municipio.


.. literalinclude:: artifacts/municipio.sld
	:language: xml
	
5. O resultado final deve ser algo parecido com as screens abaixo


.. image:: images/municipio_uf_1.png


.. image:: images/municipio_uf_2.png

===========================
Camada Rodovias Paulista
===========================

1. Publicar a layer *rodovias_sp*


2. Definir estilo para a camada.


.. literalinclude:: artifacts/rodovia.sld
	:language: xml
	
3. Resultado

.. image:: images/rodoias_sp_preview.png


=================
Camada GeoTwitter
=================

1. Inserir dados na tabela geotwitt::

	insert into geotwitt(autor,mensagem,the_geom) values ('rafikdabahia','Estamos no @latinoware',ST_GeomFromText('POINT(-54.5820 -25.4607)',4326));

	insert into geotwitt(autor,mensagem,the_geom) values ('rafikdabahia','Regional SERPRO Brasilia',ST_GeomFromText('POINT(-47.87242 -15.78782)',4326));


2. Definir a layer geotwitt


3. Definir o estilo SLD twitt

.. literalinclude:: artifacts/twitt.sld
	:language: xml

4. O resultado final deve ser algo parecido com a figura abaixo


.. image:: images/layer_twitter.png



Finalizamos o capitulo sobre geoserver. O próximo capítulo vai contemplar a aplicação java propriamente dita com a utilização de CDI, JSF e OL4JSF.


