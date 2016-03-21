#!/bin/sh

#Nome do Servidor web
export SERVER=$1

if [ -z $SERVER ]; then
    echo "Entre com o nome do servidor web: [apache2 | tomcat]"
    exit
elif [ $SERVER = "apache2" ]; then
	
	#Caminho para o Build do(s) projeto(s) no servidor web apache2
	export SERVER_PATH=/var/www/html

elif [ $SERVER = "tomcat" ]; then

	#Caminho para o Build do(s) projeto(s) no servidor web apache2
	export SERVER_PATH=/opt/demoiselle/apache-tomcat-9.0.0.M3/webapps

fi

echo "Servidor web: " $SERVER

#Nome do projeto
export MY_PROJECT=$2

echo "Nome do diretório do projeto: " $MY_PROJECT

if [ -z $MY_PROJECT ]; then
    echo "Entre com o nome do diretório do projeto"
    exit
elif [ $MY_PROJECT = "." ]; then
	
	if [ $SERVER = "apache2" ]; then
	
		cp $SERVER_PATH/index.html .
		rm -rf $SERVER_PATH/*
		cp -R . $SERVER_PATH/
		rm -rf index.html
		rm -rf $SERVER_PATH/build.sh
	
	else
		
		cp -R . $SERVER_PATH/
		rm -rf $SERVER_PATH/build.sh
		
	fi
	
else

    rm -rf $SERVER_PATH/$MY_PROJECT
    cp -R $MY_PROJECT $SERVER_PATH/
    
fi





