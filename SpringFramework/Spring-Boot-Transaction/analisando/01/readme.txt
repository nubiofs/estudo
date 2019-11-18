https://github.com/MaBeuLux88/java-spring-boot-mongodb-starter
https://www.mongodb.com/blog/post/rest-apis-with-java-spring-boot-and-mongodb
https://www.mongodb.com/blog/post/quick-start-getting-your-free-mongodb-atlas-cluster
https://www.mongodb.com/blog/post/mongodb-multi-document-acid-transactions-general-availability


----
(Setting up replication):

https://github.com/bitnami/bitnami-docker-mongodb

-> Step 1: Create the replication primary

$ docker run --name mongodb-primary \
  -e MONGODB_REPLICA_SET_MODE=primary \
  -e MONGODB_ADVERTISED_HOSTNAME=mongodb-primary \
  -e MONGODB_ROOT_PASSWORD=password123 \
  -e MONGODB_REPLICA_SET_KEY=replicasetkey123 \
  bitnami/mongodb:latest


--> Step 3: Create a replication arbiter node (docker-compose):

	version: '2'

	services:
	  mongodb-primary:
	    image: 'bitnami/mongodb:latest'
	    environment:
	      - MONGODB_ADVERTISED_HOSTNAME=mongodb-primary
	      - MONGODB_REPLICA_SET_MODE=primary
	      - MONGODB_ROOT_PASSWORD=password123
	      - MONGODB_REPLICA_SET_KEY=replicasetkey123

	    volumes:
	      - 'mongodb_master_data:/bitnami'

	  mongodb-secondary:
	    image: 'bitnami/mongodb:latest'
	    depends_on:
	      - mongodb-primary
	    environment:
	      - MONGODB_ADVERTISED_HOSTNAME=mongodb-secondary
	      - MONGODB_REPLICA_SET_MODE=secondary
	      - MONGODB_PRIMARY_HOST=mongodb-primary
	      - MONGODB_PRIMARY_PORT_NUMBER=27017
	      - MONGODB_PRIMARY_ROOT_PASSWORD=password123
	      - MONGODB_REPLICA_SET_KEY=replicasetkey123

	  mongodb-arbiter:
	    image: 'bitnami/mongodb:latest'
	    depends_on:
	      - mongodb-primary
	    environment:
	      - MONGODB_ADVERTISED_HOSTNAME=mongodb-arbiter
	      - MONGODB_REPLICA_SET_MODE=arbiter
	      - MONGODB_PRIMARY_HOST=mongodb-primary
	      - MONGODB_PRIMARY_PORT_NUMBER=27017
	      - MONGODB_PRIMARY_ROOT_PASSWORD=password123
	      - MONGODB_REPLICA_SET_KEY=replicasetkey123

	volumes:
	  mongodb_master_data:
	    driver: local


$ docker-compose up --detach --scale mongodb-primary=1 --scale mongodb-secondary=3 --scale mongodb-arbiter=1




______

https://www.baeldung.com/spring-data-mongodb-transactions

Setup MongoDB 4.0

First, we'll need to setup latest MongoDB to try the new native transactions support.

To get started, we have to download the latest version from the MongoDB Download Center.

Next, we'll start mongod service using the command line:
1
	

//--replSet this flag is for setting the name of the replica set.

$ mongod --replSet rs0

Finally, initiate replica set – if not already:
1
	
mongo --eval "rs.initiate()"

Note that MongoDB currently supports transactions over a replica set.


===

https://hub.docker.com/r/bitnami/mongodb/

A replication cluster can easily be setup with the Bitnami MongoDB Docker Image using the following environment variables:

    MONGODB_REPLICA_SET_MODE: The replication mode. Possible values primary/secondary/arbiter. No defaults.
    MONGODB_REPLICA_SET_NAME: MongoDB replica set name. Default: replicaset

$ docker run --name mongodb-primary \
  -e MONGODB_REPLICA_SET_MODE=primary \
  -e MONGODB_ADVERTISED_HOSTNAME=mongodb-primary \
  -e MONGODB_ROOT_PASSWORD=password123 \
  -e MONGODB_REPLICA_SET_KEY=replicasetkey123 \
  bitnami/mongodb:latest



How is a replica set configured?

There are three different roles in a replica set configuration (primary, secondary or arbiter). Each one of these roles are configured in a different way:

Primary node configuration:

The replica set is started with the "rs.initiate()" command and some configuration options to force the primary to be the primary. Basically, the priority is increased from the default (1) to 5. To verify the primary is actually the primary we validate it with the db.isMaster().ismaster command.

The primary node has a volume attached so the data is preserved between deployments as long as the volume exists.

In addition, the primary node initialization script will check for the existence of a .initialized file in the /bitnami/mongodb folder to discern whether it should create a new replica set or on the contrary a replica set has already been initialized.

If the primary got killed and the volume is deleted, in order to start it again in the same replica set it is important to launch the container with the original IP so other members of the replica set already knows about it.


++++


PersonControllerIT.postPerson
com.mongodb.starter.PersonControllerIT
postPerson(com.mongodb.starter.PersonControllerIT)
com.mongodb.MongoClientException: Sessions are not supported by the MongoDB cluster to which this client is connected
	at com.mongodb.client.internal.MongoClientImpl.startSession(MongoClientImpl.java:127)
	at com.mongodb.client.internal.MongoClientImpl.startSession(MongoClientImpl.java:113)
	at com.mongodb.starter.repositories.MongoDBPersonRepository.deleteAll(MongoDBPersonRepository.java:107)
	at com.mongodb.starter.PersonControllerIT.tearDown(PersonControllerIT.java:53)
	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.base/java.lang.reflect.Method.invoke(Method.java:566)
	at org.junit.platform.commons.util.ReflectionUtils.invokeMethod(ReflectionUtils.java:675)
	at org.junit.jupiter.engine.execution.MethodInvocation.proceed(MethodInvocation.java:60)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain$ValidatingInvocation.proceed(InvocationInterceptorChain.java:125)
	at org.junit.jupiter.engine.extension.TimeoutExtension.intercept(TimeoutExtension.java:132)
	at org.junit.jupiter.engine.extension.TimeoutExtension.interceptLifecycleMethod(TimeoutExtension.java:111)
	at org.junit.jupiter.engine.extension.TimeoutExtension.interceptAfterEachMethod(TimeoutExtension.java:95)
	at org.junit.jupiter.engine.execution.ExecutableInvoker$ReflectiveInterceptorCall.lambda$ofVoidMethod$0(ExecutableInvoker.java:115)
	at org.junit.jupiter.engine.execution.ExecutableInvoker.lambda$invoke$0(ExecutableInvoker.java:105)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain$InterceptedInvocation.proceed(InvocationInterceptorChain.java:104)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain.proceed(InvocationInterceptorChain.java:62)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain.chainAndInvoke(InvocationInterceptorChain.java:43)
	at org.junit.jupiter.engine.execution.InvocationInterceptorChain.invoke(InvocationInterceptorChain.java:35)
	at org.junit.jupiter.engine.execution.ExecutableInvoker.invoke(ExecutableInvoker.java:104)
	at org.junit.jupiter.engine.execution.ExecutableInvoker.invoke(ExecutableInvoker.java:98)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.invokeMethodInExtensionContext(ClassBasedTestDescriptor.java:464)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$synthesizeAfterEachMethodAdapter$17(ClassBasedTestDescriptor.java:454)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$invokeAfterEachMethods$9(TestMethodTestDescriptor.java:228)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$invokeAllAfterMethodsOrCallbacks$12(TestMethodTestDescriptor.java:256)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$invokeAllAfterMethodsOrCallbacks$13(TestMethodTestDescriptor.java:256)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1540)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.invokeAllAfterMethodsOrCallbacks(TestMethodTestDescriptor.java:255)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.invokeAfterEachMethods(TestMethodTestDescriptor.java:226)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:139)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:69)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$5(NodeTestTask.java:135)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$7(NodeTestTask.java:125)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:135)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:123)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:122)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:80)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1540)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:38)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$5(NodeTestTask.java:139)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$7(NodeTestTask.java:125)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:135)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:123)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:122)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:80)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1540)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:38)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$5(NodeTestTask.java:139)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$7(NodeTestTask.java:125)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:135)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:123)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:122)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:80)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:32)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:51)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:229)
	at org.junit.platform.launcher.core.DefaultLauncher.lambda$execute$6(DefaultLauncher.java:197)
	at org.junit.platform.launcher.core.DefaultLauncher.withInterceptedStreams(DefaultLauncher.java:211)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:191)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:137)
	at org.eclipse.jdt.internal.junit5.runner.JUnit5TestReference.run(JUnit5TestReference.java:89)
	at org.eclipse.jdt.internal.junit.runner.TestExecution.run(TestExecution.java:41)
	at org.eclipse.jdt.internal.junit.runner.RemoteTestRunner.runTests(RemoteTestRunner.java:541)
	at org.eclipse.jdt.internal.junit.runner.RemoteTestRunner.runTests(RemoteTestRunner.java:763)
	at org.eclipse.jdt.internal.junit.runner.RemoteTestRunner.run(RemoteTestRunner.java:463)
	at org.eclipse.jdt.internal.junit.runner.RemoteTestRunner.main(RemoteTestRunner.java:209)


