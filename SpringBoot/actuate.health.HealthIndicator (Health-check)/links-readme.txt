Fontes:

	https://github.com/spring-projects/spring-boot/tree/v1.5.10.RELEASE/spring-boot-actuator

	https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready

	https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-endpoints.html
	https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-monitoring.html#production-ready-health-access-restrictions
	https://appdev.openshift.io/docs/spring-boot-runtime.html#mission-health-check-spring-boot-tomcat

tutoriais:

	https://www.dineshonjava.com/spring-boot-actuator-complete-guide/
	http://www.devglan.com/spring-boot/spring-boot-actuator-rest-endpoints-example
	http://www.devglan.com/spring-boot/spring-boot-actuator-tutorial-guide
	http://www.baeldung.com/spring-boot-actuators
	https://dzone.com/articles/spring-boot-actuator-a-complete-guide

	https://blog.jayway.com/2014/07/22/spring-boot-custom-healthindicator/


Obs.:


Feature	|	Problem Addressed	|	Framework
Health Check	|	Checks readiness and liveness of the service. Service restarts automatically if probing fails.	|	Spring Boot Actuator

Extra:

Spring boot admin:

	https://smarttechie.org/2017/06/18/spring-boot-admin-admin-ui-for-administration-of-spring-boot-applications/


* Primeiro exemplo:

https://github.com/spring-projects/spring-boot/blob/master/spring-boot-samples/spring-boot-sample-actuator-ui/src/test/java/sample/actuator/ui/SampleActuatorUiApplicationPortTests.java


* Segundo exemplo:

Códigos:

https://github.com/spring-projects/spring-boot/blob/master/spring-boot-samples/spring-boot-sample-actuator/src/test/resources/application-endpoints.properties
https://github.com/spring-projects/spring-boot/blob/master/spring-boot-samples/spring-boot-sample-actuator/src/main/java/sample/actuator/SampleActuatorApplication.java
https://github.com/spring-projects/spring-boot/blob/master/spring-boot-samples/spring-boot-sample-actuator/src/main/java/sample/actuator/ExampleHealthIndicator.java

https://github.com/spring-projects/spring-boot/blob/master/spring-boot-samples/spring-boot-sample-actuator/src/test/java/sample/actuator/SampleActuatorApplicationTests.java
https://github.com/spring-projects/spring-boot/blob/master/spring-boot-samples/spring-boot-sample-actuator/src/test/java/sample/actuator/ManagementAddressActuatorApplicationTests.java

