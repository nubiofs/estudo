package br.gov.serpro.supde.infra.batch.core.report;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.time.DurationFormatUtils;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import br.gov.serpro.supde.infra.batch.core.constant.SystemPropertyKeys;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRPdfExporterParameter;

/**
 * <p>
 * Controlador que gerencia a criação de relatórios de execução de
 * processamento.
 * </p>
 * 
 */
public class JobReportController implements InitializingBean {

	/**
	 * Nome do relatório principal
	 */
	private static final String MAIN_REPORT_FILE_NAME = "jasperreports/jobInstanceReport.jasper";

	/**
	 * Responsável por recuperar as informações de execuções de um Job
	 */
	private JobExplorer jobExplorer;
	
	public JobReportController() {}

	public void setJobExplorer(JobExplorer jobExplorer) {
		this.jobExplorer = jobExplorer;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(jobExplorer);
	}

	public ByteArrayOutputStream getLastJobInstanceReport(String jobName) {
		org.springframework.batch.core.JobInstance lastJobInstance = getLastJobInstance(jobName);
		JobInstance reportJobInstance = getJobInstance(lastJobInstance);
		return buildReport(reportJobInstance);
	}

	public ByteArrayOutputStream getJobInstanceReport(Long jobInstanceId) {
		org.springframework.batch.core.JobInstance jobInstance = jobExplorer.getJobInstance(jobInstanceId);
		JobInstance reportJobInstance = getJobInstance(jobInstance);
		return buildReport(reportJobInstance);
	}

	public ByteArrayOutputStream getJobExecutionReport(Long jobExecutionId) {
		org.springframework.batch.core.JobExecution jobExecution = jobExplorer.getJobExecution(jobExecutionId);
		JobInstance reportJobInstance = getJobInstance(jobExecution.getJobInstance());
		return buildReport(reportJobInstance);
	}
	
	public ByteArrayOutputStream getJobExecutionReport(JobExecution jobExecution) {
		JobInstance reportJobInstance = getJobInstance(jobExecution.getJobInstance());
		return buildReport(reportJobInstance);
	}

	/**
	 * <p>
	 * Gera um relatório para uma única instância de Job.
	 * </p>
	 * 
	 * @param jobInstance
	 * @return o relatório em PDF
	 */
	private ByteArrayOutputStream buildReport(JobInstance jobInstance) {
		
		List<JobInstance> singleElementJobInstanceList = new ArrayList<JobInstance>(1); 
		singleElementJobInstanceList.add(jobInstance);
		return buildReport(singleElementJobInstanceList);		
	}
	
	/**
	 * <p>
	 * Gera um relatório para uma lista de instâncias de Job.
	 * </p>
	 * 
	 * @param jobInstances
	 * @return o relatório em PDF
	 */
	private ByteArrayOutputStream buildReport(List<JobInstance> jobInstances) {
		Map<String, Object> parameters = new HashMap<String, Object>();
		
		try {
			URL jasperUrl = getMainReportUrl();
			InputStream inputStream = jasperUrl.openStream(); 
			String subReportDir = JobReportUtil.getParentUrl(jasperUrl.toString());
			parameters.put("SUBREPORT_DIR", subReportDir);
			JRBeanCollectionDataSource collectionDataSource = new JRBeanCollectionDataSource(jobInstances);
			JasperPrint jasperPrint = JasperFillManager.fillReport(inputStream, parameters, collectionDataSource);
			return exportReportToPdf(jasperPrint);
		}
		catch (JRException e) {
			throw new RuntimeException(e);
		}
		catch (IOException e) {
			throw new RuntimeException(e);
		}
		
	}

	/**
	 * <p>
	 * Exporta o relatório para PDF
	 * </p>
	 * 
	 * @param jasperPrint
	 * @return o relatório em PDF
	 * @throws JRException
	 */
	private ByteArrayOutputStream exportReportToPdf(JasperPrint jasperPrint) throws JRException {
		JRPdfExporter exporterPDF = new JRPdfExporter();
		exporterPDF.setParameter(JRPdfExporterParameter.JASPER_PRINT, jasperPrint);		
		
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		exporterPDF.setParameter(JRPdfExporterParameter.OUTPUT_STREAM, outputStream);
		exporterPDF.setParameter(JRPdfExporterParameter.IS_CREATING_BATCH_MODE_BOOKMARKS, Boolean.TRUE);
		exporterPDF.setParameter(JRPdfExporterParameter.IGNORE_PAGE_MARGINS, Boolean.TRUE);
		exporterPDF.exportReport();
		
		return outputStream;
	}

	/**
	 * <p>
	 * Recupera a instância do Job para a geração do relatório, a partir dos
	 * beans do Spring batch.
	 * </p>
	 * 
	 * @param jobInstance
	 * @return a instância do Job para a geração do relatório
	 */
	private JobInstance getJobInstance(org.springframework.batch.core.JobInstance jobInstance) {
		List<org.springframework.batch.core.JobExecution> jobExecutions = jobExplorer.getJobExecutions(jobInstance);
		return new JobInstance(jobInstance, jobExecutions);
	}

	/**
	 * <p>
	 * Recupera a URL do relatório principal.
	 * </p>
	 * 
	 * @return {@link URL}
	 */
	private URL getMainReportUrl() {
		ClassLoader loader = Thread.currentThread().getContextClassLoader();			
		URL jasperUrl = loader.getResource(MAIN_REPORT_FILE_NAME);
		return jasperUrl;
	}
	
	/**
	 * <p>
	 * Recupera a última instância executada do Job.
	 * </p>
	 * 
	 * @param jobName
	 * @return a última instância executada do Job
	 */
	private org.springframework.batch.core.JobInstance getLastJobInstance(String jobName) {
		List<org.springframework.batch.core.JobInstance> jobInstances = jobExplorer.getJobInstances(jobName, 0, 1);
		org.springframework.batch.core.JobInstance lastJobInstance = jobInstances.get(0);
		return lastJobInstance;
	}
	
	public void printExecutionReport(PrintStream writer, JobExecution jobExecution) {

		try {

			SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

			int totalReads = 0;
			int totalWrites = 0;
			int totalCommits = 0;
			int totalRollbacks = 0;
			int totalReadSkips = 0;
			int totalWriteSkips = 0;
			int totalProcessSkips = 0;

			writer.println("################## Job Execution Report ##################");
			
			String jobName = "[Job " + jobExecution.getJobInstance().getJobName() + "]";
			
			writer.println(jobName + " Instance: " + jobExecution.getJobInstance().getId());
			writer.println(jobName + " Parameters: " + jobExecution.getJobParameters());
			writer.println(jobName + " Execution: " + jobExecution.getId());

			Collection<StepExecution> steps = jobExecution.getStepExecutions();
			if (steps != null) {
				for (StepExecution step : steps) {
					try {
						Date startTime = step.getStartTime();
						Date endTime = step.getEndTime();

						String duration = "";
						if (endTime != null) {
							duration = DurationFormatUtils
									.formatDurationWords((endTime.getTime() - startTime.getTime()), true, true);
						}

						// Não contabiliza as partições criadas para o
						// processamento em paralelo.
						if (!step.getStepName().matches("(.*)partition\\d+")) {
							totalReads += step.getReadCount();
							totalWrites += step.getWriteCount();
							totalCommits += step.getCommitCount();
							totalRollbacks += step.getRollbackCount();
							totalReadSkips += step.getReadSkipCount();
							totalWriteSkips += step.getWriteSkipCount();
							totalProcessSkips += step.getProcessSkipCount();
						}
						
						String stepName = "[Step " + step.getStepName() + "]";
						
						writer.println("===========================");						
						writer.println(stepName + " Start Time: " + sdf.format(startTime));
						writer.println(stepName + " End Time: " + (endTime != null ? sdf.format(endTime) : ""));
						writer.println(stepName + " Duration: " + duration);
						writer.println(stepName + " Summary: " + step.getSummary());
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}

			Date startTime = jobExecution.getStartTime();
			Date endTime = jobExecution.getEndTime();

			String duration = "";
			if (endTime != null) {
				duration = DurationFormatUtils.formatDurationWords((endTime.getTime() - startTime.getTime()), true,
						true);
			}

			writer.println("===========================");
			writer.println(jobName + " Start time: " + sdf.format(startTime));
			writer.println(jobName + " End time: " + (endTime != null ? sdf.format(endTime) : ""));
			writer.println(jobName + " Duration: " + duration);
			writer.println(jobName + " Reads: " + totalReads);
			writer.println(jobName + " Writes: " + totalWrites);
			writer.println(jobName + " Commits: " + totalCommits);
			writer.println(jobName + " Rollbacks: " + totalRollbacks);
			writer.println(jobName + " ReadSkips: " + totalReadSkips);
			writer.println(jobName + " WriteSkips: " + totalWriteSkips);
			writer.println(jobName + " ProcessSkips: " + totalProcessSkips);

			writer.println(jobName + " Last updated: " + jobExecution.getLastUpdated());

			List<Throwable> exceptions = jobExecution.getAllFailureExceptions();

			if (!exceptions.isEmpty()) {
				writer.println(jobName + " Exceptions:");
				for (Throwable t : jobExecution.getAllFailureExceptions()) {
					writer.println(t + " - " + t.getMessage());
				}
			}

			BatchStatus batchStatus = jobExecution.getStatus();
			if (batchStatus != null) {
				writer.println(jobName + " Status: " + batchStatus.name());
			}

			ExitStatus exitStatus = jobExecution.getExitStatus();
			if (exitStatus != null) {
				writer.println(jobName + " ExitCode: " + exitStatus.getExitCode());
				writer.println(jobName + " ExitDescription: " + exitStatus.getExitDescription());
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	public void printExitReport(PrintStream writer, JobExecution jobExecution) {
		
		writer.println("Results of job " + jobExecution.getJobInstance().getJobName() + ":");
		writer.println("Job Id: " + jobExecution.getJobId());
		writer.println("Job Execution Id: " + jobExecution.getId());
		writer.println("Job Parameters: " + jobExecution.getJobParameters());
		writer.println("Start Time: " + jobExecution.getStartTime());
		Date endTime = jobExecution.getEndTime();
		if(endTime == null) {
			endTime = new Date();
		} else {
			writer.println("End Time: " + endTime);
		}
		String duration = DurationFormatUtils.formatDurationWords((endTime.getTime() - jobExecution.getStartTime().getTime()), true, true);		
		writer.println("Duration: " + duration);		
		writer.println("Status: " + jobExecution.getStatus());
		writer.println("Exit Code: "+ jobExecution.getExitStatus().getExitCode());		
		writer.println("Exit Description: " + jobExecution.getExitStatus().getExitDescription());
		
	}
	
	public void buildAndExportReport(PrintStream writer, JobExecution jobExecution, String outputPath) {		
		
		if(StringUtils.isEmpty(outputPath)) {
			outputPath = getOutputReportPath(jobExecution);			
		}
		
		ByteArrayOutputStream bOut = this.getJobExecutionReport(jobExecution);
		
		OutputStream outputStream = null;
		try {
			outputStream = new FileOutputStream(outputPath);
			bOut.writeTo(outputStream);
			writer.println("\n---------------------------------------------------");
			writer.println("Relatório gerado com sucesso: " + outputPath);
			writer.println("---------------------------------------------------");
		} catch(Exception e) {
			e.printStackTrace();
		} finally {
			if(outputStream != null) {
				try {
					outputStream.close();
				} catch(IOException e) { }
			}
		}
			
	}
		
	private String getOutputReportPath(JobExecution jobExecution) {
		String outputPath = System.getProperty(SystemPropertyKeys.JOB_MONITOR_OUTPUT_PATH);
		
		if(outputPath == null || outputPath.trim().length() == 0) {
			outputPath = System.getProperty(SystemPropertyKeys.OUTPUT) + File.separator + "monitoring";
			File output = new File(outputPath);
			if(!output.exists()) {
				output.mkdir();
			}
		}
		
		StringBuilder reportPath = new StringBuilder(outputPath);
		if(!reportPath.toString().endsWith(File.separator)) {
			reportPath.append(File.separator);
		}
		reportPath.append(jobExecution.getJobInstance().getJobName());		
		reportPath.append("[" + jobExecution.getId() + "]");
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyy-MM-dd_HH-mm");
		reportPath.append( sdf.format(new Date()));	
	
		ExitStatus exitStatus = jobExecution.getExitStatus();
		if(exitStatus != null) {
			reportPath.append("_" + exitStatus.getExitCode());
		}

		reportPath.append(".pdf");
	
		return reportPath.toString();
				
	}
	
}
