:Author: Rafael Soto
:Author: Robert Anderson
:Version: |release|
:License: Create Commons with attribution

****************************************************
  Persistência de Dados Espacial - Hibernate Spatial
****************************************************
   
.. contents::


Não é novidade para nenhum desenvolvedor do mundo java falar sobre tecnologia ORM(Object-relational mapping). O hibernate, um dos frameworks mais consagrados do mercado, trouxe um avanço impar para o mundo do desenvolvimento de software quando o assunto é banco de dados relacional e aplicações orientadas a objetos. Podemos contar com os dedos os projetos que atualmente não utilizam este tipo de tecnologia para acesso a bancos de dados relacionais no mundo java. O hibernate fez tanto sucesso no mundo corporativo que terminou se tornando a base para a especificação Java Persistence API (JPA).

Apesar de prestar suporte para os mais diversos players de banco de dados do mundo, o hibernate não possui suporte explicito para o trato com dados geográficos oriundo das bases de dados geográficas. Para solucionar este problema, foi desenvolvida uma extensão genérica para o hibernate capaz de fazer o mesmo entender e tratar dados geográficos. Utilizando o hibernate spatial, trazemos para as nossas aplicações todo o potencial do framework hibernate para trabalhar com dados tradicionais e tambem dados geográfico de uma forma padronizada e transparente. Queries polimorficas, cross-database, mapeamento de heranças, cache de segundo nível e demais funcionalidades agregadas ao tratamento nativo dos dados geográficos torna o hibernate spatial uma das melhores opções para as aplicações geojava.

Neste capitulo vamos configurar o nosso projeto java para trabalhar com o hibernate spatial, JPA e postgis. Vamos mapear algumas classes para a nossa aplicação incluindo os mapeamentos de dados geográficos, criar as operações de CRUD e exemplificar algumas queries.

##########################################################
Configurando o projeto com HibernateSpatial e Postgis
##########################################################
	
1. Criar o arquivo *persistence.xml* no diretório resource/META-INF/persistence.xml

.. image:: images/metainf.png

2. Incluir o conteudo com as configurações da base de dados

.. literalinclude:: artifacts/persistence.xml
     :language: xml

3. Criar a classe de teste *org.latinoware.geodojo.app.teste.TestaFabricarEntityManager* e executar

.. literalinclude:: artifacts/TestaFabricaEntityManager.java
     :language: java	

4. Se tudo estiver correto, o teste deve dar OK(verde)

.. image:: images/testEntityManager.png
	
##############################
Mapeando Entidades Geograficas
##############################


==========
Municipio
==========

1. Vamos iniciar criando e mapeando a entidade *org.latinoware.geodojo.app.entity.Municipio*. Como a tabela de municipio é um pouco extensa, iremos mapear apenas parte dela para o nosso modelo de classes. Não se existe obrigatoriedade de mapear todas as colunas de uma tabela para o mundo Orientado a Objetosm claro que tomando as devidas precalções para as colunas NOT NULL.


	   .. literalinclude:: artifacts/Municipio.java
	      :language: java

2. Atente para o mapeamento da coluna de dados geograficos.


 .. code-block:: java
  
    @Column(name = "the_geom")
    @Type(type = "org.hibernatespatial.GeometryUserType")
    private MultiPolygon poligono;
    
3. Vamos criar um caso de teste para verificar se a nossa entidade está mapeada e funcionando corretamente junto ao banco de dados. Primeiramente vamos criar a estrutura do caso de teste que irá ser responsavel por iniciar e finalizar um *EntityManager* para nos comunicarmos com o banco de dados.

	   .. literalinclude:: artifacts/TestaMunicipioEntity.java
	      :language: java
	      :lines: 16-31

4. Para o nosso método de teste, vamos implementar uma consulta de todos os municipios presentes no estado de sergipe e verificar se todos são retornados.

	   .. literalinclude:: artifacts/TestaMunicipioEntity.java
	      :language: java
	      :lines: 33-42
    
5. Vamos colocar um breakpoint na linha do comando *Assert.assertTrue* e executar o JUnit em modo debug. Na sequencia vamos dar um *INSPECT* na lista, abrir uma entidade de municipio e olhar o atributo *poligono*


.. image:: images/inspect.png

6. Se tudo estiver correto, o teste deve dar OK(verde)

.. image:: images/testeMunicipio.png

==================
Unidade Federativa
==================

1. Vamos mapear a tabela de *uf* para a classe *UnidadeFederativa*

	   .. literalinclude:: artifacts/UnidadeFederativa.java
	      :language: java

2. Seguindo o padrão, vamos criar um caso de teste para esta entidade. Note que estamos utilizando um elemento de consulta espacial.

	   .. literalinclude:: artifacts/TestaUnidadeFederativa.java
	      :language: java

3. Se tudo estiver correto, o teste deve dar OK(verde) 

=========
GeoTwitt
=========

1. Vamos mapear a entidade que iremos utilizar para cadastrar os twitts. A principio um twitt possui 3 dados básicos(autor,mensagem e localizacao) sendo a mensagem um atributo de no maximo 140 caracteres.

	   .. literalinclude:: artifacts/Geotwitt.java
	      :language: java

2. Agora vamos criar a tabela para a nossa entidade. Note que a coluna geografica é criada a partir da função *AddGeometryColumn*.

	   .. literalinclude:: artifacts/create_geotwitt.sql
	      :language: sql

3. Seguindo o padrão, vamos criar um caso de teste para esta entidade. Desta vez vamos testar toda a operação CRUD.

	   .. literalinclude:: artifacts/TestaGeoTwitt.java
	      :language: java

########################################
Arquitetura de Injeção de EntityManager
########################################

Os exemplos de JPA que iremos implementar, vamos precisar obter um EntityManager para realizar operações sobre os dados no SGBD. A partir da estrutura do CDI vamos criar uma estrutura de injeção de dependencia, capaz de fabricar e injetar o EntityManager da nossa aplicação em qualquer classe java.


1. Vamos criar a classe *org.latinoware.geodojo.app.bean.producer.EntityManagerProducer* que será responsável por instanciar um EntityManager para ser injetado nas classes que necessitam deste recurso. O CDI disponibiliza uma estrutura denominada *Producer* para tratar esta necessidade.

2. Desta forma o CDI irá injetar automaticamente um EntityManager sempre que um bean possuir a seguinte estrutura:

	.. code-block:: java
		:linenos:
	
		public class BeanExemplo {
		
		    @Inject
		    private EntityManager em;
		}



Finalizamos então o modulo de HibernateSpatial. Durante o andamento do roteiro iremos abordando outros assuntos do hibernate spatial.

