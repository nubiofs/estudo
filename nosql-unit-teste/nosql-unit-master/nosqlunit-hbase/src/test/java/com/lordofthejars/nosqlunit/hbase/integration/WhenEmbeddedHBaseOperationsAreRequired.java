package com.lordofthejars.nosqlunit.hbase.integration;

import static com.lordofthejars.nosqlunit.hbase.EmbeddedHBase.EmbeddedHBaseRuleBuilder.newEmbeddedHBaseRule;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.client.Get;
import org.apache.hadoop.hbase.client.HBaseAdmin;
import org.apache.hadoop.hbase.client.HTable;
import org.apache.hadoop.hbase.client.Result;
import org.junit.ClassRule;
import org.junit.Test;

import com.lordofthejars.nosqlunit.hbase.EmbeddedHBase;
import com.lordofthejars.nosqlunit.hbase.EmbeddedHBaseInstances;
import com.lordofthejars.nosqlunit.hbase.HBaseConfiguration;
import com.lordofthejars.nosqlunit.hbase.HBaseOperation;

public class WhenEmbeddedHBaseOperationsAreRequired {

	@ClassRule
	public static EmbeddedHBase embeddedHBase = newEmbeddedHBaseRule().build();
	
	private static final String HBASE_DATASET = "{\r\n" + 
			"  \"name\": \"mytable\",\r\n" + 
			"  \"columnFamilies\": [\r\n" + 
			"    {\r\n" + 
			"      \"name\": \"mycf\",\r\n" + 
			"      \"rows\": [\r\n" + 
			"        {\r\n" + 
			"          \"key\": \"key\",\r\n" + 
			"          \"columns\": [\r\n" + 
			"            {\r\n" + 
			"              \"name\": \"col1\",\r\n" + 
			"              \"value\": \"val1\"\r\n" + 
			"            },\r\n" + 
			"            {\r\n" + 
			"              \"name\": \"col2\",\r\n" + 
			"              \"value\": \"val2\"\r\n" + 
			"            }\r\n" + 
			"          ]\r\n" + 
			"        }\r\n" + 
			"      ]\r\n" + 
			"    }\r\n" + 
			"  ]\r\n" + 
			"}";
	
	@Test
	public void insert_operation_should_add_all_dataset_to_hbase() throws IOException {
		
		Configuration configuration = EmbeddedHBaseInstances.getInstance().getDefaultConfiguration();
		HBaseOperation hBaseOperation = hBaseOperation(configuration);
		
		hBaseOperation.insert(new ByteArrayInputStream(HBASE_DATASET.getBytes()));
		
		HTable table = new HTable(configuration, "mytable");
		Get get = new Get("key".getBytes());
		Result result = table.get(get);
		
		assertThat(result.size(), is(2));
		
	}
	
	@Test
	public void delete_all_operation_should_remove_all_data() throws IOException {
		
		Configuration configuration = EmbeddedHBaseInstances.getInstance().getDefaultConfiguration();
		HBaseOperation hBaseOperation = hBaseOperation(configuration);
		
		hBaseOperation.insert(new ByteArrayInputStream(HBASE_DATASET.getBytes()));
		
		hBaseOperation.deleteAll();
		
		HBaseAdmin hBaseAdmin = new HBaseAdmin(configuration);
		
		assertThat(hBaseAdmin.tableExists("mytable"), is(false));
		
	}
	
	@Test
	public void database_is_operation_should_compare_database() throws IOException {
		
		Configuration configuration = EmbeddedHBaseInstances.getInstance().getDefaultConfiguration();
		HBaseOperation hBaseOperation = hBaseOperation(configuration);
		
		hBaseOperation.insert(new ByteArrayInputStream(HBASE_DATASET.getBytes()));
		boolean result = hBaseOperation.databaseIs(new ByteArrayInputStream(HBASE_DATASET.getBytes()));
		hBaseOperation.deleteAll();
		
		assertThat(result, is(true));
	}
	
	private HBaseOperation hBaseOperation(Configuration configuration) {
		HBaseConfiguration hBaseConfiguration = new HBaseConfiguration();
		hBaseConfiguration.setConfiguration(configuration);
		HBaseOperation hBaseOperation = new HBaseOperation(hBaseConfiguration);
		return hBaseOperation;
	}
	
}
