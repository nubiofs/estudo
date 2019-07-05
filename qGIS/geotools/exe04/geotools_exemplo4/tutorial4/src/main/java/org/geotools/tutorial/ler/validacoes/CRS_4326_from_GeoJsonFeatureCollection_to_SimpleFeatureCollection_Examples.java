package org.geotools.tutorial.ler.validacoes;

import java.awt.Color;
import java.io.Reader;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import javax.measure.spi.SystemOfUnits;

import org.geotools.data.DataUtilities;
import org.geotools.data.collection.ListFeatureCollection;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.feature.FeatureIterator;
import org.geotools.feature.SchemaException;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.geotools.geojson.feature.FeatureJSON;
import org.geotools.map.FeatureLayer;
import org.geotools.map.Layer;
import org.geotools.map.MapContent;
import org.geotools.styling.SLD;
import org.geotools.styling.Style;
import org.geotools.swing.JMapFrame;
import org.locationtech.jts.geom.Geometry;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class CRS_4326_from_GeoJsonFeatureCollection_to_SimpleFeatureCollection_Examples {

	private static SimpleFeatureType TYPE_POLYGON = null;

	static {

		try {
			TYPE_POLYGON = DataUtilities.createType(
					"Location",//featureName
					"geom:Polygon");

		} catch (SchemaException e) {
			System.out.println(e.getMessage());
			System.exit(-1);
		}

	}

	private static Layer criarLayer(SimpleFeatureCollection collection, Style style) throws Exception {
		return new FeatureLayer(collection, style);
	}

	//(IMPORTANTE):
	//qGIS (EPSG:4326 - WGS 84 - Geographic - Unit degrees) para 
	//geojson ("crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }) 
	private static SimpleFeatureCollection geoJsonToFeatureCollection(String geojson, Geometry limite_municipal) throws Exception {

		String content = new String(Files.readAllBytes(Paths.get(geojson)), "UTF-8");
		Reader reader = new StringReader(content);
		
		//teste+
		ObjectMapper mapper = new ObjectMapper();
		System.out.println(content);//OK ATE AQUI (TODO FIXME)
		JsonNode node = mapper.readTree(content);
		String type = node.get("crs").asText();
		System.out.println("--> Crs: " + type);
		//teste-

		FeatureIterator<SimpleFeature> features = 
				new FeatureJSON().streamFeatureCollection(reader);

		SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(TYPE_POLYGON);
		List<SimpleFeature> featuresList = new ArrayList<SimpleFeature>();

		int foraLimiteMunicipal = 0;
		int geometriaNaoValida = 0;

		try {

			while(features.hasNext()) {

				SimpleFeature feature = features.next();
				//System.out.println(feature.getBounds().getDimension());//OK
				//System.out.println(feature.getBounds());//OK
				//System.out.println(feature.getFeatureType());//OK
				System.out.println(feature.getDefaultGeometryProperty().getDescriptor());//OK
				//System.out.println(feature.getFeatureType().getGeometryDescriptor());
				Geometry geo = (Geometry) feature.getDefaultGeometry();
				//System.out.println(geo.getSRID());
				if(geo.isValid()) {

					//System.out.println("GeometryType = " + geo.getGeometryType());//Sempre "MultiPolygon"
					if(limite_municipal != null && 
							!limite_municipal.covers(geo)) {
						foraLimiteMunicipal = foraLimiteMunicipal + 1;
						System.out.println("[Warn] A feição [" + 
								feature.getIdentifier().getID() + 
								"] para [ID_LOTE_CT = " + 
								feature.getAttribute("ID_LOTE_CT") + 
								"] não está contida no limite municipal!");
						continue;
					}

					featureBuilder.add(geo);
					featuresList.add(featureBuilder.buildFeature(null));

				} else {
					geometriaNaoValida = geometriaNaoValida + 1;
					System.out.println("[Error] A geometria da feição [" +  
							feature.getIdentifier().getID() + "] não é válida!");
				}

				//System.out.println("feature.getAttribute(0): " + feature.getAttribute(0)+"\n");

			}

		} finally {
			features.close();
		}

		System.out.println("** Total [foraLimiteMunicipal = " + foraLimiteMunicipal + "] ; [geometriaNaoValida = " + geometriaNaoValida + "]");

		return new ListFeatureCollection(TYPE_POLYGON, featuresList);

	}

	public static void main(String[] args) throws Exception {

		// Create a map content and add our shapefile to it
		MapContent map = new MapContent();
		map.setTitle("Quickstart");

		//TODO FIXME
		/*
		//===> https://gis.stackexchange.com/questions/219555/geotools-unexpected-difference-between-crs-decodeepsg4326-and-defaultgeogr
		//org.locationtech.proj4j.CoordinateReferenceSystem worldCRS = new CoordinateReferenceSystem(name, params, datum, proj);
		CoordinateReferenceSystem sourceCRS = CRS.decode("EPSG:31256");
		//
		//Hints hints = new Hints(Hints.FORCE_LONGITUDE_FIRST_AXIS_ORDER, Boolean.TRUE);
		//CRSAuthorityFactory factory = ReferencingFactoryFinder.getCRSAuthorityFactory("EPSG", hints);
		//CoordinateReferenceSystem targetCRS = factory.createCoordinateReferenceSystem("EPSG:4326");
		//
		//CoordinateReferenceSystem[] sourceCRS = { CRS.decode("EPSG:4326"), DefaultGeographicCRS.WGS84 };
		//
		CoordinateReferenceSystem targetCRS = CRS.decode("EPSG:4326");
		//
		MathTransform transform = CRS.findMathTransform(sourceCRS, targetCRS);
		Geometry linestringNorthSouth = null;
		//===> https://github.com/geotools/geotools/blob/master/modules/plugin/epsg-wkt/src/test/java/org/geotools/referencing/epsg/wkt/CRSTest.java
		//https://docs.geotools.org/stable/userguide/library/referencing/crs.html
		System.out.println("northSouth: " + JTS.transform(linestringNorthSouth, transform).getLength() + "m");
		//System.out.println("eastWest: " + JTS.transform(linestringEastWest, transform).getLength() + "m");
		//
		 * 
		 */
		

		//
		// Tratamento FeatureCollection (limite_municipal)
		//
		String limite_municipal_geojson = "bh_limite_municipal_crs_4326_ok.geojson";
		SimpleFeatureCollection collection = geoJsonToFeatureCollection(limite_municipal_geojson, null);
		Geometry bh_limite_municipal = null;
		if(collection.size() == 1) {
			System.out.println("* Quantidade feições para limite municipal = 1");
			bh_limite_municipal = (Geometry) collection.features().next().getDefaultGeometry();
		}
		Color strokeColor = new Color(144, 200, 120);
		Color fillColor = Color.RED;
		map.addLayer(criarLayer(collection, SLD.createPolygonStyle(strokeColor, fillColor, 1.0f)));

		//
		// Tratamento FeatureCollection (lotes)
		//
		String lotes_geojson = "bh_lotes_crs_4326_ok.geojson";
//		collection = geoJsonToFeatureCollection(lotes_geojson, bh_limite_municipal);
//		if(bh_limite_municipal != null) {
//			System.out.println("* Quantidade feições de lotes (dentro do limite municipal) = " + collection.size());
//		}
//		strokeColor = new Color(35, 130, 200);
//		fillColor = Color.BLUE;
//		map.addLayer(criarLayer(collection, SLD.createPolygonStyle(strokeColor, fillColor, 1.0f)));

		// Now display the map
		JMapFrame.showMap(map);

	}

}
