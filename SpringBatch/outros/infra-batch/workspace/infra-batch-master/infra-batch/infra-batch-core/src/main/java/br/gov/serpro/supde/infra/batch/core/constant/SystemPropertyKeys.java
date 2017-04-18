package br.gov.serpro.supde.infra.batch.core.constant;

/**
 * Constantes com os identificadores das propriedades de sistema utilizadas.
 * 
 * @author 05601970475
 *
 */
public class SystemPropertyKeys {
	
	/**
	 * Propriedade de sistema que define o caminho do diretório do arquivo infra-batch.properties.
	 */
	public static final String CONFIG_DIRECTORY = "infra.config.dir";
	
	/**
	 * Propriedade de sistema que define o diretório base onde serão gerados os arquivos de log.
	 */
	public static final String LOG_DIRECTORY = "infra.log.dir";
	
	/**
	 * Propriedade de sistema que define o modulo do infra que está executando.
	 */
	public static final String SYSTEM = "infra.system";
	
	/**
	 * Propriedade de sistema que define o diretório base onde serão gerados os arquivos de log.
	 */
	public static final String SLAVE = "infra.slave";
	
	/**
	 * Caminho para o diretório base onde ficarão os arquivos de entrada para o Job.
	 */
	public static final String INPUT = "infra.input";
	
	/**
	 * Caminho para o diretório base onde ficarão os arquivos de saída do Job.
	 */
	public static final String OUTPUT = "infra.output";

	/**
	 * Ativa/Desativa o modo de simulação (se ativado, não são realizados commit).
	 */
	public static final String SIMULATION_MODE = "infra.simulationMode";
	
	/**
	 * Ignora a geração de um PDF com o resumo da execução ao final do processamento.
	 */
	public static final String IGNORE_PDF_REPORT = "infra.ignorePDFReport";
	
	/**
	 * Define o tipo de Executor utilizado no ConfigurableTaskExecutor
	 */
	public static final String EXECUTOR_TYPE = "infra.executor.type";
	
	/**
	 * Quantidade de Threads utilizada no ConfigurableTaskExecutor
	 */
	public static final String EXECUTOR_THREADS = "infra.executor.threads";
	
	/**
	 * Definição dos profiles ativos no Spring
	 */
	public static final String SPRING_PROFILES_ACTIVE = "spring.profiles.active";
	
	/**
	 * Caminho do diretório onde serão gerados os relatórios de monitoração
	 */
	public static final String JOB_MONITOR_OUTPUT_PATH = "infra.jobMonitorOutputPath";
	
	/**
	 * Ativa o stdout no logger
	 */
	public static final String VERBOSE = "infra.verbose";
	
}
