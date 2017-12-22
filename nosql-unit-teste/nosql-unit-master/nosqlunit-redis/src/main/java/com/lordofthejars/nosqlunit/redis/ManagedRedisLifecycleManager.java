package com.lordofthejars.nosqlunit.redis;

import static com.lordofthejars.nosqlunit.core.IOUtils.deleteDir;
import static java.util.concurrent.TimeUnit.SECONDS;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.lordofthejars.nosqlunit.core.AbstractLifecycleManager;
import com.lordofthejars.nosqlunit.core.CommandLineExecutor;
import com.lordofthejars.nosqlunit.core.OperatingSystem;
import com.lordofthejars.nosqlunit.core.OperatingSystemFamily;
import com.lordofthejars.nosqlunit.core.OperatingSystemResolver;
import com.lordofthejars.nosqlunit.core.OsNameSystemPropertyOperatingSystemResolver;
import com.lordofthejars.nosqlunit.env.SystemEnvironmentVariables;

public class ManagedRedisLifecycleManager extends AbstractLifecycleManager {

private static final Logger LOGGER = LoggerFactory.getLogger(ManagedRedis.class); 
	
	Process pwd;

	private static final String LOCALHOST = "127.0.0.1";

	public static final int DEFAULT_PORT = 6379;
	private static final int NO_MASTER_PORT = -1;
	protected static final String DEFAULT_REDIS_TARGET_PATH = "target" + File.separatorChar + "redis-temp";
	protected static final String REDIS_BINARY_DIRECTORY = "src";

	protected static final String REDIS_EXECUTABLE_X = "redis-server";

	protected static final String SLAVE_OF_ARGUMENT = "--slaveof";
	
	private String targetPath = DEFAULT_REDIS_TARGET_PATH;
	private String redisPath = SystemEnvironmentVariables.getEnvironmentOrPropertyVariable("REDIS_HOME");
	private String configurationFilepath = null;
	
	private int port = DEFAULT_PORT;

	private String masterHost;
	private int masterPort = NO_MASTER_PORT;
	
	private Map<String, String> extraCommandArguments = new HashMap<String, String>();
	private List<String> singleCommandArguments = new ArrayList<String>();

	private CommandLineExecutor commandLineExecutor = new CommandLineExecutor();
	private OperatingSystemResolver operatingSystemResolver = new OsNameSystemPropertyOperatingSystemResolver();

	public ManagedRedisLifecycleManager() {
		super();
	}

	@Override
	public String getHost() {
		return LOCALHOST;
	}

	@Override
	public int getPort() {
		return port;
	}

	@Override
	public void doStart() throws Throwable {

		LOGGER.info("Starting {} Redis instance.", redisPath);
		
		if (isWindowsSystem()) {
			throw new IllegalArgumentException(
					"Windows System is not supported, because there is no official Redis server for Windows.");
		}

		File targetPathDirectory = ensureTargetPathDoesNotExitsAndReturnCompositePath();

		if (targetPathDirectory.mkdirs()) {
			startRedisAsDaemon();
		} else {
			throw new IllegalStateException("Target Path " + targetPathDirectory + " could not be created.");
		}
		
		LOGGER.info("Started {} Redis instance.", redisPath);
		
	}

	private void startRedisAsDaemon() throws AssertionError {
		final CountDownLatch startupLatch = new CountDownLatch(1);
		new Thread(new Runnable() {
			@Override
			public void run() {
				try {
					startRedisProcess();
					startupLatch.countDown();
				} catch (InterruptedException e) {
					throw new IllegalStateException(e);
				}
			}

		}).start();

		try {
			startupLatch.await(5, SECONDS);
		} catch (InterruptedException e) {
			throw new AssertionError(e);
		}
	}

	private boolean isWindowsSystem() {
		return this.operatingSystemResolver.currentOperatingSystem().getFamily() == OperatingSystemFamily.WINDOWS;
	}

	private List<String> startRedisProcess() throws InterruptedException {
		try {
			pwd = startProcess();
			pwd.waitFor();
			if (pwd.exitValue() != 0) {
				List<String> consoleOutput = getConsoleOutput(pwd);
				throw new IllegalStateException("Redis [" + redisPath + " at port " + port
						+ "] could not be started. Next console message was thrown: " + consoleOutput);
			}
			return null;
		} catch (IOException e) {
			throw new IllegalStateException("Redis [" + redisPath + " at port " + port
					+ "] could not be started. Next console message was thrown: " + e.getMessage());
		}
	}

	private File ensureTargetPathDoesNotExitsAndReturnCompositePath() {
		File dbPath = new File(targetPath);
		if (dbPath.exists()) {
			deleteDir(dbPath);
		}
		return dbPath;
	}

	private Process startProcess() throws IOException {
		return this.commandLineExecutor.startProcessInDirectoryAndArguments(targetPath,
				buildOperationSystemProgramAndArguments());
	}

	private List<String> getConsoleOutput(Process pwd) throws IOException {
		return this.commandLineExecutor.getConsoleOutput(pwd);
	}

	private List<String> buildOperationSystemProgramAndArguments() {

		List<String> programAndArguments = new ArrayList<String>();

		programAndArguments.add(getExecutablePath());
		addConfigurationPath(programAndArguments);
		addSlaveOfParameter(programAndArguments);

		for (String argument : this.singleCommandArguments) {
			programAndArguments.add(argument);
		}

		for (String argumentName : this.extraCommandArguments.keySet()) {
			programAndArguments.add(argumentName);
			programAndArguments.add(this.extraCommandArguments.get(argumentName));
		}

		return programAndArguments;

	}

	private String getExecutablePath() {
		return this.redisPath + File.separatorChar + REDIS_BINARY_DIRECTORY + File.separatorChar + redisExecutable();
	}

	private String redisExecutable() {
		OperatingSystem operatingSystem = this.operatingSystemResolver.currentOperatingSystem();

		switch (operatingSystem.getFamily()) {
		case WINDOWS:
			throw new IllegalArgumentException(
					"Windows System is not supported, because there is no official Redis server for Windows.");
		default:
			return REDIS_EXECUTABLE_X;
		}

	}

	private List<String> addSlaveOfParameter(List<String> programAndArguments) {
		
		if(isMasterDefined()) {
			programAndArguments.add(SLAVE_OF_ARGUMENT+" "+this.masterHost+" "+Integer.toString(this.masterPort));
		}
		
		return programAndArguments;
	}
	
	private List<String> addConfigurationPath(List<String> programAndArguments) {

		if (this.configurationFilepath != null) {
			programAndArguments.add(this.configurationFilepath);
		}

		return programAndArguments;
	}

	@Override
	public void doStop() {
		
		LOGGER.info("Stopping {} Redis instance.", redisPath);
		
		try {
			stopRedis();
		} catch (InterruptedException e) {
			throw new IllegalStateException(e);
		} finally {
			ensureTargetPathDoesNotExitsAndReturnCompositePath();
		}
		
		LOGGER.info("Stopped {} Redis instance.", redisPath);
	}

	private void stopRedis() throws InterruptedException {
		if (isProcessAlive()) {
			pwd.destroy();
			TimeUnit.SECONDS.sleep(2);
		}
	}

	private boolean isProcessAlive() {
		return pwd != null;
	}

	private boolean isMasterDefined() {
		return this.masterHost != null && this.masterPort != NO_MASTER_PORT;
	}
	
	public void setTargetPath(String targetPath) {
		this.targetPath = targetPath;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public void setRedisPath(String redisPath) {
		this.redisPath = redisPath;
	}
	
	public void setMasterHost(String host) {
		this.masterHost = host;
	}

	public void setMasterPort(int port) {
		this.masterPort = port;
	}
	
	public void addExtraCommandLineArgument(String argumentName, String argumentValue) {
		this.extraCommandArguments.put(argumentName, argumentValue);
	}

	public void addSingleCommandLineArgument(String argument) {
		this.singleCommandArguments.add(argument);
	}

	public String getRedisPath() {
		return redisPath;
	}

	public void setConfigurationFilepath(String configurationFilepath) {
		this.configurationFilepath = configurationFilepath;
	}

	public void setOperatingSystemResolver(OperatingSystemResolver operatingSystemResolver) {
		this.operatingSystemResolver = operatingSystemResolver;
	}

	public void setCommandLineExecutor(CommandLineExecutor commandLineExecutor) {
		this.commandLineExecutor = commandLineExecutor;
	}

}
