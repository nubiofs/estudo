:Author: Rafael Soto
:Author: Robert Anderson
:Version: |release|
:License: Create Commons with attribution

**************************************************
Discutindo a Arquitetura da Aplicação (GEO - JEE6)
**************************************************

.. contents::

Nesse capítulo vamos fazer um breve comentário sobre alguns recursos disponíveis no JEE 6 que iremos utilizar, além de propor uma arquitetura simples, porém funcional, para elaboração de aplicações WebGIS


#######################
Java Enterprise Edition
#######################


.. image:: images/jee_evolution.png
	:scale: 60


Podemos perceber pela imagem acima que o JEE vem evoluindo consideravelmente desde sua primeira versão em meados de 1999. Dessa forma, a versão JEE 6 carrega consigo muita maturidade, obtida ao longo de todos esses anos.

A cada versão podemos perceber a existência de objetivo central que deveria ser atendido. Consideramos a versão 5 da especificação um marco no desenvolvimento de aplicações Java. O grande objetivo do lançamento foi facilitar o desenvolvimento ou seja, tornar o mesmo mais produtivo. O recurso de metaprogramação mais conhecido como anotações na JEE5, foi o primeiro passo para tornar o desenvolvimento mais atraente e menos burocrático, pois, até então, desenvolver em JEE era um grande martírio: dezenas de arquivos de configuração, necessidade de criação de várias classes somente para "agradar" a especificação dentre outros fatores que afastaram consideravelmente os desenvolvedores do mundo Java.

.. sidebar:: Introducing the Java EE 6 Platform
	
	Como uma visão completa do JEE foge do escopo do curso, sugerimos a leitura do artigo http://tinyurl.com/255gcaj para ter um overview das principais novidades dessa versão.	

No nosso minicurso, não utilizaremos todos os recursos da nova especificação. Mas não se preocupem, o que veremos aqui será o suficiente para o desenvolvimento de aplicações reais. Além disso, não utilizaremos um servidor JEE completo como o JBoss ou Glassfish, por exemplo, utilizaremos o bom e velho Tomcat, ou seja, é muito fácil arranjar planos de hospedagem a um preço acessível.

Ao final deste roteiro, elaboramos de cortesia um detalhamento prático sobre as tecnologias discutidas neste capítulo.


##############################
Arquitetura de nossa aplicação
##############################


A figura abaixo demonstra de forma sucinta a arquitetura que vamos adotar na nossa aplicação:

.. image:: images/architecture.png
	:scale: 60

Vamos agora dar uma visão geral das responsabilidades de cada camada.


Java Server Faces - JSF
=======================


É nessa camada onde desenvolveremos as interfaces com o usuário. A tecnologia JSF proporciona uma melhor separação entre as camadas, tendo em vista que o código responsável pelo layout da página (.xhtml) e as regras do negócio (.java) residem em locais distintos.

Para trazer os recursos de geoprocessamento aos formulários e telas da nossa aplicação, vamos utilizar a componente OL4JSF. Desenvolvida a partir da arquitetura de componentes JSF e a api para mapas na web OpenLayers(http://www.openlayers.org) é possível alcançar um alto nível de integração com aplicações JSF além de ampliar o potencial de produtividade do desenvolvimento.

Context and Dependency Injection - CDI
======================================

.. sidebar:: Weld - JSR-299 Reference Implementation

	Para maiores informações consultar a `documentação oficial <http://docs.jboss.org/weld/reference/1.0.0/en-US/html/>`_.

Não é nenhuma novidade para os projetos em JAVA modernos utilizarem recursos de injeção de dependencia e contextos. Depois de diversos frameworks lograrem sucesso ao desenvolver mecanismos de injeção e contextos personalizados, eis que a JCP termina por decidir analisar todos os pontos positivos de cada framework e empacotar tudo numa especificação dentro da stack da JEE6 batizada de Context and Dependency Injection ou para os intimos CDI. O mais interessante desta nova especificação foi a integração do ciclo de vida de todos os componentes JEE(servlets, managed beans jsf, enterprise java beans e etc) dentro de um conjunto de contextos(AplicaçÃo, Sessão, Requisição, Conversação). Em resumo toda componente é reduzido ao conceito de bean gerenciado pelo CDI possibilitando a injeção de forma genérica e integrado.

Para o nosso projeto vamos utilizar o CDI para:

* Injetar o EntityManager JPA nas classes onde se faz necessário o acesso a dados;
* Criar e injetar managed beans para tratar eventos, ações e dados das views JSF;
* Gerenciar os contextos da aplicação *ResquestScope* e *SessionScope*;

De uma forma geral, vamos ver na prática como ficou RIDICULO o desenvolvimento de aplicações JEE com baixo acoplamento e alta coesão.

O CDI possui diversos recursos que tornam a vida do arquiteto mais fácil: Interceptors, decorators, qualifiers, stereotypes, etc. Vale a pena fazer uma leitura na documentação de referência do CDI.

Java Persistence Api - JPA
==========================

Quem nunca ouviu falar do Hibernate? É isso mesmo. Essa especificação veio padronizar aquilo que muitos desenvolvedores já utilizavam há bastante tempo. Hoje, o Hibernate é somente uma das possíveis implementações de JPA.

Certo, a utilização do Hibernate eu até compreendo, por que apareceu esse tal de hibernate-spatial? A JPA resolve muito bem o mapeamento objeto-relacional de tipos convencionais dos SGBDs (varchar, numeric, date, etc), porém em aplicações geoespaciais precisamos lidar com estruturas de dados geométricas e é aí onde a Java Persistence Api não é mais suficiente. Precisamos de alguma forma mapear esses tipos em nossas classes e o Hibernate fornece uma anotação (@Type) que nos permite isso.

.. sidebar:: HIBERNATE - Persistência Relacional para Java Idiomático

	Para saber mais sobre o Hibernate e JPA consultar http://tinyurl.com/269wmak.

Já o hibernate-spatial, fornece um dialeto do hibernate responsável por reconhecer esses novos tipos e fazer o "trabalho sujo" para nós, gerando os SQLs necessários e tornando a tão sonhada independência de banco menos traumática.


OK! Como JSF, CDI e JPA fechamos a parte JEE de nossa aplicação. Agora restam somente dois artefatos: o GeoServer e o Postgis.


Geoserver
=========

Não detalharemos o geoserver, pois ele será visto em capítulos posteriores. Mas para aguçar a curiosidade, podemos dizer que ele é responsável por disponibilizar os mapas, obtidos através de diversas origens, em formatos padronizados e reconhecíveis pelo OL4JSF. Achou interessante? Espere então só mais um pouco para ver o que esse cara é capaz de fazer.


Postgis
=======

Se não detalhamos o geoserver pelo fato dele ser abordado mais adiante, não detalharemos o Postgis, pois ele já foi abordado anteriormente. Somente para relembrar, é nele que estão armazenadas as nossas tabelas com atributos espaciais. ;)

#######################################
Definindo a Arquitetura no Projeto JAVA
#######################################

Vamos preparar a nossa aplicação para realizar a arquitetura descrita. Para isso vamos complementar o nosso projeto maven com as dependencias necessárias e definir os arquivos de configuração para que tudo funcione.


1. Vamos adicionar as seguintes dependencias no arquivo *pom.xml* do nosso projeto.

     * JSTL
     * SERVLET API
	 * JSF / JSF-API
	 * CDI-API
	 * WELD
	 * Hibernate / Hibernate Spatial
	 * Postgres / Postgis JDBC Driver
	 * OL4JSF

Arquivo pom.xml atualizado

.. literalinclude:: artifacts/pom.xml
     :language: xml
     
2. Na sequência vamos rodar o comando do maven para preparar as novas dependencias dentro do ambiente de desenvolvimento::

	user@geodojo-vm:~/geodojo/geodojo$ mvn -Dwtpversion=1.5 eclipse:eclipse

3. Precisamos agora configurar a nossa aplicação web para atuar com o JSF e CDI. Para isso vamos deixar o arquivo *web.xml* como abaixo
	
.. literalinclude:: artifacts/web.xml
     :language: xml
     
4. Na sequência vamos criar um simbolico *faces-config.xml*. No final deste roteiro vamos entender o porque de simbolico.

.. literalinclude:: artifacts/faces-config.xml
     :language: xml
     
4. Para que o CDI funcione corretamente vamos precisar adicionar os arquivos *context.xml* e *beans.xml* na pasta META-INF do projeto

.. literalinclude:: artifacts/context.xml
     :language: xml
     
.. literalinclude:: artifacts/beans.xml
     :language: xml
     
5. Para testar o funcionamento vamos criar um pequeno exemplo. Nele o usuário digita o nome e clica no botão "Diga olá".


	5.1. Vamos criar uma view jsf denominada *hellojsfcdi.xhtml* na pasta *src/main/webapp/hellojsfcdi.xhtml*:
		.. literalinclude:: artifacts/hellojsfcdi.xhtml
		     :language: xml
		     
	5.2. Vamos criar a classe java org.latinoware.geodojo.app.bean.HelloJSF que vai atender as necessidades da view hellojsfcdi 
		.. literalinclude:: artifacts/HelloJSF.java
		     :language: java
		     
	5.3. Executar o exemplo e verificar os resultados. Se tudo estiver correto no nosso projeto as telas abaixo devem ser verdadeiras.

		.. image:: images/jsf_example1.png

		A partir desse momento é executada uma ação no servidor e retornada a mensagem para o usuário.

		.. image:: images/jsf_example2.png

O CDI é tão simples que utilizamos no exemplo quase sem perceber. Os menos atentos talvez nem tenham percebido a existência da anotação **@Model** e que nenhum *ManagedBean* foi definido no arquivo faces-config.xml. Sabe o que aconteceu após a simples presença da anotação *@Model* ? Basicamente:

* A classe HelloJSF passou a ficar disponível nas páginas JSF através do nome "#{helloJSF}";
* A classe ganhou o escopo de requisição automático;

No próximo capítulo, iremos abordar falar sobre o HibernateSpatial.
