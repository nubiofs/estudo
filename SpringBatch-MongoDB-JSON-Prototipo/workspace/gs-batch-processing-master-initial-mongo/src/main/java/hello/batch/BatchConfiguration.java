package hello.batch;

import hello.batch.nosql.mongo.constantes.MongoDataAcessConstants;
import hello.batch.nosql.mongo.java.driver.JobCarroNoSqlMongoDriverCompletionNotificationListener;
import hello.batch.nosql.mongo.java.driver.MongoDBItemWriter;
import hello.batch.nosql.spring.data.mongo.JobCarroNoSqlSpringDataMongoDBCompletionNotificationListener;
import hello.batch.nosql.spring.data.mongo.StepCarroNoSqlSpringDataMongoDBCompletionNotificationListener;
import hello.batch.sql.JobCarroSqlCompletionNotificationListener;
import hello.batch.sql.JobPersonCompletionNotificationListener;
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
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.data.MongoItemWriter;
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
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;

import com.mongodb.MongoClient;

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
    // tag::job-step-Person["Lendo de arquivo CSV e escrevento para banco relacional HSQL ou H2"]
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
    // tag::job-step-Carro-to-sql["Lendo de arquivo JSON e escrevento para banco relacional HSQL ou H2"]
    //
    @Bean
    //Defines the job
    public Job jobCarroToSQL(JobCarroSqlCompletionNotificationListener listener) {
        return jobBuilderFactory.get("jobCarroToSQL")
        		//you need an incrementer because jobs use a database to maintain execution state
                .incrementer(new RunIdIncrementer())
                //job execution listener
                .listener(listener)
                //Jobs are built from steps, where each step can involve a reader, a processor, and a writer.
                .flow(stepCarroToSQL())
                .end()
                .build();
    }

    @Bean
    //Single step
    public Step stepCarroToSQL() {
        return stepBuilderFactory.get("stepCarroToSQL")
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
                .writer(writerCarroToSQL())
                .build();
    }
    // end::job-step-Carro-to-sql[]

    //
    // tag::reader-processor-writer-Carro-to-sql[]
    //
    @Bean
    //reader
    public ItemReader<Carro> readerCarro() {
    	
    	//MultiResourceItemReader "read resources that matches this pattern csv/inputs/domain-*.csv"
        FlatFileItemReader<Carro> reader = new FlatFileItemReader<Carro>();
        //ApplicationContext ctx
        //Resource template = ctx.getResource("some/resource/path/myTemplate.txt");
        //Resource template = ctx.getResource("classpath:some/resource/path/myTemplate.txt");
        //Resource template = ctx.getResource("file:///some/resource/path/myTemplate.txt");
        //reader.setResource(new FileSystemResource("src/test/resources/"+pathToFile));
        //ZipMultiResourceItemReader "Multi Resource Item Reader capable of reading zip archive files."
        //GZipBufferedReaderFactory
        reader.setResource(new ClassPathResource("input.json"));
        reader.setRecordSeparatorPolicy(new JsonRecordSeparatorPolicy());
        /*
        reader.setLinesToSkip(2);
        final List<String> headers = new ArrayList<String>();
        reader.setSkippedLinesCallback(new LineCallbackHandler() {
    		public void handleLine(String line) {
    			headers.add(line);
    		}
    	});
    	*/
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
    public JdbcBatchItemWriter<Carro> writerCarroToSQL() {
    	
        JdbcBatchItemWriter<Carro> writer = new JdbcBatchItemWriter<Carro>();
        writer.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<Carro>());
        writer.setSql("INSERT INTO carro (km, nome) VALUES (:km, :nome)");
        //This one is aimed at a JDBC destination and automatically gets 
        //a copy of the dataSource created by @EnableBatchProcessing.
        writer.setDataSource(dataSource);
        
        return writer;
        
    }
    // end::reader-processor-writer-Carro-to-sql[]

    //
    // tag::job-step-Carro-to-nosql-01["Lendo de arquivo JSON e escrevento para banco NoSQL MongoDB (via Mongo Java Driver)"]
    //
    @Bean
    //Defines the job
    public Job jobCarroToNoSQL_01(JobCarroNoSqlMongoDriverCompletionNotificationListener listener) {
        return jobBuilderFactory.get("jobCarroToNoSQL_01")
        		//you need an incrementer because jobs use a database to maintain execution state
                .incrementer(new RunIdIncrementer())
                //job execution listener
                .listener(listener)
                //Jobs are built from steps, where each step can involve a reader, a processor, and a writer.
                .flow(stepCarroToNoSQL_01())
                .end()
                .build();
    }

    @Bean
    //Single step
    public Step stepCarroToNoSQL_01() {
        return stepBuilderFactory.get("stepCarroToNoSQL_01")
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
                .writer(writerCarroToNoSQL_01())
                .build();
    }
    // end::job-step-Carro-to-nosql-01[]

    //
    // tag::writer-Carro-to-nosql-01[]
    //
    @Bean
    //writer
    public MongoDBItemWriter writerCarroToNoSQL_01() {
    	
    	MongoDBItemWriter writer = 
    			new MongoDBItemWriter(MongoDataAcessConstants.DB_NAME, MongoDataAcessConstants.COLLECTION_NAME);
    	//com.mongodb.MongoClient
    	writer.setMongo(new MongoClient(MongoDataAcessConstants.HOST, MongoDataAcessConstants.PORT));
        
        return writer;
        
    }
    // end::writer-Carro-to-nosql[]

    ///////////////////
    ///////////////////
    
    //
    // tag::job-step-Carro-to-nosql-02["Lendo de arquivo JSON e escrevento para banco NoSQL MongoDB (via Spring Data MongoDB)"]
    //
    @Bean
    //Defines the job
    public Job jobCarroToNoSQL_02(JobCarroNoSqlSpringDataMongoDBCompletionNotificationListener listener) {
        return jobBuilderFactory.get("jobCarroToNoSQL_02")
        		//you need an incrementer because jobs use a database to maintain execution state
                .incrementer(new RunIdIncrementer())
                //job execution listener
                .listener(listener)
                //Jobs are built from steps, where each step can involve a reader, a processor, and a writer.
                .flow(stepCarroToNoSQL_02())
                .end()
                .build();
    }

	@Bean
    //Single step
    public Step stepCarroToNoSQL_02() {
        return stepBuilderFactory.get("stepCarroToNoSQL_02")
        		.listener(new StepCarroNoSqlSpringDataMongoDBCompletionNotificationListener())
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
                .writer(writerCarroToNoSQL_02())
                .build();
    }
    // end::job-step-Carro-to-nosql-02[]

    //
    // tag::writer-Carro-to-nosql-02[]
    //
    @Bean
    //writer
    public ItemWriter<Carro> writerCarroToNoSQL_02() {
    	
    	MongoItemWriter<Carro> writer = new MongoItemWriter<Carro>();
        try {
            writer.setTemplate(mongoTemplate());
        } catch (Exception e) {
            System.out.println("Exception: " + e.toString());
        }
        writer.setCollection(MongoDataAcessConstants.COLLECTION_NAME);
        return writer;
        
    }

    @Bean
    public MongoTemplate mongoTemplate() throws Exception {
        return new MongoTemplate(mongoDbFactory());
    }

    @Bean
    public MongoDbFactory mongoDbFactory() throws Exception {
        return new SimpleMongoDbFactory(new MongoClient(), MongoDataAcessConstants.DB_NAME);
    }
    // end::writer-Carro-to-nosql-02[]

}