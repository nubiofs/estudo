package com.javasampleapproach.springbatch.step;
 
import org.springframework.batch.item.ItemProcessor;
 
/**
 * public interface ItemProcessor: Interface for item transformation. 
 * Given an item as input, this interface provides an extension point which allows 
 * for the application of business logic in an item oriented processing scenario. 
 * It should be noted that while it’s possible to return a different type than the 
 * one provided, it’s not strictly necessary. Furthermore, returning null indicates 
 * that the item should not be continued to be processed.
 * @author 02963357460
 *
 */
public class Processor implements ItemProcessor<String, String>{
 
    @Override
    public String process(String content) throws Exception {
        return content.toUpperCase();
    }
 
}