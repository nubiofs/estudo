package org.geotools.tutorial.ler;

import java.awt.Color;
import java.awt.Desktop.Action;
import java.awt.Taskbar.Feature;
import java.awt.event.ActionEvent;
import java.io.Reader;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JButton;
import javax.swing.JOptionPane;
import javax.swing.JToolBar;

import org.geotools.data.DataUtilities;
import org.geotools.data.collection.ListFeatureCollection;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.geotools.geojson.geom.GeometryJSON;
import org.geotools.map.FeatureLayer;
import org.geotools.map.Layer;
import org.geotools.map.MapContent;
import org.geotools.styling.SLD;
import org.geotools.styling.Style;
import org.geotools.swing.JMapFrame;
import org.geotools.swing.action.SafeAction;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.Polygon;
import org.opengis.feature.FeatureVisitor;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.util.ProgressListener;

public class LerGeoJson {

	//https://docs.geotools.org/latest/userguide/unsupported/geojson.html
	public static void main(String[] args) throws Exception {

		//String geojson = "file.geojson";
		//String geojson = "testeGeoJson.json";
		String geojson = "apenasUmLote.geojson";
		
		//https://stackoverflow.com/questions/53957417/parse-geojson-file-with-java-topology-suite-or-geotools
		String content = new String(Files.readAllBytes(Paths.get(geojson)), "UTF-8");
		Reader reader = new StringReader(content);
		GeometryJSON gjson = new GeometryJSON();
		Polygon p = gjson.readPolygon(reader);
		//System.out.println("polygon: " + p);
		//

		//https://docs.geotools.org/latest/userguide/tutorial/feature/csv2shp.html
		//https://gitlab.com/snippets/5969
		final SimpleFeatureType TYPE = DataUtilities.createType(
				"Location",//featureName
				//"geom:Point");
				"geom:Polygon");
		SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(TYPE);
		featureBuilder.add(p);
		//

		//https://github.com/geotools/geotools/blob/master/modules/unsupported/geojson/src/test/java/org/geotools/geojson/FeatureJSONTest.java
		//CRS.decode("EPSG:4326");
		
		List<SimpleFeature> features = new ArrayList<SimpleFeature>();
		SimpleFeature feature = featureBuilder.buildFeature(null);
		//https://docs.geotools.org/latest/userguide/tutorial/geometry/geometrycrs.html
		Geometry geom = (Geometry) feature.getDefaultGeometry();
        if (geom != null && !geom.isValid()) {
            System.out.println("Invalid Geoemtry: " + feature.getID());
        }
        //
		features.add(feature);
		SimpleFeatureCollection collection = new ListFeatureCollection(TYPE, features);
		//String input = "1";
		//SimpleFeatureCollection collection = (SimpleFeatureCollection) new FeatureJSON().readFeatureCollection(input);

		//https://docs.geotools.org/latest/userguide/tutorial/map/style.html
		Color strokeColor = new Color(22, 44, 32);
		//Color fillColor = new Color(11, 33, 200);
		Color fillColor = Color.CYAN;
		Style style = SLD.createPolygonStyle(strokeColor, fillColor, 1.0f);
		Layer layer = new FeatureLayer(collection, style);
		//

		// Create a map content and add our shapefile to it
		MapContent map = new MapContent();
		map.setTitle("Quickstart");
		map.addLayer(layer);

//		//https://docs.geotools.org/latest/userguide/tutorial/geometry/geometrycrs.html
//		// Create a JMapFrame with custom toolbar buttons
//        JMapFrame mapFrame = new JMapFrame(map);
//        mapFrame.enableToolBar(true);
//        mapFrame.enableStatusBar(true);
//        JToolBar toolbar = mapFrame.getToolBar();
//        toolbar.addSeparator();
//        toolbar.add(new JButton(new ValidateGeometryAction()));
//        //toolbar.add(new JButton(new ExportShapefileAction()));
//        // Display the map frame. When it is closed the application will exit
//        mapFrame.setSize(800, 600);
//        mapFrame.setVisible(true);
//        //
		
		// Now display the map
		JMapFrame.showMap(map);

	}

}

//class ValidateGeometryAction extends SafeAction {
//    ValidateGeometryAction() {
//        super("Validate geometry");
//        putValue(Action.SHORT_DESCRIPTION, "Check each geometry");
//    }
//    public void action(ActionEvent e) throws Throwable {
//        int numInvalid = validateFeatureGeometry(null);
//        String msg;
//        if (numInvalid == 0) {
//            msg = "All feature geometries are valid";
//        } else {
//            msg = "Invalid geometries: " + numInvalid;
//        }
//        JOptionPane.showMessageDialog(
//                null, msg, "Geometry results", JOptionPane.INFORMATION_MESSAGE);
//    }
//    private int validateFeatureGeometry(ProgressListener progress) throws Exception {
//        final SimpleFeatureCollection featureCollection = featureSource.getFeatures();
//        // Rather than use an iterator, create a FeatureVisitor to check each fature
//        class ValidationVisitor implements FeatureVisitor {
//            public int numInvalidGeometries = 0;
//
//            public void visit(Feature f) {
//                SimpleFeature feature = (SimpleFeature) f;
//                Geometry geom = (Geometry) feature.getDefaultGeometry();
//                if (geom != null && !geom.isValid()) {
//                    numInvalidGeometries++;
//                    System.out.println("Invalid Geoemtry: " + feature.getID());
//                }
//            }
//        }
//        ValidationVisitor visitor = new ValidationVisitor();
//        // Pass visitor and the progress bar to feature collection
//        featureCollection.accepts(visitor, progress);
//        return visitor.numInvalidGeometries;
//    }
//}


