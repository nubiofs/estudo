package br.gov.serpro.supde.infra.batch.sample.test;

import static org.junit.Assert.assertEquals;

import java.util.Map;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.test.JobLauncherTestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.google.gson.reflect.TypeToken;

import br.gov.serpro.supde.infra.batch.core.context.InfraJobContext;
import br.gov.serpro.supde.infra.batch.util.JSONUtils;

//Executar com o VM argument -Dinfra.config.dir=<diretorio dos arquivos de configuracao do infra-batch>

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:sample-jobs/sampleJDBC-job.xml",
		"classpath:/spring/context/infra/batch/test-context.xml" })
public class SampleTest {

	static {
		InfraJobContext.getInstance().configureJobContext("sampleJDBCJob");
	}
	
	@Autowired
	private JobLauncherTestUtils jobLauncherTestUtils;
	
	@Before
	public void setUp() {		
		//InfraJobContext.getInstance().configureJobContext(jobLauncherTestUtils.getJob().getName());		
	}

	@Test
	public void testStep1() throws Exception {
		// Testando um step específico
		JobExecution jobExecution = jobLauncherTestUtils.launchStep("step1");

		assertEquals(BatchStatus.COMPLETED, jobExecution.getStatus());
	}
	
	/*
		Testes dos steps que acessam o banco de dados comentados por não
		existir um banco livre para testes.		
	@Test
	public void testStep2() throws Exception {
		// Testando um step específico
		JobExecution jobExecution = jobLauncherTestUtils.launchStep("step2");

		assertEquals(BatchStatus.COMPLETED, jobExecution.getStatus());
	}

	@Test
	public void testJob() throws Exception {
		// Testando um Job inteiro
		JobExecution jobExecution = jobLauncherTestUtils.launchJob();

		assertEquals(BatchStatus.COMPLETED, jobExecution.getStatus());
	}
*/

}
