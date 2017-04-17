package hello.batch;

import hello.pojo.Person;

import javax.sql.DataSource;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

@Configuration
//This example uses a memory-based database (provided by @EnableBatchProcessing)
@EnableBatchProcessing
//The first chunk of code defines the input, processor, and output.
public class BatchConfiguration {

    @Autowired
    public JobBuilderFactory jobBuilderFactory;

    @Autowired
    public StepBuilderFactory stepBuilderFactory;

    @Autowired
    public DataSource dataSource;

    //
    // tag::readerwriterprocessor[]
    //
    @Bean
    //reader
    public FlatFileItemReader<Person> reader() {
    	
        FlatFileItemReader<Person> reader = new FlatFileItemReader<Person>();
        reader.setResource(new ClassPathResource("sample-data.csv"));
        reader.setLineMapper(new DefaultLineMapper<Person>() {{
            setLineTokenizer(new DelimitedLineTokenizer() {{
                setNames(new String[] { "firstName", "lastName" });
            }});
            setFieldSetMapper(new BeanWrapperFieldSetMapper<Person>() {{
                setTargetType(Person.class);
            }});
        }});
        
        return reader;
        
    }

    @Bean
    //processor
    public PersonItemProcessor processor() {
        return new PersonItemProcessor();
    }

    @Bean
    //writer
    public JdbcBatchItemWriter<Person> writer() {
    	
        JdbcBatchItemWriter<Person> writer = new JdbcBatchItemWriter<Person>();
        writer.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<Person>());
        writer.setSql("INSERT INTO people (first_name, last_name) VALUES (:firstName, :lastName)");
        //This one is aimed at a JDBC destination and automatically gets 
        //a copy of the dataSource created by @EnableBatchProcessing.
        writer.setDataSource(dataSource);
        
        return writer;
        
    }
    // end::readerwriterprocessor[]

    //
    // tag::jobstep[]
    //
    @Bean
    //Defines the job
    public Job importUserJob(JobCompletionNotificationListener listener) {
        return jobBuilderFactory.get("importUserJob")
        		//you need an incrementer because jobs use a database to maintain execution state
                .incrementer(new RunIdIncrementer())
                //job execution listener
                .listener(listener)
                //Jobs are built from steps, where each step can involve a reader, a processor, and a writer.
                .flow(step1())
                .end()
                .build();
    }

    @Bean
    //Single step
    public Step step1() {
        return stepBuilderFactory.get("step1")
        		//you define how much data to write at a time. 
        		//In this case, it writes up to ten records at a time.
        		// This represents the input and output types of each "chunk" of processing, 
        		//and lines up with ItemReader<Person> and ItemWriter<Person>
                .<Person, Person> chunk(10)
                //step can involve a reader
                .reader(reader())
                //step can involve a processor
                .processor(processor())
                //step can involve a writer
                .writer(writer())
                .build();
    }
    // end::jobstep[]
    
}