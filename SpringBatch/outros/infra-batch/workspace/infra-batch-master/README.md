## Infraestrutura de apoio para processamento BATCH com Spring-Batch

- Fornece uma infraestrutura básica para criação dos Jobs
- Define um archetype maven para facilitar a criação de novos projetos
- Cria um esquema de configuração dos Jobs através de arquivo de configuração separado da aplicação (infra-batch.properties)
- Facilita a criação de Jobs para processamento distribuído
- Cria relatórios de execução e monitoramento da execução dos Jobs
- Fornece alguns exemplos com diferentes técnicas para otimização do processamento

Acesse a documentação de referência do [Spring-Batch](http://docs.spring.io/spring-batch/reference/html/)

### Criação do Projeto

Para criar um projeto utilizando o infra-batch existe um archetype do maven 
no catálogo do Nexus (http://nexus.aic.serpro/service/local/repo_groups/public/content/archetype-catalog.xml)
infra-batch-sample-archetype

```
$ mvn archetype:generate -DarchetypeCatalog=http://nexus.aic.serpro/service/local/repo_groups/public/content/ -DarchetypeArtifactId=infra-batch-sample-archetype -DarchetypeGroupId=br.gov.serpro.supde.infra -DarchetypeVersion=3.0.0 -DarchetypeRepository=http://nexus.aic.serpro/content/groups/public
```

### Ambiente de Execução

O empacotamento dos projetos, criados a partir do archetype citados anteriormente, cria um arquivo JAR que poderá ser executado a partir da linha de comando, por exemplo:
```
java -Dinfra.config.dir=/opt/infra-batch -jar meu-batch-1.0.0-executable.jar jobs/meuJob.xml jobId paramX="..."
```

O "VM argument" -Dinfra.config.dir define o caminho do diretório onde estão os arquivos **log4j.properties** e **infra-batch.properties**. 

- O log4j.properties define as configurações de log do processamento do Job. Exemplo de um arquivo [log4j.properties](https://git.serpro/05601970475/infra-batch/blob/master/sample_resources/log4j.properties)

- O infra-batch.properties define as configurações de execução do Job (propriedades de conexão com o banco de dados, diretório de entrada e saída de recursos utilizados pelo Job, configuração de threads para processamento paralelo, configurações de fila JMS para processamento distribuído e etc). Exemplo de um arquivo [infra-batch.properties](https://git.serpro/05601970475/infra-batch/blob/master/sample_resources/infra-batch.properties).

Após o nome do jar, é necessário informar os seguintes parâmetros (exatamente na ordem indicada abaixo):

1. Caminho para o arquivo xml com a definição do Job
2. Nome do Job a ser executado
3. Demais parâmetros do Job no formato chave=valor. O InfraJobRunner utiliza o (docs.spring.io/spring-batch/apidocs/org/springframework/batch/core/launch/support/CommandLineJobRunner.html), verifique a documentação do mesmo para ver todos os parâmetros permitidos.

#### Algumas considerações

- Para evitar erros "Job Terminated in error: A job execution for this job is already running" no ambiente de desenvolvimento, adicione o parâmetro -next, em Program arguments, para que o incrementer seja acionado e gerada uma nova JobInstance.

- Também é possível adicionar, em VM arguments, o parâmetro -Dinfra.log.dir para definir uma pasta específica para os arquivos de log (se essa propriedade não for definida os logs serão armazenados em uma pasta "log" dentro do diretório configurado em -Dinfra.config.dir). Para direcionar o log também para o console (stdout), adicione a System Property -Dinfra.verbose=true.

- As System properties sobreescrevem as propriedades configuradas no arquivo * *infra-batch.properties* *.

- Testes Unitários: As aplicações geradas a partir dos archetypes citados anteriormente possuem exemplos de uso do jUnit para testar os Jobs.

- Execução de testes unitários a partir do maven: Para executar a fase de testes no maven é necessário passar o seguinte VM Argument para a execução do mesmo: -DargLine="-Dinfra.config.dir=<<diretório do arquivo infra-batch.properties>>"

#### ShellScript

O seguinte shell script (https://git.serpro/05601970475/infra-batch/blob/master/sample_resources/infra-batch.sh) pode ser utilizado para iniciar e monitorar a execução dos Jobs. 
Execute o script com a opção -h para  uma ajuda.

### Infra-Batch-Core

O infra-batch-core é o componente responsável por implementar o comportamento comum e fornecer algumas facilidades para o desenvolvimento dos Jobs.

Para utilizar as funcionalidades do infra-batch-core é necessário importar as definições do contexto do spring no Job, exemplo: 
```xml
<beans:import resource="classpath:/spring/context/infra/batch/infra-batch-context.xml" />
```
Este contexto possui as configurações do jobRepository, jobLauncher, configuração de conexão com o banco de dados e etc. 
A aplicação só precisa se preocupar em implementar os Jobs. 
A infraestrutura necessária já está definida no infra-batch-context.xml e os parâmetros de configuração são definidos no arquivo infra-batch.properties.

#### ParentJob

Existem algumas definições padrões para os Jobs. Para utilizar essas definições, defina o parent da seguinte forma:

```xml
<batch:job id="sampleCSVJob" parent="infraParentJob">
...
</batch:job>
```

#### ParentStep

Também existem algumas definições padrões para os steps, dessa forma, todo step deve herdar de infraParentStep (em steps que executem tasklets) ou infraParentChunkedStep (para steps que executem chunks). Definem a transação, o commit-interval (para os chunks), NoRollbackException (se for lançada esse tipo de exception, o rollback não é efetuado) e SkippableException (para os chunks).

```xml
<batch:step id="step1" parent="infraParentStep" next="step2">
    <batch:tasklet ref="sampleTasklet" />
</batch:step>
<batch:step id="step2" parent="infraParentChunkedStep">
    <batch:tasklet task-executor="syncTaskExecutor">
        <batch:chunk reader="sampleJDBCReader" writer="cvsFileItemWriter"/>
    </batch:tasklet>
</batch:step>
```

#### Listeners

Tanto o infraParentJob, quanto os infraParentStep e infraParentChunkedStep definem listeners. Dessa forma, caso precise definir algum listener específico, é necessário utilizar o atributo merge="true", para preservar o comportamento comum. Exemplo:

```xml
<batch:job id="sampleCSVJob" parent="infraParentJob">
...
    <batch:listeners merge="true">
    <!-- meus listeners específicos -->
    </batch:listeners>
</batch:job>
```

#### InfraJobContext
 

O InfraJobContext é configurado, a partir do arquivo infra-batch.properties, no início do processamento e contém informações sobre o contexto de execução do Job, por exemplo:

- Diretório onde estão os arquivos de entrada do Job (inputPath).
- Diretório onde deverão ser gerados os arquivos de saída do Job (outputPath).
- Modo de simulação. Se ativado, nenhum commit é executado no banco de dados (simulationMode).

As informações do InfraJobContext podem ser acessadas através de expression language na definição dos Jobs. Exemplo:

```xml
<beans:bean name="sampleCSVReader" 	class="br.gov.serpro.supde.infra.batch.core.support.CSVFileItemReader">
    <beans:property name="lineMapper" ref="XXXLineMapper" />
    <beans:property name="resource" value="file:#{infraJobContext.inputPath}/XXX.csv"/>		
</beans:bean>
```

##### Sobreescrevendo Configurações do infra-batch.properties

Algumas configurações podem ser customizadas para um sistema ou Job específico. O carregamento das propriedades segue a seguinte ordem de prioridade:

1. Linha de Comando (opcional): Os parâmetros passados como System Property na linha de comando tem prioridade sobre todos os demais arquivos de configuração.
2. jobId.properties (opcional): Um arquivo .properties na pasta /resources do projeto com o mesmo nome do jobId (ou seja, o arquivo vai embarcado no jar). Carrega suas propriedades quando o job específico executar.
3. app-context.properties (obrigatório): Todos os módulos devem possuir um arquivo app-context.properties na pasta /resources do projeto (ou seja, o arquivo vai embarcado no jar).
4. infra-batch.properties: Depois de carregar todas as configurações dos passos anteriores, o componente finalmente carrega as configurações gerais do infra-batch.properties, mantendo as carregadas anteriormente.

### Performance e Escalabilidade
 
No Spring-Batch, é possivel definir um task-executor para a execução dos steps de um Job. O infra-core-batch define beans para cada tipo de task-executor (que pode ser configurado no arquivo infra-batch.properties):
 
- syncTaskExecutor - Uma única Thread executa todo o step

- simpleAsyncTaskExecutor - Múltiplas threads disponíveis para a execução do step (as threads são criadas sempre que necessário e a quantidade máxima de threads concorrentes é definido na propriedade infra.executor.maxThreads do arquivo infra-batch.properties)

- threadPoolTaskExecutor - Pool de threads disponível para execução do step (as propriedades infra.executor.threads, infra.executor.maxThread, infra.executor.queueCapacity e infra.executor.keepAliveSeconds definem as configurações do pool)

- concurrentTaskExecutor - Cria um task-executor baseado nos tipos de Executor do pacote java.util.concurrent (a propriedade infra.executor.type define o tipo do executor: SINGLE, FIXED ou CACHED)

Obs: Ao utilizar algum task-executor multithread, certifique-se de que a execução do step em questão é thread-safe. Na aplicação gerada a partir do archetype infra-batch-sample-archetype existem alguns exemplos de utilização de task-executor multithread (sampleJDBCPartitionStep-job.xml, sampleQueueParallelStep-job.xml e sampleCSVPartitionStep-job.xml).

Também é possível melhorar a performance do Job tornando apenas a execução da fase "process" assíncrona (nos casos onde não é possível, ou viável, paralelizar a execução da fase "read") utilizando as classes AsyncItemProcessor e AsyncItemWriter. Exemplo:

```xml
<beans:bean id="asyncProcessor"
	class="org.springframework.batch.integration.async.AsyncItemProcessor">
	<beans:property name="delegate">
		<beans:bean class="br.gov.serpro.supde.infra.batch.sample.SampleProcessor" />
	</beans:property>
	<beans:property name="taskExecutor" ref="threadPoolTaskExecutor"/>
</beans:bean>
 
<beans:bean id="asyncWriter"
	class="org.springframework.batch.integration.async.AsyncItemWriter">
	<beans:property name="delegate">
		<beans:bean class="br.gov.serpro.supde.infra.batch.sample.SampleWriter" />
	</beans:property>
</beans:bean>
```

#### Processamento Distribuído
 
Os principais métodos, definidos no spring-batch, para processamento distribuído são o Remote Chunking e o Remote Partitioning.
 
- **Remote Chunking** - O processamento do step é distribuído entre os vários nós slave, entretanto, a leitura e a escrita do step é sempre executada em um nó master. A utilização deste método é recomendada apenas nos casos onde as fases de escrita e leitura não são o gargalo e sim a execução do processamento. Na aplicação gerada a partir do archetype infra-batch-sample-archetype veja um exemplo de implementação em **sampleRemoteChunk-job.xml**.
- **Remote Partitioning** - Toda a execução do step (leitura, processamento e escrita) é executada de forma distribuída entre o master e os nós slave. Na aplicação gerada a partir do archetype infra-batch-sample-archetype veja um exemplo de implementação em **sampleRemotePartitionedStep-job.xml**.

Obs1: Para iniciar nós escravos para processamento distribuído de um Job, é necessário adicionar o seguinte VM Argument: **-Dinfra.slave=true**

Obs2: A comunicação entre o nó master e os nós escravos é feita através de JMS, a configuração relativa a conexão entre os nós está nas propriedades com prefixo **infra.jms** no arquivo infra-batch.properties.

### Monitorando a Execução dos Jobs
 
A execução dos Jobs pode ser monitorada através da linha de comando, gerando saída no console ou em PDF, ou através de uma interface WEB.

#### Monitorando a Execução a partir da linha de comando

É possível gerar relatórios de monitoração a partir da linha de comando passando o parâmetro -report para o job, exemplo:

```
java -Dinfra.config.dir=/opt/infra-batch -jar meu-batch-1.0.0-executable.jar jobs/meuJob.xml meuJobId -report
```

#### Ignorando geração em PDF ao final do processamento

Por padrão sempre é gerado um PDF no final do processamento com algumas informações sobre o status de execução e sobre o tempo de processamento de cada step. Para ignorar a geração automática desse relatório utilize a seguinte propriedade:
```
infra.ignorePDFReport=true
```

#### Utilizando a Interface WEB

A execução dos Jobs pode ser acompanhada a partir do *INFRA Batch Admin* 
(que nada mais é do que o spring-batch-admin com algumas customizações no visual e na forma de referenciar o jobRepository). 
Uma versão do INFRA-Batch-Admin pode ser obtida no nexus em (http://nexus.aic.serpro/#nexus-search;quick~infra-batch-admin). 
Baixe o .war mais recente e o mesmo poderá ser implantado em um servidor de aplicação Java (JBoss, Tomcat e etc).

A única configuração necessária para executar o Infra Batch Admin é a System Property **infra.config.dir** definindo o diretório do arquivo **infra-batch.properties** com as configurações de acesso ao jobRepository. 
Exemplo de configuração da System Property no servidor de aplicação JBoss EAP 6+:

No arquivo standalone.xml, definir a system-property infra.config.dir com o valor do caminho do diretório onde está o arquivo infra-batch.properties:

```xml
<system-properties>
        <property name="infra.config.dir" value="/opt/infra-batch"/>
	<!-- Outras propriedades de sistema...  -->
</system-properties>
```

A aplicação será iniciada no contexto **/infra-batch-admin** e todos os Jobs executados no jobRepository configurado no infra-batch.properties poderão ser monitorados.