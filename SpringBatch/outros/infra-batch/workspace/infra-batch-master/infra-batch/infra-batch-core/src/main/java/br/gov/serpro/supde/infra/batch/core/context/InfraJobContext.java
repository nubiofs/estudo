package br.gov.serpro.supde.infra.batch.core.context;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.text.MessageFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;

import org.apache.log4j.LogManager;
import org.apache.log4j.PropertyConfigurator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.JobExecution;

import br.gov.serpro.supde.infra.batch.core.concurrent.ConcurrentTaskExecutorDelegate;
import br.gov.serpro.supde.infra.batch.core.concurrent.ExecutorType;
import br.gov.serpro.supde.infra.batch.core.constant.SystemPropertyKeys;

/**
 * Contexto de execução de Job.
 * 
 * @author 05601970475
 *
 */
public class InfraJobContext {
	
	private Logger logger;

	/**
	 * Nome do arquivo de configuração geral do infra-batch. (Este arquivo
	 * deverá estar na raiz do diretório configurado na SystemProperty
	 * 'infra.config.dir').
	 */
	private static final String CONFIGURATION_FILE_NAME = "infra-batch.properties";		

	/**
	 * Nome do arquivo de configuração log4j. (Este arquivo deverá estar na raiz
	 * do diretório configurado na SystemProperty 'infra.log.dir').
	 */
	private static final String LOG4J_FILE_NAME = "log4j.properties";

	/**
	 * Identificador da propriedade do log4j que define o caminho do arquivo de
	 * log gerado.
	 */
	private static final String LOG_FILE_PROPERTY_KEY = "log4j.appender.file.File";
	
	/**
	 * Identificador da propriedade do log4j que define o rootLogger 
	 */
	private static final String LOG_ROOT_LOGGER_PROPERTY_KEY = "log4j.rootLogger";
	
	/**
	 * Nome do arquivo de configuração de contexto para o módulo. (Este arquivo
	 * deverá estar na raiz do jar (na pasta resources do projeto do modulo).
	 */
	private static final String CONTEXT_CONFIGURATION_RESOURCE = "app-context.properties";
	
	/**
	 * Modo de simulação. Se ativado, nenhum commit será realizado no Job.
	 */
	private boolean simulationMode;
	
	/**
	 * Ignora a geração de um relatório de execução em PDF ao final do processamento.
	 */
	private boolean ignorePDFReport;

	/**
	 * Diretório base para os arquivos de configuração geral. Será carregado a
	 * partir da SystemProperty 'infra.config.dir'.
	 */
	private String configPath;

	/**
	 * Caminho do diretório dos arquivos de entrada para o Job.
	 */
	private String inputPath;

	/**
	 * Caminho do diretório dos arquivos de saída do Job.
	 */
	private String outputPath;
	
	/**
	 * Caminho do diretório onde serão gerados os logs
	 */
	private String logPath;

	/**
	 * Nó escravo para o processamento de Remoting Chunk
	 */
	private boolean slave;

	/**
	 * ExecutorType utilizado para o {@link ConcurrentTaskExecutorDelegate}
	 */
	private ExecutorType executorType;

	/**
	 * Quantidade de Threads utilizado para o
	 * {@link ConcurrentTaskExecutorDelegate}
	 */
	private int threads;

	/**
	 * Nome do Job em execução.
	 */
	private String jobIdentifier;

	/**
	 * Identificador do contexto.
	 */
	private static Long id = System.currentTimeMillis();	
	
	/**
	 * Arquivos de saída gerados pelo Job
	 */
	private Set<File> outputFiles = new HashSet<File>();

	/**
	 * Referencia ao jobExecution do spring-batch
	 */
	private JobExecution jobExecution;
			
	/**
	 * Nome do modulo do app (configurado no arquivo /app-context.properties)
	 */
	private String system;
	
	/**
	 * Singleton
	 */
	private static InfraJobContext instance = new InfraJobContext();
	
	private InfraJobContext() {
		this.configPath = System.getProperty(SystemPropertyKeys.CONFIG_DIRECTORY);
		this.slave = Boolean.parseBoolean(System.getProperty(SystemPropertyKeys.SLAVE));
		
		if (this.configPath == null || this.configPath.trim().length() == 0) {
			throw new RuntimeException("A propriedade de sistema " + SystemPropertyKeys.CONFIG_DIRECTORY
					+ " deve ser configurada.");
		}
		
	}

	private void loadProperties(InputStream inputStream) {
		try {
			Properties props = new Properties();
			props.load(inputStream);
			
			for(Object key : props.keySet()) {
				//Se a propriedade não existe adiciona no system property
				if(System.getProperty(key.toString()) == null) {
					System.setProperty(key.toString(), props.get(key).toString());
				}
			}

			this.inputPath = System.getProperty(SystemPropertyKeys.INPUT);
			this.outputPath = System.getProperty(SystemPropertyKeys.OUTPUT);
			this.simulationMode = Boolean.parseBoolean(System.getProperty(SystemPropertyKeys.SIMULATION_MODE));
			this.ignorePDFReport = Boolean.parseBoolean(System.getProperty(SystemPropertyKeys.IGNORE_PDF_REPORT));
			this.executorType = ExecutorType.valueOf(System.getProperty(SystemPropertyKeys.EXECUTOR_TYPE, "SINGLE")
					.toUpperCase());
			this.threads = Integer.parseInt(System.getProperty(SystemPropertyKeys.EXECUTOR_THREADS, "1"));
			
			this.system = System.getProperty(SystemPropertyKeys.SYSTEM);
			
		} catch (Exception e) {
			throw new RuntimeException("Erro ao carregar o arquivo de configuração. ", e);
		} 
	}
	
	private void loadPropertiesFromClasspath(String resource, boolean optional) {
		InputStream jobConfigStream = null;
		try {
			jobConfigStream = InfraJobContext.class.getClassLoader().getResourceAsStream(resource);
			if(!optional && jobConfigStream == null) {		
				String msg = MessageFormat.format("Arquivo obrigatório não encontrado no jar: [{0}] ", resource);
				getLogger().error(msg);
				throw new RuntimeException(msg);
			} else if(jobConfigStream != null) {
				getLogger().info(MessageFormat.format("Carregando configurações do recurso {0}",resource));				
				loadProperties(jobConfigStream);
			}
		} finally {
			if(jobConfigStream != null) {
				try {
					jobConfigStream.close();
				} catch(Exception e) { 
					e.printStackTrace();					
				}
			}
		}
	}
	
	private void loadPropertiesFromExternalFile(String filePath) {
		FileInputStream fileInputStream = null;
		try {
			fileInputStream = new FileInputStream(new File(filePath));
			getLogger().info(MessageFormat.format("Carregando configurações do arquivo {0}", filePath));
			loadProperties(fileInputStream);
		} catch (FileNotFoundException e) {
			String msg = MessageFormat.format(
					"Arquivo não encontrado: [{0}] ", filePath);
			getLogger().error(msg, e);
			throw new RuntimeException(msg, e);
		} finally {
			if (fileInputStream != null) {
				try {
					fileInputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	/**
	 * Obtém a instancia de InfraJobContext
	 * 
	 * @return InfraJobContext
	 */
	public static InfraJobContext getInstance() {
		return instance;
	}

	/**
	 * Verifica se é o Nó Master ou Slave na execução do Job.
	 * 
	 * @return
	 */
	public boolean isSlave() {
		return slave;
	}

	/**
	 * Verifica se o modo de simulação está ativado. No modo de simulação,
	 * commits não são executados.
	 * 
	 * @return simulationMode.
	 */
	public boolean isSimulationMode() {
		return simulationMode;
	}
	
	/**
	 * Verifica se é para ignorar a geração do relatório em PDF 
	 * (com informações sobre a execução do JOB) ao final do processamento
	 * 
	 * @return ignorePDFReport
	 */
	public boolean isIgnorePDFReport() {
		return ignorePDFReport;
	}

	/**
	 * Obtém o diretório base dos arquivos de configuração do infra-batch.
	 * 
	 * @return configPath
	 */
	public String getConfigPath() {
		return configPath;
	}

	/**
	 * Obtém o caminho para o diretório dos arquivos de entrada do Job.
	 * 
	 * @return inputPath
	 */
	public String getInputPath() {
		return inputPath;
	}

	/**
	 * Obtém o caminho para o diretório dos arquivos de saída do Job.
	 * 
	 * @return outputPath
	 */
	public String getOutputPath() {
		return outputPath;
	}

	/**
	 * Obtém o caminho para o diretório onde são gerados os logs.
	 * @return
	 */
	public String getLogPath() {
		return logPath;
	}

	/**
	 * Obtém o ExecutorType utilizado no ConfigurableTaskExecutor
	 * 
	 * @return Algum dos tipos definidos no pacote java.util.concurrent
	 */
	public ExecutorType getExecutorType() {
		return executorType;
	}

	/**
	 * Quantidade máxima de threads utilizado no taskExecutor do
	 * ConfigurableTaskExecutor
	 * 
	 * @return quantidade de Threads para o configurableTaskExecutor
	 */
	public int getThreads() {
		return threads;
	}

	public Set<File> getOutputFiles() {
		return outputFiles;
	}

	public void setOutputFiles(Set<File> outputFiles) {
		this.outputFiles = outputFiles;
	}

	public JobExecution getJobExecution() {
		return jobExecution;
	}

	public void setJobExecution(JobExecution jobExecution) {
		this.jobExecution = jobExecution;
	}
	
	public String getSystem() {
		return system;
	}

	private Logger getLogger() {
		if(logger == null) {
			logger = LoggerFactory.getLogger(InfraJobContext.class);
		}
		return logger;
	}
	
	/**
	 * Atualiza as configurações que são baseadas no jobIdentifier.
	 * 
	 * @param jobIdentifier
	 *            nome do Job.
	 *   
	 */
	public void configureJobContext(String jobIdentifier) {		
		configureJobContext(jobIdentifier, new HashSet<String>());
	}
		
	/**
	 * Atualiza as configurações que são baseadas no jobIdentifier.
	 * 
	 * @param jobIdentifier
	 *            nome do Job.
	 * @param opts
	 * 			Opções de execução  
	 */
	public void configureJobContext(String jobIdentifier, Set<String> opts) {		
		
		if (jobIdentifier == null || jobIdentifier.trim().length() == 0) {
			throw new IllegalArgumentException("jobIdentifier não pode ser vazio");
		}

		if (this.jobIdentifier != null && !this.jobIdentifier.equals(jobIdentifier)) {
			throw new IllegalStateException("jobIdentifier não pode ser alterado");
		}

		// Se é a primeira vez, configura o log
		if (this.jobIdentifier == null) {
			configureJobLoggingContext(jobIdentifier, opts);
		}
		
		this.jobIdentifier = jobIdentifier;				
		
		//carrega as configurações especificas do job
		loadPropertiesFromClasspath(jobIdentifier + ".properties", true);
		
		//carrega as configurações do contexto (infra-context.properties)
		loadPropertiesFromClasspath(CONTEXT_CONFIGURATION_RESOURCE, false);
		
		//Carrega as configurações globais (infra-batch.properties)
		String globalConfigFilePath = configPath + File.separator + CONFIGURATION_FILE_NAME;		
		loadPropertiesFromExternalFile(globalConfigFilePath);

		this.inputPath = this.inputPath + File.separator + jobIdentifier;
		this.outputPath = this.outputPath + File.separator + jobIdentifier;

	}

	private void configureJobLoggingContext(String jobIdentifier, Set<String> opts) {
		String loggingConfigFilePath = this.configPath + File.separator + LOG4J_FILE_NAME;
		FileInputStream fileInputStream = null;
		try {
			fileInputStream = new FileInputStream(new File(loggingConfigFilePath));
			LogManager.resetConfiguration();
			Properties props = new Properties();
			props.load(fileInputStream);

			String logDir = System.getProperty(SystemPropertyKeys.LOG_DIRECTORY);
			if (logDir == null || logDir.trim().length() == 0) {
				logDir = this.configPath + File.separator + "log";
			}
			
			Boolean verbose = Boolean.valueOf(System.getProperty(SystemPropertyKeys.VERBOSE, "false"));
			if(verbose) {
				String rootLogger = props.getProperty(LOG_ROOT_LOGGER_PROPERTY_KEY);
				props.setProperty(LOG_ROOT_LOGGER_PROPERTY_KEY, rootLogger + ", stdout"); 
			}
			
			this.logPath = logDir;
			
			String optsStr = "";
			if(opts != null) {
				for(String option : opts) {
					optsStr += option;
				}
			}

			String logFile = logDir + File.separator + jobIdentifier + (isSlave() ? "-slave" : "") + optsStr + ".log";

			props.setProperty(LOG_FILE_PROPERTY_KEY, logFile);
			PropertyConfigurator.configure(props);
			StringBuilder sbMessage = new StringBuilder();
			
			sbMessage.append("#############  ");
			sbMessage.append(MessageFormat.format("Logger configurado para execução de {0}", jobIdentifier));
			sbMessage.append("  ##############");
			LoggerFactory.getLogger(InfraJobContext.class).info(sbMessage.toString());
			System.out.println(new Date());
			System.out.println("Log configurado para o arquivo: " + logFile);			
		} catch (Exception e) {
			throw new RuntimeException(
					MessageFormat.format("Erro ao carregar o arquivo de configuração de log {0}: {1}",
							loggingConfigFilePath, e.getMessage()));
		} finally {
			if (fileInputStream != null) {
				try {
					fileInputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("InfraJobContext {");
		sb.append(" [configPath=" + getConfigPath());
		sb.append(" [system=" + getSystem());		
		sb.append("] [inputPath=" + getInputPath());
		sb.append("] [outputPath=" + getOutputPath());
		sb.append("] [simulationMode=" + isSimulationMode());		
		sb.append("] [jobIdentifier=" + this.jobIdentifier);
		sb.append("] [id=" + InfraJobContext.id);
		sb.append("] [slave=" + isSlave());
		sb.append("] [executorType=" + getExecutorType());
		sb.append("] [threads=" + getThreads());
		sb.append("] }");

		return sb.toString();
	}

}
