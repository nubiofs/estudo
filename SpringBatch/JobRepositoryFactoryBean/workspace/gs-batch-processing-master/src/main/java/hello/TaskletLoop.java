package hello;

import java.util.Map;

import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;

@Component
public class TaskletLoop implements Tasklet {

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {

		Map<String, Object> parametros = chunkContext.getStepContext().getJobParameters();
		
		String str = parametros.get("numLoops") != null ? (String) parametros.get("numLoops") : "100"; 
		Long numLoops = Long.valueOf(str); 
		
		System.out.println("[" + Thread.currentThread().getName() + "] [TaskletLoop] numLoops = " + numLoops);
		
		while (numLoops > 0L) {
			System.out.println("[" + Thread.currentThread().getName() + "] [TaskletLoop] Infos: " + numLoops--);
			//System.out.print("[TaskletLoop] Infos...");
			//numLoops--;
		}
		
		System.out.println("[" + Thread.currentThread().getName() + "] FIM!");
		
		return null;
		
	}

}
