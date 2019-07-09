package org.geotools.tutorial.ler.geojson;

import java.awt.Color;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.geotools.data.DataUtilities;
import org.geotools.data.collection.ListFeatureCollection;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.feature.SchemaException;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.geotools.map.FeatureLayer;
import org.geotools.map.Layer;
import org.geotools.map.MapContent;
import org.geotools.styling.SLD;
import org.geotools.styling.Style;
import org.geotools.swing.JMapFrame;
import org.locationtech.jts.geom.Geometry;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.wololo.geojson.Feature;
import org.wololo.geojson.FeatureCollection;
import org.wololo.geojson.GeoJSONFactory;
import org.wololo.jts2geojson.GeoJSONReader;

public class ApiJts2GeojsonProj4Testes {

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

	//(IMPORTANTE):
	//qGIS (EPSG:4326 - WGS 84 - Geographic - Unit degrees) para 
	//geojson ("crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }) 
	private static SimpleFeature geoJsonToSimpleFeature(String geojson) throws Exception {

		SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(TYPE_POLYGON);

		String content = new String(Files.readAllBytes(Paths.get(geojson)), "UTF-8");

		FeatureCollection f = (FeatureCollection) GeoJSONFactory.create(content);

		GeoJSONReader reader = new GeoJSONReader();
		Geometry geo =reader.read(f.getFeatures()[0].getGeometry());

		if(geo.isValid()) {

			featureBuilder.add(geo);

		} else {
			System.out.println("[Error] A geometria não é válida!");
		}

		return featureBuilder.buildFeature(null);

	}

	private static SimpleFeatureCollection geoJsonToSimpleFeatureCollection(String geojson) throws Exception {

		String content = new String(Files.readAllBytes(Paths.get(geojson)), "UTF-8");

		//		GeoJsonReader reader = new GeoJsonReader();
		//		List<Geometry> listGeo = reader.readListGeometry(content);
		//		
		//		List<SimpleFeature> featuresList = new ArrayList<SimpleFeature>();		
		//		SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(TYPE_POLYGON);
		//		
		//		for(Geometry geo : listGeo) {
		//			if(geo.isValid()) {
		//				featureBuilder.add(geo);
		//				featuresList.add(featureBuilder.buildFeature(null));
		//			}
		//		}
		//		
		//		System.out.println("listGeo.size(): " + featuresList.size());
		//
		//		return new ListFeatureCollection(TYPE_POLYGON, featuresList);

				List<SimpleFeature> featuresList = new ArrayList<SimpleFeature>();		
				SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(TYPE_POLYGON);
		
		FeatureCollection features = (FeatureCollection) GeoJSONFactory.create(content);

		GeoJSONReader reader = new GeoJSONReader();

				for(Feature f : features.getFeatures()) {
					Geometry geo =reader.read(f.getGeometry());
					if(geo.isValid()) {
						featureBuilder.add(geo);
						featuresList.add(featureBuilder.buildFeature(null));
					}
				}

		
				return new ListFeatureCollection(TYPE_POLYGON, featuresList);


		
		
		
	}

	private static Layer criarFeatureLayer(SimpleFeature feature, Style style) throws Exception {

		List<SimpleFeature> features = new ArrayList<SimpleFeature>();        
		features.add(feature);
		return new FeatureLayer(new ListFeatureCollection(TYPE_POLYGON, features), style);
	}

	private static Layer criarFeaturesLayer(SimpleFeatureCollection features, Style style) throws Exception {

		//		List<SimpleFeature> featuresList = new ArrayList<SimpleFeature>();
		//		
		//		FeatureIterator<SimpleFeature> iterator = features.features();
		//		
		//		try {
		//			while(iterator.hasNext()) {
		//				SimpleFeature feature = iterator.next();
		//				featuresList.add(feature);
		//			}
		//			
		//		} finally {
		//			iterator.close();
		//		}
		//		
		//		return new FeatureLayer(new ListFeatureCollection(TYPE_POLYGON, featuresList), style);

		return new FeatureLayer(features, style);

	}

	public static void main(String[] args) throws Exception {

		// Create a map content and add our shapefile to it
		MapContent map = new MapContent();
		map.setTitle("Quickstart");

		//
		// Tratamento FeatureCollection (limite_municipal)
		//
		//String limite_municipal_geojson = "bh_limite_municipal_crs_4326_ok.geojson";//OK !!!
		String limite_municipal_geojson = "bh_limite_municipal_crs_32723_ok.geojson";//OK !!!
		SimpleFeature feature = geoJsonToSimpleFeature(limite_municipal_geojson);
		//Geometry bh_limite_municipal = (Geometry) feature.getDefaultGeometry();//OK
		Color strokeColor = new Color(144, 200, 120);
		Color fillColor = Color.RED;
		map.addLayer(criarFeatureLayer(feature, SLD.createPolygonStyle(strokeColor, fillColor, 1.0f)));

		//
		// Tratamento FeatureCollection (lotes)
		//
		//String bh_lotes_geojson = "bh_lotes_crs_4326_ok.geojson";//OK
		//"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::31983" } }
		String bh_lotes_geojson = "bh_lotes.geojson";//NOT OK (ERRO "Error parsing urn:ogc:def:crs:EPSG::31983 as crs id")
				SimpleFeatureCollection features = geoJsonToSimpleFeatureCollection(bh_lotes_geojson);
				Color strokeColor2 = new Color(40, 100, 20);
				Color fillColor2 = Color.BLUE;
				map.addLayer(criarFeaturesLayer(features, SLD.createPolygonStyle(strokeColor2, fillColor2, 1.0f)));

		// Now display the map
		JMapFrame.showMap(map);

	}

}
