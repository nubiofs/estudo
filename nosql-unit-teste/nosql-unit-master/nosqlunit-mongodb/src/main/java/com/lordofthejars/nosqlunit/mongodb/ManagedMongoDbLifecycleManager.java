package com.lordofthejars.nosqlunit.mongodb;

import static com.lordofthejars.nosqlunit.core.IOUtils.deleteDir;

import java.io.File;
import java.io.IOException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.lordofthejars.nosqlunit.core.AbstractLifecycleManager;
import com.lordofthejars.nosqlunit.core.CommandLineExecutor;
import com.lordofthejars.nosqlunit.core.OperatingSystem;
import com.lordofthejars.nosqlunit.core.OperatingSystemResolver;
import com.lordofthejars.nosqlunit.core.OsNameSystemPropertyOperatingSystemResolver;
import com.lordofthejars.nosqlunit.env.SystemEnvironmentVariables;

public class ManagedMongoDbLifecycleManager extends AbstractLifecycleManager {

	private static final Logger LOGGER = LoggerFactory.getLogger(ManagedMongoDbLifecycleManager.class);
	public ManagedMongoDbLifecycleManager() {
		super();
	}
	
	private static final String LOCALHOST = "localhost";

	protected static final String CONFIG_SERVER_ENABLED = "--configsvr";
	protected static final String SHARD_SERVER_ENABLED = "--shardsvr";
	protected static final String JOURNALING_ENABLED = "--journal";
	protected static final String NONE_JOURNALING_ENABLED = "--nojournal";
	protected static final String LOGPATH_ARGUMENT_NAME = "--logpath";
	protected static final String DBPATH_ARGUMENT_NAME = "--dbpath";
	protected static final String REPLICA_SET_ARGUMENT_NAME = "--replSet";
	protected static final String PORT_ARGUMENT_NAME= "--port";
	protected static final String DEFAULT_MONGO_LOGPATH = "logpath";
	protected static final String DEFAULT_MONGO_DBPATH = "mongo-dbpath";
	protected static final String DEFAULT_MONGO_TARGET_PATH = "target"
			+ File.separatorChar + "mongo-temp";
	protected static final String DEFAULT_MONGO_REPLICA_SET_NAME = "";
	protected static final boolean DEFAULT_MONGO_SHARD_SERVER = false;
	protected static final boolean DEFAULT_MONGO_CONFIG_SERVER = false;

	protected static final String MONGODB_BINARY_DIRECTORY = "bin";

	protected static final String MONGODB_EXECUTABLE_X = "mongod";
	protected static final String MONGODB_EXECUTABLE_W = "mongod.exe";
	protected static final int DEFAULT_PORT = 27017;

	private String mongodPath = SystemEnvironmentVariables.getEnvironmentOrPropertyVariable("MONGO_HOME");
	private int port = DEFAULT_PORT;
	
	private String targetPath = DEFAULT_MONGO_TARGET_PATH;
	private String dbRelativePath = DEFAULT_MONGO_DBPATH;
	private String logRelativePath = DEFAULT_MONGO_LOGPATH;
	private String replicaSetName = DEFAULT_MONGO_REPLICA_SET_NAME;
	
	private boolean shardServer = DEFAULT_MONGO_SHARD_SERVER;
	private boolean configServer = DEFAULT_MONGO_CONFIG_SERVER;
	private boolean journaling = false;
	
	private Map<String, String> extraCommandArguments = new HashMap<String, String>();
	private List<String> singleCommandArguments = new ArrayList<String>();

	private CommandLineExecutor commandLineExecutor = new CommandLineExecutor();
	private OperatingSystemResolver operatingSystemResolver = new OsNameSystemPropertyOperatingSystemResolver();
	private MongoDbLowLevelOps mongoDbLowLevelOps = MongoDbLowLevelOpsFactory.getSingletonInstance();

	private ProcessRunnable processRunnable;
	
	@Override
	public String getHost() {
		return LOCALHOST;
	}

	@Override
	public int getPort() {
		return this.port;
	}

	@Override
	public void doStart() throws Throwable {
		
		LOGGER.info("Starting {} MongoDb instance.", mongodPath);
		
		File dbPath = ensureDbPathDoesNotExitsAndReturnCompositePath();

		if (dbPath.mkdirs()) {
			startMongoDBAsADaemon();
			boolean isServerUp = assertThatConnectionToMongoDbIsPossible();

			if (!isServerUp) {
				throw new IllegalStateException(
						"Couldn't establish a connection with "
								+ this.mongodPath
								+ " server at /127.0.0.1:"+port);
			}

		} else {
			throw new IllegalStateException("Db Path " + dbPath
					+ " could not be created.");
		}
		
		LOGGER.info("Started {} MongoDb instance.", mongodPath);
	}

	@Override
	public void doStop() {
		
		LOGGER.info("Stopping {} MongoDb instance.", mongodPath);
		
		try {
			if(this.processRunnable != null) {
				this.processRunnable.destroyProcess();
			}
		} finally {
			ensureDbPathDoesNotExitsAndReturnCompositePath();
		}
		
		LOGGER.info("Stopped {} MongoDb instance.", mongodPath);
	}


	private List<String> startMongoDBAsADaemon() throws InterruptedException {
        CountDownLatch processIsReady = new CountDownLatch(1);
        processRunnable = new ProcessRunnable(processIsReady);
        Thread thread = new Thread(processRunnable);
        thread.start();
        processIsReady.await();
        return processRunnable.consoleOutput;
	}


	private List<String> buildOperationSystemProgramAndArguments() {

		List<String> programAndArguments = new ArrayList<String>();

		programAndArguments.add(getExecutablePath());
		
		if(isReplicaSetNameSet()) {
			programAndArguments.add(REPLICA_SET_ARGUMENT_NAME);
			programAndArguments.add(this.replicaSetName);
		}

		programAndArguments.add(DBPATH_ARGUMENT_NAME);
		programAndArguments.add(dbRelativePath);
		programAndArguments.add(PORT_ARGUMENT_NAME);
		programAndArguments.add(Integer.toString(port));
		programAndArguments.add(LOGPATH_ARGUMENT_NAME);
		programAndArguments.add(logRelativePath);
		programAndArguments.add(journalingArgument());
		
		if(isShardServerConfigured()) {
			programAndArguments.add(SHARD_SERVER_ENABLED);
		}
		
		if(isConfigServerConfigured()) {
			programAndArguments.add(CONFIG_SERVER_ENABLED);
		}
		
		for (String argument : this.singleCommandArguments) {
			programAndArguments.add(argument);
		}

		for (String argumentName : this.extraCommandArguments.keySet()) {
			programAndArguments.add(argumentName);
			programAndArguments.add(this.extraCommandArguments
					.get(argumentName));
		}

		return programAndArguments;

	}

	private boolean isConfigServerConfigured() {
		return this.configServer;
	}

	private boolean isShardServerConfigured() {
		return this.shardServer;
	}

	public boolean isReplicaSetNameSet() {
		return this.replicaSetName != DEFAULT_MONGO_REPLICA_SET_NAME;
	}

	private String getExecutablePath() {
		return this.mongodPath + File.separatorChar + MONGODB_BINARY_DIRECTORY
				+ File.separatorChar + mongoExecutable();
	}

	private String mongoExecutable() {
		OperatingSystem operatingSystem = this.operatingSystemResolver
				.currentOperatingSystem();

		switch (operatingSystem.getFamily()) {
		case WINDOWS:
			return MONGODB_EXECUTABLE_W;
		default:
			return MONGODB_EXECUTABLE_X;
		}

	}

	private boolean assertThatConnectionToMongoDbIsPossible()
			throws InterruptedException, UnknownHostException {
		return this.mongoDbLowLevelOps.assertThatConnectionIsPossible(LOCALHOST, port);
	}

	private File ensureDbPathDoesNotExitsAndReturnCompositePath() {
		File dbPath = new File(targetPath + File.separatorChar + dbRelativePath);
		if (dbPath.exists()) {
			deleteDir(dbPath);
		}
		return dbPath;
	}

	public void setDbRelativePath(String dbRelativePath) {
		this.dbRelativePath = dbRelativePath;
	}

	public void setLogRelativePath(String logRelativePath) {
		this.logRelativePath = logRelativePath;
	}

	public void setMongodPath(String mongodPath) {
		this.mongodPath = mongodPath;
	}

	public void setReplicaSetName(String replicaSetName) {
		this.replicaSetName = replicaSetName;
	}
	
	public void setTargetPath(String targetPath) {
		this.targetPath = targetPath;
	}

	public void addExtraCommandLineArgument(String argumentName,
			String argumentValue) {
		this.extraCommandArguments.put(argumentName, argumentValue);
	}

	public void addSingleCommandLineArgument(String argument) {
		this.singleCommandArguments.add(argument);
	}

	public void setPort(int port) {
		this.port = port;
	}
	
	public void setJournaling(boolean journaling) {
		this.journaling = journaling;
	}
	
	public void setShardServer(boolean shardServer) {
		this.shardServer = shardServer;
	}
	
	public void setConfigServer(boolean configServer) {
		this.configServer = configServer;
	}
	
	protected String getMongodPath() {
		return mongodPath;
	}

	protected void setCommandLineExecutor(
			CommandLineExecutor commandLineExecutor) {
		this.commandLineExecutor = commandLineExecutor;
	}

	protected void setOperatingSystemResolver(
			OperatingSystemResolver operatingSystemResolver) {
		this.operatingSystemResolver = operatingSystemResolver;
	}

	protected void setMongoDbLowLevelOps(MongoDbLowLevelOps mongoDbLowLevelOps) {
		this.mongoDbLowLevelOps = mongoDbLowLevelOps;
	}

	protected String journalingArgument() {
		return this.journaling ? JOURNALING_ENABLED : NONE_JOURNALING_ENABLED;
	}

	public String getReplicaSetName() {
		return replicaSetName;
	}
	
    public class ProcessRunnable implements Runnable {

        private CountDownLatch processIsReady;
        private List<String> consoleOutput;

        private Process process;
        
        public ProcessRunnable(CountDownLatch processIsReady) {
            this.processIsReady = processIsReady;
        }

        @Override
        public void run() {
            try {
            	process = startProcess();
                //consoleOutput = getConsoleOutput(process);
            } catch (IOException e) {
                throw prepareException(e);
            } finally {
                processIsReady.countDown();
            }

            try {
            	process.waitFor();
                if (process.exitValue() != 0) {
                    LOGGER.info(
                            "Mongodb ["
                                    + mongodPath
                                    + DBPATH_ARGUMENT_NAME
                                    + dbRelativePath
                                    + PORT_ARGUMENT_NAME
                                    + port
                                    + LOGPATH_ARGUMENT_NAME
                                    + logRelativePath
                                    + "] console output is: "
                                    + consoleOutput);
                }
            } catch (InterruptedException ie) {
                throw prepareException(ie);
            }

        }

        public void destroyProcess() {
        	if(this.process != null) {
        		this.process.destroy();
        	}
        }
        
        private IllegalStateException prepareException(Exception e) {
            return new IllegalStateException(
                    "Mongodb ["
                            + mongodPath
                            + DBPATH_ARGUMENT_NAME
                            + dbRelativePath
                            + PORT_ARGUMENT_NAME
                            + port
                            + LOGPATH_ARGUMENT_NAME
                            + logRelativePath
                            + "] could not be started. Next console message was thrown: "
                            + e.getMessage());
        }
        
        private Process startProcess() throws IOException {
    		return commandLineExecutor.startProcessInDirectoryAndArguments(
    				targetPath, buildOperationSystemProgramAndArguments());
    	}
        
        private List<String> getConsoleOutput(Process pwd) throws IOException {
    		return commandLineExecutor.getConsoleOutput(pwd);
    	}
    }

}
