package br.gov.serpro.supde.infra.batch.core.concurrent;

import org.springframework.batch.core.Step;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.core.partition.PartitionHandler;
import org.springframework.batch.core.partition.support.PartitionStep;
import org.springframework.batch.core.partition.support.Partitioner;
import org.springframework.batch.core.partition.support.SimpleStepExecutionSplitter;
import org.springframework.batch.core.partition.support.TaskExecutorPartitionHandler;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.util.Assert;

import br.gov.serpro.supde.infra.batch.core.context.InfraJobContext;
import br.gov.serpro.supde.infra.batch.core.context.SpringContextFactory;

/**
 * PartitionStep customizavel para facilitar a criação de partitionStep como beans 
 * e adicionar listeners no "partitionStep", por exemplo.
 * Também auxilia na configuração do gridSize de acordo com o taskExecutor utilizado.
 * 
 * @author 05601970475
 *
 */
public class CustomPartitionStep extends PartitionStep {
	
	/**
	 * Step.
	 */
	private Step step;

	/**
	 * Executor de tarefa.
	 */
	private TaskExecutor taskExecutor;

	/**
	 * Identifica as entradas de cada particionamento do step.
	 */
	private Partitioner partitioner;

	/**
	 * O controlador de particionamento.
	 */
	private PartitionHandler partitionHandler;
	
	/**
	 * GridSize.
	 */
	private int gridSize = 0;
	
	
	
	/**
	 * Recupera o step.
	 */
	public Step getStep() {		
		return step;
	}

	/**
	 * Atribui o step.
	 */
	public void setStep(Step step) {
		this.step = step;
	}
	
	public void setListeners(StepExecutionListener[] listeners) {
		super.setStepExecutionListeners(listeners);		
	}

	/**
	 * Atribui o executor de tarefa. 
	 */
	public void setTaskExecutor(TaskExecutor taskExecutor) {
		this.taskExecutor = taskExecutor;
	}

	public Partitioner getPartitioner() {
		return partitioner;
	}

	public void setPartitioner(Partitioner partitioner) {
		this.partitioner = partitioner;
	}

	public int getGridSize() {
		return gridSize;
	}

	public void setGridSize(int gridSize) {
		this.gridSize = gridSize;
	}

	@Override
	public void setPartitionHandler(PartitionHandler partitionHandler) {
		super.setPartitionHandler(partitionHandler);
		this.partitionHandler = partitionHandler;
	}
	
	@Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(step);
		Assert.notNull(partitioner);
		
		if(getJobRepository() == null) {
			JobRepository jobRepository = (JobRepository) SpringContextFactory.getBean(JobRepository.class);
			setJobRepository(jobRepository);			
		}
		
		if(taskExecutor == null) {
			ConcurrentTaskExecutorDelegate concurrentTaskExecutor = (ConcurrentTaskExecutorDelegate) SpringContextFactory.getBean(ConcurrentTaskExecutorDelegate.class);
			setTaskExecutor(concurrentTaskExecutor);
		}
		
		initPartitionHandler();
		initStepExecutionSplitter();
		configureGridSize();

		super.afterPropertiesSet();
	}

	/**
	 * Caso o gridSize não seja definido explicitamente ou seja definido um valor menor do que 1,
	 * Configura-o de acordo com o taskExecutor.
	 */
	private final void configureGridSize() {
		if(this.gridSize < 1) {
			
			if(taskExecutor instanceof ThreadPoolTaskExecutor) {
				this.gridSize = ((ThreadPoolTaskExecutor)taskExecutor).getMaxPoolSize();
			} else if(taskExecutor instanceof SimpleAsyncTaskExecutor) {
				this.gridSize = ((SimpleAsyncTaskExecutor)taskExecutor).getConcurrencyLimit();
			} else {			
				this.gridSize = InfraJobContext.getInstance().getThreads();
			}
		}
		
		TaskExecutorPartitionHandler taskExecutorPartitionHandler = (TaskExecutorPartitionHandler) partitionHandler;
		taskExecutorPartitionHandler.setGridSize(this.gridSize);
		
	}

	/**
	 * Atribui o handler do particionamento.
	 */
	private final void initPartitionHandler() {
		TaskExecutorPartitionHandler taskExecutorPartitionHandler = new TaskExecutorPartitionHandler();
		taskExecutorPartitionHandler.setStep(step);
		taskExecutorPartitionHandler.setTaskExecutor(taskExecutor);
		setPartitionHandler(taskExecutorPartitionHandler);
	}

	/**
	 * Atribui o splitter da execução.
	 */
	private final void initStepExecutionSplitter() {
		SimpleStepExecutionSplitter splitter = new SimpleStepExecutionSplitter(getJobRepository(), true, getName(), partitioner);
		setStepExecutionSplitter(splitter);
	}

}