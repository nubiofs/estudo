package org.hibernate.spatial.tutorials;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.hibernate.spatial.tutorials.entity.Event;
import org.hibernate.spatial.tutorials.util.GeometryUtil;
import org.hibernate.spatial.tutorials.util.JPAUtil;

import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.Point;

public class EventManager {
	
	//$ mvn exec:java -Dexec.mainClass="org.hibernate.spatial.tutorials.EventManager" -Dexec.args="store POINT(10 5)"
	//
	//Obs.: O próximo comando não está funcionando no prompt apenas em "Run as >> Run configuration >> Java Application (com o argumento: find POINT(10\ 5))"
	//$ ~/mvn exec:java -Dexec.mainClass="org.hibernate.spatial.tutorials.EventManager" -Dexec.args="find POINT(10\ 5)"
	//
	//Obs.: Para funcionar (o comando acima) no prompt usar:
	//$ ~/mvn exec:java -Dexec.mainClass="org.hibernate.spatial.tutorials.EventManager" -Dexec.args="'find' 'POINT(10 5)'"
	// Ou descomentar a linha 35: "List events = mgr.find(assemble(args));"
	public static void main(String[] args) {
		
        EventManager mgr = new EventManager();

        if (args[0].equals("store")) {
            mgr.createAndStoreEvent("My Event", new Date(), assemble(args));
        } else if (args[0].equals("find")) {
            List events = mgr.find(args[1]);
            //Para tirar o problema (no 2º comando) de passagem de argumento, usar:
            //List events = mgr.find(assemble(args));
            for (int i = 0; i < events.size(); i++) {
                Event event = (Event) events.get(i);
                System.out.println("Event: " + event.getTitle() +
                        ", Time: " + event.getDate() +
                        ", Location: " + event.getLocation());
            }
        }
        
        JPAUtil.close();
        
    }

    private void createAndStoreEvent(String title, Date theDate, String wktPoint) {
    	
        Geometry geom = GeometryUtil.wktToGeometry(wktPoint);

        if (!geom.getGeometryType().equals("Point")) {
            throw new RuntimeException("Geometry must be a point. Got a " + geom.getGeometryType());
        }

        EntityManager em = JPAUtil.createEntityManager();

        em.getTransaction().begin();

        Event theEvent = new Event();
        theEvent.setTitle(title);
        theEvent.setDate(theDate);
        theEvent.setLocation((Point) geom);
        em.persist(theEvent);
        em.getTransaction().commit();
        em.close();
        
    }

    /**
     * Utility method to assemble all arguments save the first into a String
     */
    private static String assemble(String[] args) {
        StringBuilder builder = new StringBuilder();
        for (int i = 1; i < args.length; i++) {
            builder.append(args[i]).append(" ");
        }
        return builder.toString();
    }
    
    /**
     * The find method takes a WKT string that represents a polygon, and searches the events 
     * table for all events that are located within this polygon.
     * @param wktFilter
     * @return
     */
    private List find(String wktFilter) {
        Geometry filter = GeometryUtil.wktToGeometry(wktFilter);
        EntityManager em = JPAUtil.createEntityManager();
        em.getTransaction().begin();
        Query query = em.createQuery("select e from Event e where st_within(e.location, :filter) = true", Event.class);
        query.setParameter("filter", filter);
        return query.getResultList();
    }

}
