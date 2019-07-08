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
import org.geotools.feature.FeatureCollection;
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
import org.locationtech.jts.precision.EnhancedPrecisionOp;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;

//EPSG:4326
//“urn:ogc:def:crs:EPSG::4326”

//https://mvnrepository.com/artifact/com.vividsolutions/jts-example

//https://github.com/bjornharrtell/jts2geojson

//https://github.com/miguelcobain/jackson-geojson
//https://github.com/bedatadriven/jackson-datatype-jts

/*

 (https://docs.geotools.org/stable/userguide/library/data/shape.html)

 <dependency>
   <groupId>org.geotools</groupId>
   <artifactId>gt-shapefile</artifactId>
   <version>${geotools.version}</version>
 </dependency>

 CoordinateReferenceSystem crs = CRS.decode("EPSG:4326");
shape.forceSchemaCRS( crs );


 *   <li>{@code EPSG:4326} - this is the usual format understood to mean <cite>forceXY</cite>
 *       order prior to WMS 1.3.0. Note that the axis order is <em>not necessarly</em>
 *       (<var>longitude</var>, <var>latitude</var>), but this is the common behavior we observe
 *       in practice.
 *   <li>{@code AUTO:43200} -
 *   <li>{@code CRS:84} - similar to {@link DefaultGeographicCRS#WGS84} (formally defined by
 *       CRSAuthorityFactory)
 *   <li>{@code ogc:uri:.....} - understood to match the EPSG database axis order.
 *   <li>Well Known Text (WKT)


 */

public class LerGeoJsonsValidacoes {

	private static SimpleFeatureType TYPE = null;
	private static SimpleFeatureType TYPE2 = null;

	private static Geometry limiteMunicipalGeometry = null;

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
		//
		//System.out.println(gjson.read(reader).getSRID());
		//
		SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(TYPE);
		featureBuilder.add(p);

		//teste+
		//		FeatureJSON fjson = new FeatureJSON();
		//		fjson.setFeatureType(TYPE);
		//		FeatureIterator<SimpleFeature> features = fjson.streamFeatureCollection(reader);
		//		features.hasNext();
		//System.out.println("ID_LIMITE_" + feature.getProperty("ID_LIMITE_").getValue());
		//teste-

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
				//System.out.println(idLote+"\n");
				Geometry geo = (Geometry) feature.getDefaultGeometry();
				//System.out.println(geo.getSRID());
				if(geo.isValid()) {
					System.out.println("GeometryType = " + geo.getGeometryType());
					//System.out.println("ok");
					Point centroid = geo.getCentroid();
					totalX += centroid.getX();
					totalY += centroid.getY();
					count++;

					Geometry result = null;
					//teste+
					//System.out.println("Using EnhancedPrecisionOp allows the intersection to be performed with no errors:");
					//
					if(limiteMunicipalGeometry != null) {
						//result = EnhancedPrecisionOp.intersection(limiteMunicipalGeometry, geo);
						result = EnhancedPrecisionOp.intersection(limiteMunicipalGeometry, geo);
						/*
					try {
						System.out.println("This call to intersection will throw a topology exception due to robustness problems:");
						result = limiteMunicipalGeometry.intersection(geo);
					}
					catch (TopologyException ex) {
						ex.printStackTrace();
						System.out.println("[Error] " + ex.getMessage());
					}
						 */

						//TODO FIXME TRABALHAR SOBRE ESSE OPERADORES:
						/*
					limiteMunicipalGeometry.overlaps(g)
					limiteMunicipalGeometry.contains(g)
					limiteMunicipalGeometry.coveredBy(g)
					limiteMunicipalGeometry.covers(g)
					limiteMunicipalGeometry.getGeometryType()
						 */

						//teste-
						if(result.isValid() && !result.isEmpty()) {
							System.out.print("...");
							featureBuilder.add(geo);
							//featureBuilder.add(idLote);//APENAS PARA "TYPE2"
							featuresList.add(featureBuilder.buildFeature(null));
						} else {
							System.out.println("[Error] A geometria não esá dentro do limite municipal: [" + 
									feature.getIdentifier().getID() + "; " + feature.getAttribute("ID_LOTE_CT") + "]");
						}

					} else {

						featureBuilder.add(geo);
						featuresList.add(featureBuilder.buildFeature(null));

					}
					
					//System.out.println(feature.getAttributes().toString()+"\n");
					System.out.println(feature.getAttribute(1)+"\n");
					
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

		limiteMunicipalGeometry = (Geometry) feature.getDefaultGeometry();
		if (limiteMunicipalGeometry != null && !limiteMunicipalGeometry.isValid()) {
			System.out.println("Invalid Geoemtry: " + feature.getID());
			System.exit(-1);
		}
		System.out.println("SRID = " + limiteMunicipalGeometry.getSRID());
		System.out.println("GeometryType = " + limiteMunicipalGeometry.getGeometryType());

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
		//no qGIS -> 
		//	EPSG:32723 - WGS 84 / UTM zone 23S
		//	Geometry Type: Polygon
		//
		//"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::32723" } }
		String bh_limite_municipal_geojson = "bh_limite_municipal.geojson";//ok
		//
		//String bh_limite_municipal_geojson = "bh_limite_municipal_teste.geojson";
		//String bh_limite_municipal_geojson = "bh_limite_municipal_teste2.geojson";
		//
		//String bh_limite_municipal_geojson = "quadrado_bh.geojson";
		//String bh_limite_municipal_geojson = "quadrado_bh_teste.geojson";
		//
		//map.addLayer(limiteMunicipal(bh_limite_municipal_geojson));


		//
		// Tratamento FeatureCollection (lotes)
		//
		//String bh_lotes_geojson = "bh_lotes_teste.geojson";//OK
		//teste+
		//String bh_lotes_geojson = "bh_limite_municipal.geojson";//NOT OK ("Error parsing urn:ogc:def:crs:EPSG::32723 as crs id")
		//String bh_lotes_geojson = "bh_limite_municipal_teste.geojson";//NOT OK ("Error parsing urn:ogc:def:crs:EPSG::32723 as crs id")
		//String bh_lotes_geojson = "bh_limite_municipal_teste5.geojson";//OK OK OK !!! (não tem urn:ogc:def:crs:EPSG::32723)
		//String bh_lotes_geojson = "cp_limite_municipal_crs_84_notok.geojson"; NOT OK para "urn:ogc:def:crs:EPSG::4328"
		//teste-
		//
		//"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::31983" } }
		//String bh_lotes_geojson = "bh_lotes.geojson";//NOT OK (ERRO "Error parsing urn:ogc:def:crs:EPSG::31983 as crs id")
		//
		//
		//qGIS (EPSG:4326 - WGS 84 - Geographic - Unit degrees) para 
		//geojson ("crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }) 
		String bh_lotes_geojson = "cp_limite_municipal_crs_4326_ok.geojson";//===> OK OK !!!!
		//
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
