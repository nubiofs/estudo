:Author: Rafael Soto
:Author: Robert Anderson
:Version: |release|
:License: Create Commons with attribution

*****************************************************
 Exemplo 3 - Mapa de twitter hashtags com localização 
*****************************************************
   
.. contents::

Vamos agora criar mais uma integração com a rede social twitter. No exemplo 1, aprendemos como criar uma interface para envio de tweets com geolocalização. Neste exemplo o nosso desafio final é criar uma camada para o nosso mapa onde será possivel obter todos os tweets georrefenciados de um usuário.

Vamos utilizar um formato de mensagem de dados espaciais especifica chamada de GeoRSS. Sim! Um RSS com localização espacial.

1. Vamos criar uma a servlet *org.latinoware.geodojo.app.servlet.GeoRSS* responsavel por enviar consultas a API do twitter e retornar para o client web mensagens no padrão GeoRSS com os ultimos 10 tweets de um usuário que possue informações geográficas(GeoTag) agregadas.

.. literalinclude:: artifacts/GeoRSS.java
     :language: java
     
2. Na sequencia vamos criar a view geotweets.xhtml que renderiza o mapa com os geotweets do usuario *@geodojo*.

.. literalinclude:: artifacts/geotweets.xhtml
     :language: java

	
