package tutorial.util;

import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

public class GeometryUtil {

	public static Geometry wktToGeometry(String wktPoint) {

		WKTReader fromText = new WKTReader();
		Geometry geom = null;
		try {
			geom = fromText.read(wktPoint);
			System.out.println(geom.toText());
		} catch (ParseException e) {
			throw new RuntimeException("Not a WKT string:" + wktPoint);
		}

		return geom;

	}

}
