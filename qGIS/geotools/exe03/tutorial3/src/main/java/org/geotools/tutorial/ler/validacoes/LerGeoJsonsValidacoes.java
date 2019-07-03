package org.geotools.tutorial.ler.validacoes;

import java.awt.Color;
import java.io.Reader;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.geotools.data.DataUtilities;
import org.geotools.data.collection.ListFeatureCollection;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.feature.FeatureIterator;
import org.geotools.feature.SchemaException;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.geotools.geojson.feature.FeatureJSON;
import org.geotools.geojson.geom.GeometryJSON;
import org.geotools.map.FeatureLayer;
import org.geotools.map.Layer;
import org.geotools.map.MapContent;
import org.geotools.styling.SLD;
import org.geotools.styling.Style;
import org.geotools.swing.JMapFrame;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.MultiPolygon;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;


//https://mvnrepository.com/artifact/com.vividsolutions/jts-example

//https://github.com/bjornharrtell/jts2geojson
//https://github.com/miguelcobain/jackson-geojson
//https://github.com/bedatadriven/jackson-datatype-jts
public class LerGeoJsonsValidacoes {

	private static SimpleFeatureType TYPE = null;
	private static SimpleFeatureType TYPE2 = null;

	static {

		try {
			//https://docs.geotools.org/latest/userguide/tutorial/feature/csv2shp.html
			//https://gitlab.com/snippets/5969
			TYPE = DataUtilities.createType(
					"Location",//featureName
					"geom:Polygon");

			System.out.println("TYPE:" + TYPE);

			TYPE2 = DataUtilities.createType(
					//"Location2",//featureName
					"Location",//featureName
					//"geom:MultiPolygon");
					//"the_geom:Point:srid=4326,"
					"geom:Polygon,idLote:String");

			//System.out.println("TYPE2:" + TYPE2);

		} catch (SchemaException e) {
			System.out.println(e.getMessage());
			System.exit(-1);
		}

	}

	private static SimpleFeature geoJsonToSimpleFeature(String geojson) throws Exception {

		//https://stackoverflow.com/questions/53957417/parse-geojson-file-with-java-topology-suite-or-geotools
		String content = new String(Files.readAllBytes(Paths.get(geojson)), "UTF-8");
		Reader reader = new StringReader(content);
		GeometryJSON gjson = new GeometryJSON();
		Polygon p = gjson.readPolygon(reader);

		SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(TYPE);
		featureBuilder.add(p);

		return featureBuilder.buildFeature(null);

	}

	private static SimpleFeatureCollection geoJsonToFeatureCollection(String geojson) throws Exception {

		//https://stackoverflow.com/questions/53957417/parse-geojson-file-with-java-topology-suite-or-geotools
		String content = new String(Files.readAllBytes(Paths.get(geojson)), "UTF-8");
		Reader reader = new StringReader(content);
		FeatureJSON fjson = new FeatureJSON();

		//fjson.setEncodeFeatureCRS(true);
		//GeometryCollection gc = gjson.readGeometryCollection(reader);

		FeatureIterator<SimpleFeature> features = fjson.streamFeatureCollection(reader);
		//FeatureIterator<SimpleFeature> features = fjson.streamFeatureCollection(content);

		List<SimpleFeature> featuresList = new ArrayList<SimpleFeature>();        

		SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(TYPE);
		//SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(TYPE2);

		double totalX = 0.0;
		double totalY = 0.0;
		long count = 0;

		try {
			while(features.hasNext()) {
				SimpleFeature feature = features.next();
				//System.out.println(feature.getIdentifier().getID()+"\n");
				//System.out.println(feature.getAttributes().stream().toString()+"\n");
				Object idLote = feature.getAttribute("ID_LOTE_CT");
				//System.out.println(idLote+"\n");
				Geometry geo = (Geometry) feature.getDefaultGeometry();
				//System.out.println(geo.getSRID());
				if(geo.isValid()) {
					//System.out.println("ok");
					Point centroid = geo.getCentroid();
					totalX += centroid.getX();
					totalY += centroid.getY();
					count++;
					featureBuilder.add(geo);
					//featureBuilder.add(idLote);//APENAS PARA "TYPE2"
					featuresList.add(featureBuilder.buildFeature(null));
				}
				//feature.getDefaultGeometryProperty().getDescriptor();
			}
		} finally {
			features.close();
		}

		double averageX = totalX / (double) count;
		double averageY = totalY / (double) count;
		Coordinate center = new Coordinate(averageX, averageY);

		System.out.println("Center of selected features:" + center);

		return new ListFeatureCollection(TYPE, featuresList);
		//return new ListFeatureCollection(TYPE2, featuresList);

	}

	private static SimpleFeatureCollection geoJsonToGeometryCollection(String geojson) throws Exception {

		List<SimpleFeature> featuresList = new ArrayList<SimpleFeature>();

		//https://stackoverflow.com/questions/53957417/parse-geojson-file-with-java-topology-suite-or-geotools
		String content = new String(Files.readAllBytes(Paths.get(geojson)), "UTF-8");
		Reader reader = new StringReader(content);
		GeometryJSON gjson = new GeometryJSON();
		SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(TYPE);
		MultiPolygon mp = gjson.readMultiPolygon(reader);
		if(mp.getNumGeometries() > 0) {
			System.out.println(mp.getLength());
			featureBuilder.add(mp.getGeometryN(0));
			featuresList.add(featureBuilder.buildFeature(null));
		}

		return new ListFeatureCollection(TYPE, featuresList);


	}

	//
	// Tratamento Feature (limite_municipal)
	//
	private static Layer limiteMunicipal(String geojson) throws Exception {

		SimpleFeature feature = geoJsonToSimpleFeature(geojson);

		Geometry geom = (Geometry) feature.getDefaultGeometry();
		if (geom != null && !geom.isValid()) {
			System.out.println("Invalid Geoemtry: " + feature.getID());
			System.exit(-1);
		}

		List<SimpleFeature> features = new ArrayList<SimpleFeature>();        
		features.add(feature);

		SimpleFeatureCollection collection = new ListFeatureCollection(TYPE, features);
		//SimpleFeatureCollection collection = new ListFeatureCollection(TYPE2, features);
		//https://docs.geotools.org/latest/userguide/tutorial/map/style.html
		Color strokeColor = new Color(22, 44, 32);
		Color fillColor = Color.CYAN;
		Style style = SLD.createPolygonStyle(strokeColor, fillColor, 1.0f);
		return new FeatureLayer(collection, style);

	}

	//
	// Tratamento FeatureCollection (lotes)
	//
	private static Layer lotes(String geojson) throws Exception {

		SimpleFeatureCollection collection = geoJsonToFeatureCollection(geojson);

		//https://docs.geotools.org/latest/userguide/tutorial/map/style.html
		Color strokeColor = new Color(144, 200, 120);
		Color fillColor = Color.RED;
		Style bh_lotes_style = SLD.createPolygonStyle(strokeColor, fillColor, 1.0f);
		return new FeatureLayer(collection, bh_lotes_style);

	}

	//
	// Tratamento Features (lotes2)
	//
	private static Layer lotesParaTeste(String geojson) throws Exception {

		SimpleFeatureCollection collection = geoJsonToGeometryCollection(geojson);

		//https://docs.geotools.org/latest/userguide/tutorial/map/style.html
		Color strokeColor = new Color(144, 200, 120);
		Color fillColor = Color.RED;
		Style bh_lotes_style = SLD.createPolygonStyle(strokeColor, fillColor, 1.0f);
		return new FeatureLayer(collection, bh_lotes_style);

	}

	//https://docs.geotools.org/latest/userguide/unsupported/geojson.html
	public static void main(String[] args) throws Exception {

		// Create a map content and add our shapefile to it
		MapContent map = new MapContent();
		map.setTitle("Quickstart");

		//
		// Tratamento Feature (limite_municipal)
		//
		String bh_limite_municipal_geojson = "bh_limite_municipal.geojson";//ok
		//
		map.addLayer(limiteMunicipal(bh_limite_municipal_geojson));


		//
		// Tratamento FeatureCollection (lotes)
		//
		String bh_lotes_geojson = "bh_lotes_teste.geojson";//OK
		//String bh_lotes_geojson = "bh_lotes.geojson";//NOT OK (ERRO "Error parsing urn:ogc:def:crs:EPSG::31983 as crs id")
		//
		map.addLayer(lotes(bh_lotes_geojson));

		//
		// Tratamento Feature (lote) 
		//
		//String lote_geojson = "apenasUmLote.geojson";//OK MAS APARECE SOZINHO (CRS DIFERENTES DOS DEMAIS LAYERS!
		//String lote_geojson = "apenasUmLote_teste.geojson";//OK MAS APARECE SOZINHO (CRS DIFERENTES DOS DEMAIS LAYERS!
		String lote_geojson = "apenasUmLote_teste2.geojson";//OK MAS APARECE SOZINHO (CRS DIFERENTES DOS DEMAIS LAYERS!
		//
		//map.addLayer(lotes2(lote_geojson));

		// Now display the map
		JMapFrame.showMap(map);

	}

}
