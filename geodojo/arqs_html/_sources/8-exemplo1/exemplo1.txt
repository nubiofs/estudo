:Author: Rafael Soto
:Author: Robert Anderson
:Version: |release|
:License: Create Commons with attribution

************************************************************************
  Exemplo1 - Enviando um geotwitt
************************************************************************
   
.. contents::

Vamos começar a aplicar o conhecimento aprendido até o momento para desenvolver funcionalidades muito próximas do que necessitamos nos sistemas da atualidade.
Neste exemplo, vamos construir um formulário de inclusão de dados onde um dos campos deste formulário é um mapa para permitir o cadastro de um ponto. O objetivo do formulário é enviar um twitt com a geolocalização do usuário através da api Twitter4J.

====================
Instalando Twitter4J
====================

1. Adicionar o repositorio e a dependencia para o Twitter4J no arquivo *pom.xml* do nosso projeto:

.. literalinclude:: artifacts/pom.xml
     :language: xml
        
2. Execute o comando para a atualização do projeto java::

	user@geodojo-vm:~/geodojo/geodojo$ mvn -Dwtpversion=1.5 eclipse:eclipse

Vamos fazer um teste para ver se a api está funcionando corretamente. Este teste vai enviar um twitt para o usuário @geodojo.


3. Crie o caso de teste org.latinoware.geodojo.app.teste.TesteTwitter4j.java

.. literalinclude:: artifacts/TesteTwitter4j.java
     :language: java

4. Se tudo correr bem o profile deve ser atualizado com o novo status.

	.. image:: images/twitt.png

===================================
Construindo o Formulário e Testando
===================================

1. Criar o arquivo *addGeotwitt.xhtml* na pasta webapp e adicionar o conteudo abaixo.

.. literalinclude:: artifacts/addGeotwitt.xhtml
     :language: xml

2. Vamos criar o nosso bean *org.latinoware.geodojo.app.bean.GeotwittBean* para tratar as requisições da view

.. literalinclude:: artifacts/GeotwittBean.java
	 :lines: 1- 7,16- 46,48-59,65- 82

3. Para que a nossa geometria seja criada corretamente vamos precisar criar o converter *org.latinoware.geodojo.app.converter. para o atributo geo.

.. literalinclude:: artifacts/GeometryConverter.java

4. Vamos testar e ver o que acontece.


========================
Visualizando os Twitts 
========================

1. Vamos construir a view *viewGeotwitt.xhtml* na pasta webapp para podermos visualizar a camada do geoserver **geotwitt** que já deve ter novos pontos.

.. literalinclude:: artifacts/viewGeotwitt.xhtml
     :language: xml

2. Vamos testar a view e verificar o resultado.

================================
Atualizando o Twitter de Verdade 
================================

1. Vamos utilizar a api *Twitter4J* para nos comunicar com o twitter e poder enviar de verdade um twitt para o perfil. Para isso vamos atualizar o nosso GeotwittBean.java.

.. literalinclude:: artifacts/GeotwittBean.java
	:language: java
	
2. Se a internet estiver disponível podemos testar o funcionamento e verificar um novo post no twitter.



