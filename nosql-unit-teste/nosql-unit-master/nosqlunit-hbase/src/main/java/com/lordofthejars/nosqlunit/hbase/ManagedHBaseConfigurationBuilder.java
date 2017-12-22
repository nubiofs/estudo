package com.lordofthejars.nosqlunit.hbase;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.coprocessor.CoprocessorHost;

public class ManagedHBaseConfigurationBuilder {

	private final HBaseConfiguration hBaseConfiguration;
	
	private ManagedHBaseConfigurationBuilder() {
		super();
		this.hBaseConfiguration = new HBaseConfiguration();

		Configuration configuration = org.apache.hadoop.hbase.HBaseConfiguration.create();
		configuration.set(CoprocessorHost.REGION_COPROCESSOR_CONF_KEY,
				"org.apache.hadoop.hbase.coprocessor.AggregateImplementation");
		this.hBaseConfiguration.setConfiguration(configuration);
	}
	
	public static ManagedHBaseConfigurationBuilder newManagedHBaseConfiguration() {
		return new ManagedHBaseConfigurationBuilder();
	}
	
	public ManagedHBaseConfigurationBuilder connectionIdentifier(String connectionIdentifier) {
		this.hBaseConfiguration.setConnectionIdentifier(connectionIdentifier);
		return this;
	}
	
	public ManagedHBaseConfigurationBuilder setProperty(String name, String value) {
		this.hBaseConfiguration.getConfiguration().set(name, value);
		return this;
	}
	
	public HBaseConfiguration build() {
		return this.hBaseConfiguration;
	}
	
}
