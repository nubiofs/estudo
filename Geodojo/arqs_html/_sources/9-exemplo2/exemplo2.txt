:Author: Rafael Soto
:Author: Robert Anderson
:Version: |release|
:License: Create Commons with attribution

************************************************************************
  Exemplo2 - Construindo um visualizador de consultas espaciais
************************************************************************
   
.. contents::

Que tal utilizarmos o conhecimento adquirido e desenvolvermos um visualizador de consultas espaciais?

Não pense que vai ficar algo muito bonito, estamos nos concentrando na funcionalidade. Pra deixar bonito teríamos que pedir o auxílio para outras bibliotecas JSF ou até mesmo manipular CSS manualmente. Mas esse não é nosso caso, aqui faremos "interfaces de macho" (péssima expressão, mas tudo bem, vamos adiante)! :D

Vamos fazer aos poucos, passa a passo, seguindo a filosofia do *baby steps*.

1. Criar arquivo queryView.xhtml no diretório *geodojo/src/main/webapp*;

2. Para o exercício ficar mais interessante, vamos exibir o mapa de divisão politica do brasil que criamos no capítulo do geoserver. Segue o código:

.. code-block:: xml
	:linenos:

	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml"
		xmlns:h="http://java.sun.com/jsf/html"
		xmlns:f="http://java.sun.com/jsf/core"
		xmlns:ui="http://java.sun.com/jsf/facelets"
		xmlns:m="http://www.ol4jsf.org">
	
	<h:head>
	</h:head>
	<body>
	<h1>Query View</h1>
	<h:form prependId="false">
		<h:panelGroup id="mapPanel" layout="block">
				<m:map width="512px" height="480px"
			options="{controls: [], 
						maxExtent: new OpenLayers.Bounds(
	                    			-73.991, -33.751,
	                    			-32.378, 5.272
	                			),
						maxResolution: 0.16255078125					
						}" renderOnWindowLoad="false">
				<m:wmsLayer name="OpenLayers WMS"
					url="#{facesContext.externalContext.requestContextPath}/OL4JSFProxy/wms"
					params="{layers:'limite_politico'}" />
				<m:featureInfoPopup
					url="#{facesContext.externalContext.requestContextPath}/OL4JSFProxy/wms">
				</m:featureInfoPopup>
				<m:navigationControl />
				<m:panZoomBarControl />
				<m:layerSwitcherControl options="{ascending:false}" />
				<m:scaleLineControl />
				<m:mousePositionControl />
				<m:overviewMapControl />
				<m:permalinkControl />
			</m:map>
		</h:panelGroup>
	</h:form>
	</body>
	</html>
	
Ok! Nada de muito diferente até agora. Lembra quando falamos que o OL4JSF não engessa o desenvolvimento? Veja que utilizamos a API diretamente nas opções do nosso mapa. Colocamos também o nosso mapa dentro de um panelGroup para fazer algumas coisas legais mais adiante.


.. image:: images/ol4jsf_8.png
	:scale: 60

3. Agora vamos esquentar. Vamos adicionar uma camada vetorial cujo valor virá de um bean e, agora sim, as geometrias serão retornadas a partir de um SQL feito a partir de um textarea. Vamos alterar o nosso arquivo queryView.xhtml para ficar com o seguinte código:

.. code-block:: xml
	:linenos:

	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml"
		xmlns:h="http://java.sun.com/jsf/html"
		xmlns:f="http://java.sun.com/jsf/core"
		xmlns:ui="http://java.sun.com/jsf/facelets"
		xmlns:m="http://www.ol4jsf.org">
	
	<h:head>
	</h:head>
	<body>
	<h1>Query View</h1>
	<h:form prependId="false">
		<h:panelGroup id="mapPanel" layout="block">
				<m:map width="512px" height="480px"
			options="{controls: [], 
						maxExtent: new OpenLayers.Bounds(
	                    			-73.991, -33.751,
	                    			-32.378, 5.272
	                			),
						maxResolution: 0.16255078125					
						}" renderOnWindowLoad="false">
				<m:wmsLayer name="OpenLayers WMS"
					url="#{facesContext.externalContext.requestContextPath}/OL4JSFProxy/wms"
					params="{layers:'limite_politico'}" />
				<m:vectorLayer name="Query Result" value="#{queryViewManager.wkts}" />
				<m:featureInfoPopup
					url="#{facesContext.externalContext.requestContextPath}/OL4JSFProxy/wms">
				</m:featureInfoPopup>
				<m:navigationControl />
				<m:panZoomBarControl />
				<m:layerSwitcherControl options="{ascending:false}" />
				<m:scaleLineControl />
				<m:mousePositionControl />
				<m:overviewMapControl />
				<m:permalinkControl />
			</m:map>
		</h:panelGroup>
		<h:messages id="msg" globalOnly="true">
		</h:messages>
		<fieldset><legend>Consultas espaciais</legend> 
		<h:inputTextarea id="inputQuery" value="#{queryViewManager.query}" cols="60" rows="10">
		</h:inputTextarea>
		<p><h:commandButton value="Executar Consulta"
			action="#{queryViewManager.executeQuery}">		
		</h:commandButton></p>
		</fieldset>
	</h:form>
	</body>
	</html>

4. Hora de criar o bean! Crie a classe java *org.latinoware.geodojo.app.bean.QueryViewManager.java* com o seguinte código:

.. code-block:: java
	:linenos:

	package org.latinoware.geodojo.beans;
	
	import java.util.List;
	
	import javax.enterprise.inject.Model;
	import javax.faces.application.FacesMessage;
	import javax.faces.context.FacesContext;
	import javax.inject.Inject;
	import javax.persistence.EntityManager;
	import javax.persistence.Query;
	
	import org.ol4jsf.util.WKTFeaturesCollection;

	@Model
	public class QueryViewManager {
	
	    @Inject
	    EntityManager em;
	    private String query;
	
	    public String getQuery() {
	        return query;
	    }
	
	    public void setQuery(String query) {
	        this.query = query;
	    }
	    private String wkts;
	
	    public String getWkts() {
	        return wkts;
	    }
	
	    public void setWkts(String wkts) {
	        this.wkts = wkts;
	    }
	
            @SuppressWarnings("unchecked")
	    public void executeQuery() {
	        try {
	            WKTFeaturesCollection<String> wktFeatures = new WKTFeaturesCollection<String>();
	            Query q = em.createNativeQuery(query);
	            List<String> result = (List<String>) q.getResultList();
	            wktFeatures.addAllFeatures(result);	
	            setWkts(wktFeatures.toMap());
	        } catch (Exception ex) {
	            FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(ex.getMessage()));
	        }
	    }
	}

Viram alguma coisa demais? Aposto que não! O componente textarea vai setar o atributo query, o commandbutton vai executar o método executeQuery e retornar um conjunto de *features* que serão exibidas pela vectorLayer.

Nossa tela deve estar mais ou menos assim:

.. image:: images/ol4jsf_9.png
	:scale: 60

Vamos executar a consulta abaixo e visualizar o resultado:

.. code-block:: sql

	select st_astext(the_geom) from municipio where nome='ALTAMIRA'

.. image:: images/ol4jsf_10.png
	:scale: 60

O céu é o limite! Podemos fazer agora qualquer consulta espacial e exibir as geometrias retornadas. Vamos executar uma das consultas do capítulo sobre Postgis. Vamos exibir os 10 maiores municípios do país em área:

.. code-block:: sql
	:linenos:

	SELECT
	  st_astext(municipio.the_geom)
	FROM
	  public.municipio
	ORDER BY
	  ST_AREA(municipio.the_geom) DESC	
	LIMIT 10;

.. image:: images/ol4jsf_11.png
	:scale: 60

5. Nosso visualizador de consultas já está funcionando perfeitamente, mas que tal colocarmos um pouco de ajax na estória? Alterando o arquivo queryView.xhtml...

.. code-block:: xml
	:linenos:

	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml"
		xmlns:h="http://java.sun.com/jsf/html"
		xmlns:f="http://java.sun.com/jsf/core"
		xmlns:ui="http://java.sun.com/jsf/facelets"
		xmlns:m="http://www.ol4jsf.org">
	
	<h:head>
	</h:head>
	<body>
	<h1>Query View</h1>
	<h:form prependId="false">
		<h:panelGroup id="mapPanel" layout="block">
				<m:map width="512px" height="480px"
			options="{controls: [], 
						maxExtent: new OpenLayers.Bounds(
	                    			-73.991, -33.751,
	                    			-32.378, 5.272
	                			),
						maxResolution: 0.16255078125					
						}" renderOnWindowLoad="false">
				<m:wmsLayer name="OpenLayers WMS"
					url="#{facesContext.externalContext.requestContextPath}/OL4JSFProxy/wms"
					params="{layers:'limite_politico'}" />
				<m:vectorLayer name="Query Result" value="#{queryViewManager.wkts}" />
				<m:featureInfoPopup
					url="#{facesContext.externalContext.requestContextPath}/OL4JSFProxy/wms">
				</m:featureInfoPopup>
				<m:navigationControl />
				<m:panZoomBarControl />
				<m:layerSwitcherControl options="{ascending:false}" />
				<m:scaleLineControl />
				<m:mousePositionControl />
				<m:overviewMapControl />
				<m:permalinkControl />
			</m:map>
		</h:panelGroup>
		<h:messages id="msg" globalOnly="true">
		</h:messages>
		<fieldset><legend>Consultas espaciais</legend>
		<h:inputTextarea id="inputQuery" value="#{queryViewManager.query}" cols="60" rows="10">
		</h:inputTextarea>
		<p><h:commandButton value="Executar Consulta"
			action="#{queryViewManager.executeQuery}">
			<f:ajax execute="@this inputQuery qryLanguage" render="mapPanel msg" />
		</h:commandButton></p>
		</fieldset>
	</h:form>
	</body>
	</html>

Visualmente o nosso mapa não mudou nada, mas agora está executando a ação do botão via Ajax. Adicionamos uma única linha:

.. code-block:: xml

	<f:ajax execute="@this inputQuery qryLanguage" render="mapPanel msg" />

Achou que ajax seria complicado? :)

6. Estamos quase acabando. Vamos adicionar suporte a JPQL ao nosso visualizador. Vamos acrescentar um selectOneRadio, onde o usuário poderá escolher entre as opções: Postgis e JPQL. Vejamos a versão final do nosso queryView.xhtml e QueryViewManager.java, respectivamente:

.. code-block:: xml
	:linenos:

	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml"
		xmlns:h="http://java.sun.com/jsf/html"
		xmlns:f="http://java.sun.com/jsf/core"
		xmlns:ui="http://java.sun.com/jsf/facelets"
		xmlns:m="http://www.ol4jsf.org">
	
	<h:head>
	</h:head>
	<body>
	<h1>Query View</h1>
	<h:form prependId="false">
		<h:panelGroup id="mapPanel" layout="block">
				<m:map width="512px" height="480px"
			options="{controls: [], 
						maxExtent: new OpenLayers.Bounds(
	                    			-73.991, -33.751,
	                    			-32.378, 5.272
	                			),
						maxResolution: 0.16255078125					
						}" renderOnWindowLoad="false">
				<m:wmsLayer name="OpenLayers WMS"
					url="#{facesContext.externalContext.requestContextPath}/OL4JSFProxy/wms"
					params="{layers:'limite_politico'}" />
				<m:vectorLayer name="Query Result" value="#{queryViewManager.wkts}" />
				<m:featureInfoPopup
					url="#{facesContext.externalContext.requestContextPath}/OL4JSFProxy/wms">
				</m:featureInfoPopup>
				<m:navigationControl />
				<m:panZoomBarControl />
				<m:layerSwitcherControl options="{ascending:false}" />
				<m:scaleLineControl />
				<m:mousePositionControl />
				<m:overviewMapControl />
				<m:permalinkControl />
			</m:map>
		</h:panelGroup>
		<h:messages id="msg" globalOnly="true">
		</h:messages>
		<fieldset>
			<legend>Consultas espaciais</legend>
			<h:selectOneRadio id="qryLanguage" value="#{queryViewManager.qryLanguage}">
				<f:selectItem itemLabel="Postgis" itemValue="POSTGIS"></f:selectItem>
				<f:selectItem itemLabel="JPQL" itemValue="JPQL"></f:selectItem>
			</h:selectOneRadio>
			<h:inputTextarea id="inputQuery" value="#{queryViewManager.query}" cols="60" rows="10">
			</h:inputTextarea>
			<p><h:commandButton value="Executar Consulta"
			action="#{queryViewManager.executeQuery}">
			<f:ajax execute="@this inputQuery qryLanguage" render="mapPanel msg" />
		</h:commandButton></p>
		</fieldset>
	</h:form>
	</body>
	</html>

.. code-block:: java
	:linenos:

	package org.latinoware.geodojo.beans;
	
	import java.util.List;
	
	import javax.enterprise.inject.Model;
	import javax.faces.application.FacesMessage;
	import javax.faces.context.FacesContext;
	import javax.inject.Inject;
	import javax.persistence.EntityManager;
	import javax.persistence.Query;
	
	import org.ol4jsf.util.WKTFeaturesCollection;
	
	@Model
	public class QueryViewManager {
	
	    @Inject
	    EntityManager em;
	    private String query;
	
	    public String getQuery() {
	        return query;
	    }
	
	    public void setQuery(String query) {
	        this.query = query;
	    }
	    private String wkts;
	
	    public String getWkts() {
	        return wkts;
	    }
	
	    public void setWkts(String wkts) {
	        this.wkts = wkts;
	    }
	    private String qryLanguage = "POSTGIS";
	
	    public String getQryLanguage() {
	        return qryLanguage;
	    }
	
	    public void setQryLanguage(String qryLanguage) {
	        this.qryLanguage = qryLanguage;
	    }
	
	    @SuppressWarnings("unchecked")
	    public void executeQuery() {
	        try {
	            WKTFeaturesCollection<String> wktFeatures = new WKTFeaturesCollection<String>();
	            Query q;
	            if ("POSTGIS".equals(qryLanguage)) {
	                q = em.createNativeQuery(query); 
	            } else {
	                q = em.createQuery(query);
	            }
	            List<String> result = (List<String>) q.getResultList();
	            wktFeatures.addAllFeatures(result);
	
	            setWkts(wktFeatures.toMap());
	        } catch (Exception ex) {
	            FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(ex.getMessage()));
	        }

	    }
	}

Basicamente, no nosso bean adicionamos mais um atributo: qryLanguage. Esse atributo é setado pelo selectOneRadio da interface. No método executeQuery testamos o valor desse atributo e dependendo do seu valor executamos uma query nativa ou uma *java persistence query language* (JPQL). Simples assim! :)

Vamos repetir uma das consultas, agora utilizando JPQL:

.. code-block:: sql

	select theGeom from Municipio where nome = 'ALTAMIRA';

.. image:: images/ol4jsf_12.png
	:scale: 60

Percebam que não existe a necessidade de utilizar a função *st_astext()*, pois, na JPQL, o método toString() do objeto é chamado e já retorna o WKT relativo a *feature*.


Isso aí! O nosso visualizador de consultas versão 0.0.1a está protinho! O que acharam?