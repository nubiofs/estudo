#!/bin/sh
# Pasta do Jboss:
export MY_JBOSS_PATH=/home/clenubio/Desenvolvimento/EAP-6.4.0
# Nome da build do projeto:
export PROJECT_BUILD=tutorial01.war
~/mvn clean install -Dmaven.test.skip=true --offline
rm -rf $MY_JBOSS_PATH/standalone/deployments/$PROJECT_BUILD
cp ./target/$PROJECT_BUILD $MY_JBOSS_PATH/standalone/deployments
#END
