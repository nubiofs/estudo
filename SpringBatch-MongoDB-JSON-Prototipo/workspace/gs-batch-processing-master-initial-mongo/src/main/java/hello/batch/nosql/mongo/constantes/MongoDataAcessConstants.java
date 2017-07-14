package hello.batch.nosql.mongo.constantes;

public class MongoDataAcessConstants {

	public static final String DB_NAME = "test";
	public static final String COLLECTION_NAME = "carro"; 
	
	public static final String HOST = System.getProperty("host", "127.0.0.1");
	public static final int PORT = Integer.parseInt(System.getProperty("port", "27017"));
	
}
