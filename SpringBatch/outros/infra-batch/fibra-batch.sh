#!/bin/bash
# POSIX

FIBRA_BATCH_SCRIPT_VERSION="1.0"

# Usage info
show_help() {
   echo "FIBRA-BATCH script v$FIBRA_BATCH_SCRIPT_VERSION"
   echo "------------*------------"
   echo "Help"   
   echo "-c, --config: Diretório do arquivo fibra-batch.properties"
   echo "-l, --log: Diretório onde serão gerados os logs"
   echo "-e, --env: Parâmetros passados para a JVM (opcional)"
   echo "-jar: arquivo JAR a ser executado"
   echo "-x, --xml: Caminho do arquivo XML com a definição do Job"
   echo "-i, --id: JobID"
   echo "-p, --params: Parâmetros do job no formato chave1=valor1 chave2=valor2... etc"
   echo "-v, --verbose: Direciona o log para stdout"
   echo "Exemplo: fibra-batch.sh -c /opt/fibra -l /opt/logs fibra-xxx-batch.jar -x jobs/MeuJob.xml -i jobId -p \"ator=XXX ecu=\\\"CASO DE USO\\\"\""
   echo "------------*------------"
}

if [ "x$JAVA_OPTS" = "x" ]; then
   JAVA_OPTS="-Duser.timezone=America/Sao_Paulo"
   #JAVA_OPTS="$JAVA_OPTS -Xms1303m -Xmx1303m -XX:MaxPermSize=768"   
else
   echo "JAVA_OPTS already set in environment"
fi

# Reset all variables that might be set
CONFIG_PATH=
LOG_PATH=
ENV=
VERBOSE=
JAR=
XML=
ID=
PARAMS=

while :; do
	case $1 in
		-h|-\?|--help)   # Call a "show_help" function to display a synopsis, then exit.
			show_help
			exit
		;;
		-c|--config)       # Takes an option argument, ensuring it has been specified.
			if [ -n "$2" ]; then
				CONFIG_PATH=$2
				shift 2
				continue
			else
				printf 'ERROR: "--config" requires a non-empty option argument.\n' >&2
				exit 1
			fi
		;;
		--config=?*)
			CONFIG_PATH=${1#*=} # Delete everything up to "=" and assign the remainder.
		;;
		--config=)         # Handle the case of an empty --config=
			printf 'ERROR: "--config" requires a non-empty option argument.\n' >&2
			exit 1
		;;
		-l|--log)       
		if [ -n "$2" ]; then
			LOG_PATH=$2
			shift 2
			continue
		else
			printf 'ERROR: "--log" requires a non-empty option argument.\n' >&2
			exit 1
		fi
		;;
		--log=?*)
			LOG_PATH=${1#*=} 
		;;
		--log=)         
			printf 'ERROR: "--log" requires a non-empty option argument.\n' >&2
			exit 1
		;;  
		-e|--env)       
			if [ -n "$2" ]; then
				ENV=$2
				shift 2
				continue
			else
				printf 'ERROR: "--env" requires a non-empty option argument.\n' >&2
				exit 1
			fi
		;;        
		--env=?*)
			ENV=${1#*=} 
		;;
		--env=)         
			printf 'ERROR: "--env" requires a non-empty option argument.\n' >&2
			exit 1
		;;            
		-jar|--jar)       
			if [ -n "$2" ]; then
				JAR=$2
				shift 2
				continue
			else
				printf 'ERROR: "-jar" requires a non-empty option argument.\n' >&2
				exit 1
			fi
		;;
		--jar=?*)
			JAR=${1#*=} 
		;;
		--jar=)         
			printf 'ERROR: "-jar" requires a non-empty option argument.\n' >&2
			exit 1
		;;
		-x|--xml)       
			if [ -n "$2" ]; then
				XML=$2
				shift 2
				continue
			else
				printf 'ERROR: "--xml" requires a non-empty option argument.\n' >&2
				exit 1
			fi
		;;
		--xml=?*)
			XML=${1#*=} 
		;;
		--xml=)         
			printf 'ERROR: "--xml" requires a non-empty option argument.\n' >&2
			exit 1
		;;    
		-i|--id)       
			if [ -n "$2" ]; then
				ID=$2
				shift 2
				continue
			else
				printf 'ERROR: "--id" requires a non-empty option argument.\n' >&2
				exit 1
			fi
		;;
		--id=?*)
			ID=${1#*=} 
		;;
		--id=)         
			printf 'ERROR: "--id" requires a non-empty option argument.\n' >&2
			exit 1
		;;
		-p|--params)       
			if [ -n "$2" ]; then
				PARAMS=$2
				shift 2
				continue
			else
				printf 'ERROR: "--params" requires a non-empty option argument.\n' >&2
				exit 1
			fi
		;;
		--params=?*)
			PARAMS=${1#*=} 
		;;
		--params=)         
			printf 'ERROR: "--params" requires a non-empty option argument.\n' >&2
			exit 1
		;;
		-v|--verbose)       
			VERBOSE="-Dfibra.verbose=true"
		;;
		-?*)
			printf 'WARN: Unknown option (ignored): %s\n' "$1" >&2
		;;
		*)               # Default case: If no more options then break out of the loop.
			break
	esac
   
	shift
done

if [ -z "$CONFIG_PATH" ]
then
	echo "####################################################################################"	
	echo "ERRO: É necessário definir o diretório onde está o arquivo fibra-batch.properties"	
	echo "EXEMPLO: --config /opt/fibra"	
	echo "####################################################################################"
	exit 1
fi

if [ -z "$JAR" ]
then
	echo "####################################################################################"	
	echo "ERRO: É necessário definir o arquivo .jar que será executado"	
	echo "EXEMPLO: -jar fibra-xxx-batch.jar"	
	echo "####################################################################################"
	exit 1
fi

if [ -z "$XML" ]
then
	echo "####################################################################################"	
	echo "ERRO: É necessário definir o arquivo XML que contém a definição do job"	
	echo "EXEMPLO: -x jobs/MeuJob.xml"	
	echo "####################################################################################"
	exit 1
fi

if [ -z "$ID" ]
then
	echo "####################################################################################"	
	echo "ERRO: É necessário definir o arquivo Id do Job"	
	echo "EXEMPLO: -i JobId"	
	echo "####################################################################################"
	exit 1
fi

echo "FIBRA-BATCH script v$FIBRA_BATCH_SCRIPT_VERSION"
echo "executando..."
echo "java $JAVA_OPTS -Dfibra.config.dir=$CONFIG_PATH -Dfibra.log.dir=$LOG_PATH $ENV $VERBOSE -jar $CONFIG_PATH/$JAR $XML $ID $PARAMS"

java $JAVA_OPTS -Dfibra.config.dir=$CONFIG_PATH -Dfibra.log.dir=$LOG_PATH $ENV $VERBOSE -jar $CONFIG_PATH/$JAR $XML $ID $PARAMS

#Pastas em homologação
#/opt/approtinas/hom_37099_fibrabatch

#/opt/appfiles/hom_37099_fibrabatch/entrada

