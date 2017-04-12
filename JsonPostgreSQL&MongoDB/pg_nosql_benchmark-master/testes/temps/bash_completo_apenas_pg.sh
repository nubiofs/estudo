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
SAMPLEJSON="sample_json_rows=(10000000).json"
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
#declare -a json_rows=(5)

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

	#creating json data.
	generate_json_rows "${json_rows[${indx}]}" \
                      "${SAMPLEJSON}"
   
	#droping database benchmark if exists.
	remove_pg_db "${PGHOST}"     \
                "${PGPORT}"     \
                "${PGDATABASE}" \
                "${PGUSER}"     \
                "${PGPASSWORD}"
	#creating database benchmark.
	create_pg_db "${PGHOST}"     \
                "${PGPORT}"     \
                "${PGDATABASE}" \
                "${PGUSER}"     \
                "${PGPASSWORD}"

	#creating json_tables collection in postgreSQL.
	mk_pg_json_collection "${PGHOST}"     \
                         "${PGPORT}"     \
                         "${PGDATABASE}" \
                         "${PGUSER}"     \
                         "${PGPASSWORD}" \
                         "${COLLECTION_NAME}"

	#loading data in postgresql using sample.json.
	pg_copy_time[${indx}]=$(pg_copy_benchmark  "${PGHOST}"          \
                                              "${PGPORT}"          \
                                              "${PGDATABASE}"      \
                                              "${PGUSER}"          \
                                              "${PGPASSWORD}"      \
                                              "${COLLECTION_NAME}" \
                                              "${SAMPLEJSON}"
                          )

	#creating index on postgreSQL collections.
	pg_create_index_collection "${PGHOST}"     \
                              "${PGPORT}"     \
                              "${PGDATABASE}" \
                              "${PGUSER}"     \
                              "${PGPASSWORD}" \
                              "${COLLECTION_NAME}"
                              
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

	#preparing postgresql INSERTs.
	pg_json_insert_maker "${COLLECTION_NAME}"    \
                        "${json_rows[${indx}]}" \
                        "${PG_INSERTS}"

	#droping json object in postgresql.
	delete_json_data "${PGHOST}"      \
                    "${PGPORT}"      \
                    "${PGDATABASE}"  \
                    "${PGUSER}"      \
                    "${PGPASSWORD}"  \
                    "${COLLECTION_NAME}"

	#inserting data in postgresql using sample_pg_inserts.json.
	pg_inserts_time[${indx}]=$(pg_inserts_benchmark  "${PGHOST}"          \
                                                    "${PGPORT}"          \
                                                    "${PGDATABASE}"      \
                                                    "${PGUSER}"          \
                                                    "${PGPASSWORD}"      \
                                                    "${COLLECTION_NAME}" \
                                                    "${PG_INSERTS}"
                              )

done

print_result "number of rows"     "${json_rows[@]}"
#
# De (ns) "Nanosegundos" para (milissegundos) basta dividir 1000000
#
print_result "PG COPY (ns)"       "${pg_copy_time[@]}"
print_result "PG SELECT (ns)"     "${pg_select_time[@]}"
print_result "PG INSERT (ns)"     "${pg_inserts_time[@]}"
print_result "PG SIZE (bytes)"    "${pg_size_time[@]}"

#rm -rf ${SAMPLEJSON}*
#rm -rf ${PG_INSERTS}

