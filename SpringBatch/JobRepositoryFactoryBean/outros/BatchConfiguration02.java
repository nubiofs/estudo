package hello;

import java.sql.SQLException;

import javax.sql.DataSource;

import org.postgresql.Driver;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.JobRegistry;
import org.springframework.batch.core.configuration.ListableJobLocator;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.configuration.support.JobFactoryRegistrationListener;
import org.springframework.batch.core.configuration.support.JobRegistryBeanPostProcessor;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.explore.support.JobExplorerFactoryBean;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.launch.support.SimpleJobLauncher;
import org.springframework.batch.core.launch.support.SimpleJobOperator;
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
@EnableBatchProcessing
public class BatchConfiguration {

	private DataSource appDataSource;
	private JdbcTemplate appJdbcTemplate;

	@Autowired
	public JobBuilderFactory jobBuilderFactory;

	@Autowired
	public StepBuilderFactory stepBuilderFactory;

	@Autowired
	public DataSource appDataSource() {
		
		this.appDataSource = new EmbeddedDatabaseBuilder()
				.setType(EmbeddedDatabaseType.H2)
				.addScript("schema-all.sql")
				.build();
		try {
			System.out.println("URL = " + this.appDataSource.getConnection().getMetaData().getURL());
		} catch (SQLException e) {
			System.out.println("Error: " + e.getMessage());
		}
		
		return this.appDataSource;

	}

	@Autowired
	public JdbcTemplate appJdbcTemplate() {
		this.appJdbcTemplate = new JdbcTemplate(this.appDataSource);
		return this.appJdbcTemplate;
	}

	@Bean
	public DataSource dataSource() {

		SimpleDriverDataSource dataSource = new SimpleDriverDataSource();

		//TODO FIXME Peguar dados via variaveis de ambiente:
		dataSource.setPassword("passwd");
		dataSource.setUrl("jdbc:postgresql://172.17.0.2:5432/testdb");
		dataSource.setUsername("test");
		//ds.setDriverClass((Class<Driver>) Class.forName("org.postgresql.Driver"));
		dataSource.setDriverClass(Driver.class);
		
		return dataSource;
		
	}

	@Bean
	public JobRepository jobRepository(DataSource dataSource) throws Exception {

		JobRepositoryFactoryBean factory = new JobRepositoryFactoryBean();
		factory.setDataSource(dataSource);
		//factory.setDatabaseType(DatabaseType.POSTGRES.name());
		factory.setTransactionManager(new DataSourceTransactionManager(dataSource));
		factory.afterPropertiesSet();
		return factory.getObject();

	}

	@Bean
	public JobLauncher jobLauncher(JobRepository jobRepository) throws Exception {

		SimpleJobLauncher jobLauncher = new SimpleJobLauncher();
		jobLauncher.setJobRepository(jobRepository);
		jobLauncher.afterPropertiesSet();
		return jobLauncher;

	}
	
	@Bean
	//@ConditionalOnMissingBean(JobExplorer.class)
	public JobExplorer jobExplorer(DataSource dataSource) throws Exception {
//		BatchConfigurer batchConfigurer = getBatchConfigurer();
//		if (batchConfigurer != null) {
//			return batchConfigurer.getJobExplorer();
//		}
		JobExplorerFactoryBean jobExplorerFactoryBean = new JobExplorerFactoryBean();
		jobExplorerFactoryBean.setDataSource(dataSource);
		jobExplorerFactoryBean.afterPropertiesSet();
		return jobExplorerFactoryBean.getObject();
	}
	
//	@Bean
//	public JobRegistry jobRegistry(DataSource dataSource) throws Exception {
//		JobRegistryBeanPostProcessor reg = new JobRegistryBeanPostProcessor();
//		reg.afterPropertiesSet();
//		JobFactoryRegistrationListener registry = new JobFactoryRegistrationListener();
//		JobRepositoryFactoryBean jobRepositoryFactoryBean = new JobRepositoryFactoryBean();
//		jobRepositoryFactoryBean.setDataSource(dataSource);
//		jobRepositoryFactoryBean.afterPropertiesSet();
//		return jobRepositoryFactoryBean.getObject();
//	}
	
//	@Bean
//	@ConditionalOnMissingBean(MapJobRegistry.class)
//	public MapJobRegistry batchJobRegistry() {
//		return new MapJobRegistry();
//	}
	
	@Bean
    //public JobOperator jobOperator(JobExplorer jobExplorer, JobLauncher jobLauncher, ListableJobLocator jobRegistry, JobRepository jobRepository) throws Exception {
	public JobOperator jobOperator(JobExplorer jobExplorer, JobLauncher jobLauncher, JobRepository jobRepository) throws Exception {
        SimpleJobOperator jobOperator = new SimpleJobOperator();
        jobOperator.setJobExplorer(jobExplorer);
        jobOperator.setJobLauncher(jobLauncher);
        //jobOperator.setJobRegistry(jobRegistry);
        jobOperator.setJobRepository(jobRepository);
        jobOperator.afterPropertiesSet();
        return jobOperator;
	}

	@Bean
	public Job importUserJob(Step step1) {

		JobCompletionNotificationListener listener = new JobCompletionNotificationListener(this.appJdbcTemplate);

		return jobBuilderFactory.get("importUserJob")
				.incrementer(new RunIdIncrementer())
				.listener(listener)
				.flow(step1)
				.end()
				.build();

	}

	@Bean
	public Step step1(JdbcBatchItemWriter<People> writer) {
		return stepBuilderFactory.get("step1")
				.<People, People> chunk(10)
				.reader(reader())
				.processor(processor())
				.writer(writer)
				.build();
	}

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

	@Bean
	public JdbcBatchItemWriter<People> writer() {
		return new JdbcBatchItemWriterBuilder<People>()
				.itemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<>())
				//.sql("INSERT INTO public.people (first_name, last_name) VALUES (:first_name, :last_name)")
				.sql("INSERT INTO people (first_name, last_name) VALUES (:first_name, :last_name)")
				.dataSource(this.appDataSource)
				.build();
	}


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
