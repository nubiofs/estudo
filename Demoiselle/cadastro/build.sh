#!/bin/sh
# cd /opt/demoiselle/estudo.git/Demoiselle/cadastro
~/mvn clean install -Dmaven.test.skip=true --offline
rm -rf /opt/demoiselle/jboss-eap-6.3/standalone/deployments/cadastro.war
cp ./target/cadastro.war /opt/demoiselle/jboss-eap-6.3/standalone/deployments

