package com.javasampleapproach.springbatch.step;
 
import java.util.List;
 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemWriter;
 
/**
 * public interface ItemWriter: Basic interface for generic output operations. 
 * Class implementing this interface will be responsible for serializing objects 
 * as necessary. Generally, it is responsibility of implementing class to decide 
 * which technology to use for mapping and how it should be configured.
 *  
 * @author 02963357460
 *
 */
public class Writer implements ItemWriter<String> {
 
    Logger logger = LoggerFactory.getLogger(this.getClass());
     
    @Override
    public void write(List<? extends String> messages) throws Exception {
        for(String msg : messages){
            System.out.println("#Writer Step: " + msg);
        }
    }
     
}