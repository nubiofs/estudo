package io.openshift.booster;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.http.HttpServer;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.healthchecks.HealthCheckHandler;
import io.vertx.ext.healthchecks.Status;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.StaticHandler;

import static io.vertx.core.http.HttpHeaders.CONTENT_TYPE;

/**
 * $ mvn clean install
 * $ java -jar target/health-check-vertx-9-SNAPSHOT.jar 
		fev 08, 2018 3:04:39 PM io.vertx.core.impl.launcher.commands.VertxIsolatedDeployer
		INFORMAÇÕES: Succeeded in deploying verticle
 * 
 * $ curl -i http://localhost:8080/api/health/liveness
		HTTP/1.1 200 OK
		Content-Type: application/json;charset=UTF-8
		Content-Length: 64

		{"checks":[{"id":"server-online","status":"UP"}],"outcome":"UP"}
 *
 *$ curl -i http://localhost:8080/api/health/readiness
		HTTP/1.1 200 OK
		Content-Length: 2

		OK
 *
 *$ curl -i http://localhost:8080/api/killme
		HTTP/1.1 200 OK
		Content-Length: 37

		Stopping HTTP server, Bye bye world !
 *
 *$ curl -i http://localhost:8080/api/health/liveness
		HTTP/1.1 503 Service Unavailable
		Content-Type: application/json;charset=UTF-8
		Content-Length: 68

		{"checks":[{"id":"server-online","status":"DOWN"}],"outcome":"DOWN"}
 *
 */
public class HttpApplication extends AbstractVerticle {

  private static final String template = "Hello, %s!";

  private boolean online = false;
  @SuppressWarnings("unused")
  private HttpServer server;

  @Override
  public void start(Future<Void> future) {
    Router router = Router.router(vertx);

    HealthCheckHandler healthCheckHandler = HealthCheckHandler.create(vertx)
        .register("server-online", fut -> fut.complete(online ? Status.OK() : Status.KO()));

    
    
    router.get("/api/greeting").handler(this::greeting);
    router.get("/api/killme").handler(this::killMe);
    router.get("/api/health/readiness").handler(rc -> rc.response().end("OK"));
    router.get("/api/health/liveness").handler(healthCheckHandler);
    router.get("/").handler(StaticHandler.create());

    server = vertx
        .createHttpServer()
        .requestHandler(router::accept)
        .listen(
            config().getInteger("http.port", 8080), ar -> {
              online = ar.succeeded();
              future.handle(ar.mapEmpty());
            });
  }

  private void killMe(RoutingContext rc) {
    rc.response().end("Stopping HTTP server, Bye bye world !");
    online = false;
    //$ ~/mvn clean install -DskipTests=true
    //server.close();
  }

  private void greeting(RoutingContext rc) {
    if (!online) {
      rc.response().setStatusCode(400).putHeader(CONTENT_TYPE, "text/plain").end("Not online");
      return;
    }

    String name = rc.request().getParam("name");
    if (name == null) {
      name = "World";
    }

    JsonObject response = new JsonObject()
        .put("content", String.format(template, name));

    rc.response()
        .putHeader(CONTENT_TYPE, "application/json; charset=utf-8")
        .end(response.encodePrettily());
  }
}
