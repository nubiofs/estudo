package hello.batch;

import hello.pojo.Carro;
import hello.pojo.Person;

import javax.sql.DataSource;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.separator.JsonRecordSeparatorPolicy;
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
    // tag::job-step-Person[]
    //
    @Bean
    //Defines the job
    public Job jobPerson(JobPersonCompletionNotificationListener listener) {
        return jobBuilderFactory.get("jobPerson")
        		//you need an incrementer because jobs use a database to maintain execution state
                .incrementer(new RunIdIncrementer())
                //job execution listener
                .listener(listener)
                //Jobs are built from steps, where each step can involve a reader, a processor, and a writer.
                .flow(stepPerson())
                .end()
                .build();
    }

    @Bean
    //Single step
    public Step stepPerson() {
        return stepBuilderFactory.get("stepPerson")
        		//you define how much data to write at a time. 
        		//In this case, it writes up to ten records at a time.
        		// This represents the input and output types of each "chunk" of processing, 
        		//and lines up with ItemReader<Person> and ItemWriter<Person>
                .<Person, Person> chunk(10)
                //step can involve a reader
                .reader(readerPerson())
                //step can involve a processor
                .processor(processorPerson())
                //step can involve a writer
                .writer(writerPerson())
                .build();
    }
    // end::job-step-Person[]
    
    //
    // tag::reader-processor-writer-Person[]
    //
    @Bean
    //reader
    public FlatFileItemReader<Person> readerPerson() {
    	
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
    public PersonItemProcessor processorPerson() {
        return new PersonItemProcessor();
    }

    @Bean
    //writer
    public JdbcBatchItemWriter<Person> writerPerson() {
    	
        JdbcBatchItemWriter<Person> writer = new JdbcBatchItemWriter<Person>();
        writer.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<Person>());
        writer.setSql("INSERT INTO people (first_name, last_name) VALUES (:firstName, :lastName)");
        //This one is aimed at a JDBC destination and automatically gets 
        //a copy of the dataSource created by @EnableBatchProcessing.
        writer.setDataSource(dataSource);
        
        return writer;
        
    }
    // end::reader-processor-writer-Person[]
    
    //
    // tag::job-step-Carro[]
    //
    @Bean
    //Defines the job
    public Job jobCarro(JobCarroCompletionNotificationListener listener) {
        return jobBuilderFactory.get("jobCarro")
        		//you need an incrementer because jobs use a database to maintain execution state
                .incrementer(new RunIdIncrementer())
                //job execution listener
                .listener(listener)
                //Jobs are built from steps, where each step can involve a reader, a processor, and a writer.
                .flow(stepCarro())
                .end()
                .build();
    }

    @Bean
    //Single step
    public Step stepCarro() {
        return stepBuilderFactory.get("stepCarro")
        		//you define how much data to write at a time. 
        		//In this case, it writes up to ten records at a time.
        		// This represents the input and output types of each "chunk" of processing, 
        		//and lines up with ItemReader<Person> and ItemWriter<Person>
                .<Carro, Carro> chunk(10)
                //step can involve a reader
                .reader(readerCarro())
                //step can involve a processor
                .processor(processorCarro())
                //step can involve a writer
                .writer(writerCarro())
                .build();
    }
    // end::job-step-Carro[]

    //
    // tag::reader-processor-writer-Carro[]
    //
    @Bean
    //reader
    public ItemReader<Carro> readerCarro() {
    	
        FlatFileItemReader<Carro> reader = new FlatFileItemReader<Carro>();
        reader.setResource(new ClassPathResource("input.json"));
        reader.setRecordSeparatorPolicy(new JsonRecordSeparatorPolicy());
		//reader.setLineMapper(new WrappedJsonLineMapper());//OK
        reader.setLineMapper(new JsonCarroLineMapper());

        return reader;
        
    }

    @Bean
    //processor
    public CarroItemProcessor processorCarro() {
        return new CarroItemProcessor();
    }

    @Bean
    //writer
    public JdbcBatchItemWriter<Carro> writerCarro() {
    	
        JdbcBatchItemWriter<Carro> writer = new JdbcBatchItemWriter<Carro>();
        writer.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<Carro>());
        writer.setSql("INSERT INTO carro (km, nome) VALUES (:km, :nome)");
        //This one is aimed at a JDBC destination and automatically gets 
        //a copy of the dataSource created by @EnableBatchProcessing.
        writer.setDataSource(dataSource);
        
        return writer;
        
    }
    // end::reader-processor-writer-Carro[]

}