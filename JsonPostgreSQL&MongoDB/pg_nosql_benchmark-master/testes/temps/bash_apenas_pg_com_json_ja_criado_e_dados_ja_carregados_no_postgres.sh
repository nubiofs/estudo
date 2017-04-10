#/bin/bash

################################################################################
# set require variables.
################################################################################
DIRECTORY=$(dirname $0)
BASENAME=$(basename $0)

PGHOME="/usr/lib/postgresql/9.5"
PGHOST="127.0.0.1"
PGPORT="5432"
PGUSER="postgres"
PGPASSWORD="post"
PGDATABASE="benchmark"

PGBIN="/usr/lib/postgresql/9.5/bin"

export PATH=$PGBIN:$PATH

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
#declare -a json_rows=(10000000)
declare -a json_rows=(15000)

declare -a pg_size_time
declare -a pg_copy_time
declare -a pg_inserts_time
declare -a pg_select_time

################################################################################
# main function
################################################################################

pg_version=$(pg_version "${PGHOST}"          \
                        "${PGPORT}"          \
                        "${PGDATABASE}"      \
                        "${PGUSER}"          \
                        "${PGPASSWORD}"
            )

process_log "PostgreSQL Version $pg_version"

for (( indx=0 ; indx < ${#json_rows[@]} ; indx++ ))
do

	pg_select_time[${indx}]=$(pg_select_benchmark "${PGHOST}"     \
                                                 "${PGPORT}"     \
                                                 "${PGDATABASE}" \
                                                 "${PGUSER}"     \
                                                 "${PGPASSWORD}" \
                                                 "${COLLECTION_NAME}"
                            )

	#calculating PostgreSQL collection size.
	pg_size_time[${indx}]=$(pg_relation_size "${PGHOST}"     \
                                            "${PGPORT}"     \
                                            "${PGDATABASE}" \
                                            "${PGUSER}"     \
                                            "${PGPASSWORD}" \
                                            "${COLLECTION_NAME}"
                          )

done

print_result "number of rows"     "${json_rows[@]}"
#
# De (ns) "Nanosegundos" para (milissegundos) basta dividir 1000000
#
print_result "PG SELECT (ns)"     "${pg_select_time[@]}"
print_result "PG SIZE (bytes)"    "${pg_size_time[@]}"
