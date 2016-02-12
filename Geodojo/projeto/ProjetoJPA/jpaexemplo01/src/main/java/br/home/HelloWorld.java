package br.home;

//import javax.inject.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HelloWorld {
    
	//@Inject
    //private final static Logger logger;
    
    private final static Logger logger = LoggerFactory.getLogger(HelloWorld.class);
  
	public static void say() {
        //System.out.println("Saying hello on console");
        logger.info("Saying hello on console");
	}
    
    public static void main(String[] args){
        
        HelloWorld.say();
                
    }
    
}
