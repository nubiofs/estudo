#/bin/bash

################################################################################
# set require variables.
################################################################################
DIRECTORY=$(dirname $0)
BASENAME=$(basename $0)

COLLECTION_NAME="json_tables"
SAMPLEJSON="sample.json"
#Comandos Inserts SQL para o Postgresql
PG_INSERTS="sample_pg_inserts.json"

################################################################################
# source library files
################################################################################
source ${DIRECTORY}/lib/pg_func_lib.sh

################################################################################
# declare require arrays
################################################################################
#
# Para (10000000) linhas "cada linha é um documento para uma coleção", o json terá 
# mais de 5GB (5651356KB) de dados.
# Para contar linhas "-l", palavras "-w" e caracteres "-c":
# $ wc -l sample.json
# "levou mais de 2 minutos para contar 2182796 linhas"
#
declare -a json_rows=(10000000)

for (( indx=0 ; indx < ${#json_rows[@]} ; indx++ ))
do

	#creating json data.
	generate_json_rows "${json_rows[${indx}]}" \
                      "${SAMPLEJSON}"

done

print_result "number of rows"     "${json_rows[@]}"

#rm -rf ${SAMPLEJSON}*

