package com.example.HelloWorldPrometheusInstrumentation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.prometheus.client.spring.boot.EnablePrometheusEndpoint;
import io.prometheus.client.spring.boot.EnableSpringBootMetricsCollector;
import io.prometheus.client.Counter;
import io.prometheus.client.Histogram;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
// Add route annotations below
@RestController
public class HelloWorldPrometheusInstrumentationApplication {

	static final Counter requests = Counter.build()
		.namespace("java")
		.name("requests_total").help("Total number of requests.").register();

	static final Counter failedRequests = Counter.build()
		.namespace("java")
		.name("requests_failed_total").help("Total failed requests.").register();

	static final Histogram requestLatency = Histogram.build()
		.namespace("java")
		//.buckets(.01, .02, .03, .04)
		.name("requests_latency_seconds").help("Request latency in seconds.").register();

	@RequestMapping("/")
	public String home() {

		String retorno = "";
		double duration = 0;

		//requests.inc(1);
		requests.inc();
		//requests.labels("get").inc();

		// Start the histogram timer
		Histogram.Timer requestTimer = requestLatency.startTimer();

		try {
			
			// Your code here.
			retorno = "Hello World!";

		} catch (Exception e) {
          		failedRequests.inc();
          		throw e;
        	} finally {
			// Stop the histogram timer
			duration = requestTimer.observeDuration();
			System.out.println("Stop the histogram timer: " + duration);
		}
		
		requestLatency.observe(duration);

		return retorno;

	}

	public static void main(String[] args) {
		SpringApplication.run(HelloWorldPrometheusInstrumentationApplication.class, args);
	}

}
