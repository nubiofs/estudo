package com.javasampleapproach.springbatch.step;
 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.NonTransientResourceException;
import org.springframework.batch.item.ParseException;
import org.springframework.batch.item.UnexpectedInputException;
 
/**
 * "public interface ItemReader": Strategy interface for providing the data.
 * Implementations are expected to be stateful and will be called multiple times for each batch, with each call to read() returning a different value and finally returning null when all input data is exhausted.
 * Implementations need not be thread-safe and clients of a ItemReader need to be aware that this is the case.
 * @author 02963357460
 *
 */
public class Reader implements ItemReader<String>{
 
    private String[] messages = {"Hello World!", "Welcome to Spring Batch!"};
     
    private int count=0;
     
    Logger logger = LoggerFactory.getLogger(this.getClass());
     
    @Override
    public String read() throws Exception, UnexpectedInputException, ParseException, NonTransientResourceException {
         
        if(count < messages.length){
            return messages[count++];
        }else{
            count=0;
        }
        return null;
    }
     
}