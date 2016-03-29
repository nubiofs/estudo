#!/bin/sh

DiretorioNaoExiste(){
	
	if [ ! -d $SERVER_PATH ]; then

		echo "O caminho, "$SERVER_PATH", para a Build do(s) projeto(s) no Servidor Web ("$1") não existe!"
		exit
		
    fi
    
}

ProblemaServidorNome(){
	
	echo "Entre com o nome do servidor web: [apache2 | tomcat]."
    exit

}

#Nome do Servidor web
export SERVER=$1

if [ -z $SERVER ]; then
	
	# Quando não informado valor para $SERVER 
    ProblemaServidorNome
    
elif [ $SERVER = "apache2" ]; then

   	#Caminho para o Build do(s) projeto(s) no servidor web apache2
	export SERVER_PATH=/var/www/html

elif [ $SERVER = "tomcat" ]; then

	#Caminho para o Build do(s) projeto(s) no servidor web tomcat
	export SERVER_PATH=/opt/demoiselle/apache-tomcat-9.0.0.M3/webapps
	#export SERVER_PATH=/home/clenubio/Desenvolvimento/apache-tomcat-9.0.0.M4/webapps

else
	
	# Quando informado outro servidor diferente de "apache2" ou "tomcat"
	ProblemaServidorNome
	
fi

DiretorioNaoExiste $SERVER

echo "Servidor web: " $SERVER

#Nome do projeto
export MY_PROJECT=$2

if [ -z $MY_PROJECT ]; then

    echo "Entre com o nome do diretório do projeto."
    exit
    
elif [ $MY_PROJECT = "." ]; then
	
	if [ $SERVER = "apache2" ]; then

		cp $SERVER_PATH/index.html .
		rm -rf $SERVER_PATH/*
		cp -R . $SERVER_PATH/
		rm -rf index.html
	
	else
	
		# Quando $SERVER = "tomcat"
		cp -R . $SERVER_PATH/
		
	fi
	
	rm -rf $SERVER_PATH/build.sh
	
else

    rm -rf $SERVER_PATH/$MY_PROJECT
    cp -R $MY_PROJECT $SERVER_PATH/
    
fi

echo "Nome do diretório do projeto: " $MY_PROJECT





