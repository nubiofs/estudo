:Author: Rafael Soto
:Author: Robert Anderson
:Version: |release|
:License: Create Commons with attribution

***************************************************
 Quick Start - OSGEO Live DVD/Maven/Eclipse/Tomcat
***************************************************
   
.. contents::

Esta seção vai cobrir os passos para criação da estrutura inicial do projeto e ambiente de desenvolvimento.
Para facilitar este tutorial, vamos utilizar uma máquina virtual baseada na distribuição OSGEO Live DVD.

.. sidebar:: OSGEO Live DVD

	O live DVD da OSGEO pode ser baixado facilmente através
	do endereço http://live.osgeo.org/

########################
Criação do Projeto Maven
########################

1. Abra o console de comandos da estação e crie a pasta do projeto::
	
	$ mkdir ~/geodojo
	$ cd geodojo
	
.. image:: images/console.png
	:scale: 60

2. Utilizando o software maven vamos criar um novo projeto maven através do plugin *archetype*::

	$ mvn archetype:generate
	$ Choose a number:83
	$ Choose a number: 1
	$ Define value for property 'groupId': org.latinoware.geodojo.app
	$ Define value for property 'artifactId': : geodojo
	$ Define value for property 'version': 1.0-SNAPSHOT:
	$ Define value for property 'package': org.latinoware.geodojo.app:
	Confirm properties configuration:
	groupId: org.latinoware.geodojo.app
	artifactId: geodojo-app
	version: 1.0-SNAPSHOT
	package: org.latinoware.geodojo.app
	$ Y: Y
	
.. image:: images/archetype.png
  	 :scale: 60
   

Com o projeto maven criado, chegou a hora de montarmos o projeto na IDE Eclipse.

##############################
Criação do Projeto Eclipse WTP
##############################


1. A partir do plugin do maven(mojo) vamos criar o nosso projeto WTP do eclipse::

	$ cd geodojo-app/
	$ mvn -Dwtpversion=1.5 eclipse:eclipse

.. image:: images/console_instalacao_ambiente.png
   :scale: 60

.. sidebar:: Organização Pasta GeoDojoEnv

		A pasta GeoDojoEnv possui:
	
		* Tomcat 6 Servlet Container Java
		* Shapefiles e arquivos raster para alimentar o geoserver
		* Eclipse Helios IDE
		* Pasta data do geoserver

2. A partir da pasta *~/Desktop/GeoDojoEnv* vamos abrir o eclipse


.. image:: images/workspace_eclipse.png
   :scale: 60


3. Vamos importar o projeto do eclipse que foi criado pelo maven. Para tal devemos acionar::
 
	File >> Import... >> General >> Existing Projects in Workspace >> Next

.. image:: images/tela_importacao_projeto_1.png
   :scale: 60	
	

4. Em seguida devemos apontar para a pasta que criamos para o nosso projeto *~/geodojo/geodojo-app/*. 
	*Note que o projeto geodojo-app deve aparecer na listagem de projetos. Em seguida Finish.* 
	*A partir deste momento o nosso ambiente de desenvolvimento está pronto para edição.*

.. image:: images/tela_importacao_projeto2.png
   :scale: 60	


5. Caso o projeto apresente erros do tipo *Unbound classpath variable: 'M2_REPO/junit/junit/3.8.1/junit-3.8.1.jar' in project 'geodojo-app'*
	
	Será preciso configurar a variavel *M2_REPO* para que o eclipse encontre os arquivos *jars* que o maven baixou para o seu repositorio local(*~/.m2*)

	*Selecionar o projeto >> botão direito >> Properties >> Java Build Path >> Libraries >> Seleciona qualquer jar na listagem >> Edit >> Variable >> New*

.. image:: images/tela_variavel_m2repo1.png


Preencher os dados da variavel *M2_REPO* e apontar para o diretorio *~/.m2/repository* que é o local padrão onde o maven deposita os jars baixados

.. image:: images/tela_variavel_m2repo2.png

.. image:: images/tela_variavel_m2repo3.png


#####################################
Configurando o Projeto no TOMCAT 6.0
#####################################

#. Para finalizar esta etapa, vamos executar o programa no servidor de aplicação Tomcat::

	Click direito no projeto >> Run As >> Run on Server
	
.. image:: images/tela_configuracao_tomcat1.png

#. Na sequência devemos selecionar o nosso servidor de aplicação TOMCAT 6.0

#. Informar o local onde está instalado o TOMCAT 6.0 *~/Desktop/GeoDojoEnv/apache-tomcat-6.0.29*

.. image:: images/tela_config_tomcat2.png	

#. Finalizar a configuração e verificar a execução da aplicação

	Se tudo estiver correto a pagina inicial Hello World! deverá aparecer.


.. image:: images/tela_hello_world.png	

Encerramentos este modulo do minicurso. No próximo módulo iremos abordar o banco de dados espacial Postgis assim como preparar a base de dados para aplicação. 






