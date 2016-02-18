package tutorial.util;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import br.gov.frameworkdemoiselle.annotation.Name;

public class JPAUtil {
	
	private static final EntityManagerFactory emFactory;
	private static final String persistenceUnitName = "tutorial.jpa";

    static {
        try {
            emFactory = Persistence.createEntityManagerFactory(persistenceUnitName);
        }catch(Throwable ex){
            System.err.println("Cannot create EntityManagerFactory.");
            throw new ExceptionInInitializerError(ex);
        }
    }

    public static EntityManager createEntityManager() {
        return emFactory.createEntityManager();
    }

    public static void close(){
        emFactory.close();
    }

}
