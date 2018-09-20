package hello;

import java.sql.SQLException;

import javax.sql.DataSource;

import org.postgresql.Driver;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.launch.support.SimpleJobLauncher;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.repository.support.JobRepositoryFactoryBean;
import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.batch.item.database.builder.JdbcBatchItemWriterBuilder;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.builder.FlatFileItemReaderBuilder;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.SimpleDriverDataSource;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;

@Configuration
public class BatchConfiguration {

//	@Autowired 
//	private JobExplorer jobExplorer;

	private DataSource dataSource;

	@Autowired
	public DataSource source() {
		//$ docker run -it 1000kit/h2
		//http://172.17.0.4:8181/login.jsp?jsessionid=9359a5513cf4c62a34a340ac486ae039
		//OU:
		EmbeddedDatabaseBuilder builder = new EmbeddedDatabaseBuilder();
		this.dataSource = builder
				.setType(EmbeddedDatabaseType.H2)
				.addScript("schema-all.sql")
				.build();
		try {
			System.out.println("URL = " + this.dataSource.getConnection().getMetaData().getURL());
		} catch (SQLException e) {
			System.out.println("Error: " + e.getMessage());
		}
		return this.dataSource;
		
	}

	//@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Autowired
	public JdbcTemplate jdbcTemplate() {
		this.jdbcTemplate = new JdbcTemplate(this.dataSource);
		//jdbcTemplate.setDataSource(dataSource);
		return this.jdbcTemplate;
//		JdbcTemplate jdbc = new JdbcTemplate();
//		jdbc.setDataSource(this.dataSource);
//		return jdbc;
	}

	@Bean
	public JdbcTemplate template() {
		return this.jdbcTemplate;
	}


	private SimpleDriverDataSource ds;
	private JobRepository jobRepository;

	@SuppressWarnings("unchecked")
	@Autowired
	public JobRepository repository() throws Exception {
		
		//SimpleDriverDataSource ds = new SimpleDriverDataSource();
		ds = new SimpleDriverDataSource();
		//TODO FIXME Peguar dados via variaveis de ambiente:
		ds.setPassword("passwd");
		ds.setUrl("jdbc:postgresql://172.17.0.2:5432/testdb");
		ds.setUsername("test");
		//dataSource.setDriverClass(Driver.class);
		ds.setDriverClass((Class<Driver>) Class.forName("org.postgresql.Driver"));
		//dataSource.setSchema("classpath:org/springframework/batch/core/schema-postgresql.sql");

		JobRepositoryFactoryBean factory = new JobRepositoryFactoryBean();
		factory.setDataSource(ds);
		//factory.setDatabaseType(DatabaseType.POSTGRES.name());
		factory.setTransactionManager(new DataSourceTransactionManager(ds));
		factory.afterPropertiesSet();
		//teste+
		//return factory.getObject();
		this.jobRepository = factory.getObject();
		return this.jobRepository;
		//teste-

	}
	
	@Bean
	public DataSource dataSource() {
		return this.ds;
	}

	
	@Bean
	public JobRepository jobRepository() {
		return this.jobRepository;
	}

//	@SuppressWarnings("unchecked")
//	@Bean
//	public DataSource source() throws ClassNotFoundException {
//		SimpleDriverDataSource ds = new SimpleDriverDataSource();
//		//TODO FIXME Peguar dados via variaveis de ambiente:
//		ds.setPassword("passwd");
//		ds.setUrl("jdbc:postgresql://172.17.0.2:5432/testdb");
//		ds.setUsername("test");
//		//dataSource.setDriverClass(Driver.class);
//		ds.setDriverClass((Class<Driver>) Class.forName("org.postgresql.Driver"));
//		//dataSource.setSchema("classpath:org/springframework/batch/core/schema-postgresql.sql");
//		return ds;
//	}

	/*
	private JobLauncher jobLauncher;

	//@Autowired
	//public JobLauncher launcher(JobRepository jobRepository) throws Exception {
	public JobLauncher launcher() throws Exception {
		this.jobLauncher = new SimpleJobLauncher();
		//((SimpleJobLauncher) this.jobLauncher).setJobRepository(jobRepository);
		//((SimpleJobLauncher) this.jobLauncher).setJobRepository(this.jobRepository);
		//((SimpleJobLauncher) this.jobLauncher).setJobRepository(jobRepository());
		//((SimpleJobLauncher) this.jobLauncher).afterPropertiesSet();
		return this.jobLauncher;
	}
	*/
	
	@Autowired
	@Bean
	public JobLauncher jobLauncher() throws Exception {
		
		JobLauncher jobLauncher = new SimpleJobLauncher();
		
		((SimpleJobLauncher) jobLauncher).setJobRepository(this.jobRepository);
		((SimpleJobLauncher) jobLauncher).afterPropertiesSet();
		return jobLauncher;
	}

	// tag::readerwriterprocessor[]
	@Bean
	public FlatFileItemReader<People> reader() {
		return new FlatFileItemReaderBuilder<People>()
				.name("peopleItemReader")
				.resource(new ClassPathResource("sample-data.csv"))
				.delimited()
				.names(new String[]{"first_name", "last_name"})
				.fieldSetMapper(new BeanWrapperFieldSetMapper<People>() {{
					setTargetType(People.class);
				}})
				.build();
	}

	@Bean
	public PeopleItemProcessor processor() {
		return new PeopleItemProcessor();
	}

	private JdbcBatchItemWriter<People> writer;
	@Bean
	//... writer(@Qualifier("batchDataSource") DataSource dataSource){
	//public JdbcBatchItemWriter<People> writer(DataSource dataSource) {
	public JdbcBatchItemWriter<People> writer() {
		this.writer = new JdbcBatchItemWriterBuilder<People>()
				.itemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<>())
				//.sql("INSERT INTO public.people (first_name, last_name) VALUES (:first_name, :last_name)")
				.sql("INSERT INTO people (first_name, last_name) VALUES (:first_name, :last_name)")
				.dataSource(this.dataSource)
				//.dataSource(source())
				.build();
		return this.writer;
	}
	// end::readerwriterprocessor[]

	// tag::jobstep[]
	
	@Autowired
	public JobBuilderFactory jobBuilderFactory;

	private Job importUserJob;

	@Bean
	//public Job importUserJob(JobCompletionNotificationListener listener, Step step1) {
	public Job importUserJob(Step step1) {
		JobCompletionNotificationListener listener = new JobCompletionNotificationListener(this.jdbcTemplate);
		this.importUserJob = jobBuilderFactory.get("importUserJob")
				.incrementer(new RunIdIncrementer())
				.listener(listener)
				.flow(step1)
				.end()
				.build();
		return this.importUserJob;
	}

	@Autowired
	public StepBuilderFactory stepBuilderFactory;

	@Bean
	//public Step step1(JdbcBatchItemWriter<People> writer) {
	public Step step1() {
//		JdbcBatchItemWriter<People> writer = new JdbcBatchItemWriterBuilder<People>()
//				.itemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<>())
//				//.sql("INSERT INTO public.people (first_name, last_name) VALUES (:first_name, :last_name)")
//				.sql("INSERT INTO people (first_name, last_name) VALUES (:first_name, :last_name)")
//				//.dataSource(source())
//				.dataSource(this.dataSource)
//				.build();
		
		
		return stepBuilderFactory.get("step1")
				.<People, People> chunk(10)
				.reader(reader())
				.processor(processor())
				//.writer(writer)
				.writer(this.writer)
				.build();
	}
	// end::jobstep[]

	/*


	  @Bean
  @ConfigurationProperties(prefix = "spring.datasource")
  public DataSource dataSource(){
      //DataSource ds =new EmbeddedDatabaseBuilder().addScript("classpath:sql/schema.sql").addScript("classpath:testdb/data.sql").build();
      DataSourceBuilder ds =  DataSourceBuilder.create();
      logger.info("dataSource = " + ds);
      return ds.build();

  }

	 //////////////

	 //import org.h2.Driver;
	 @Bean
	public DataSource dataSource(){
		SimpleDriverDataSource dataSource = new SimpleDriverDataSource();
		//dataSource.setDriver(Driver.load());
		//dataSource.setUrl("jdbc:h2:~/test");
		dataSource.setDriverClass(Driver.class);
      dataSource.setUrl("jdbc:h2:mem:test;MODE=Oracle;");
		dataSource.setUsername("sa");
		dataSource.setPassword("");
		return dataSource;
	}

	////////////////

	@Bean
	public DataSource dataSource(){
	    DriverManagerDataSource dataSource = new DriverManagerDataSource();
	    dataSource.setDriverClassName("oracle.jdbc.driver.OracleDriver");
	    dataSource.setUrl("your url");
	    dataSource.setUsername( "username" );
	    dataSource.setPassword( "password" );
	    return dataSource;
	}

	///////////////


  @Bean
  public ResourcelessTransactionManager transactionManager() {
      return new ResourcelessTransactionManager();
  }

  @Bean
  public MapJobRepositoryFactoryBean mapJobRepositoryFactory(ResourcelessTransactionManager txManager)
          throws Exception {
      MapJobRepositoryFactoryBean factory = new MapJobRepositoryFactoryBean(txManager);
      factory.afterPropertiesSet();
      return factory;
  }

  @Bean
  public JobRepository jobRepository(MapJobRepositoryFactoryBean factory) throws Exception {
      return factory.getObject();
  }

  @Bean
  public JobExplorer jobExplorer(MapJobRepositoryFactoryBean factory) {
      return new SimpleJobExplorer(factory.getJobInstanceDao(), factory.getJobExecutionDao(),
              factory.getStepExecutionDao(), factory.getExecutionContextDao());
  }

  @Bean
  public SimpleJobLauncher jobLauncher(JobRepository jobRepository) throws Exception {
      SimpleJobLauncher launcher = new SimpleJobLauncher();
      launcher.setJobRepository(jobRepository);
      launcher.afterPropertiesSet();
      return launcher;
  }


	 */



}
