#/bin/bash

#################################################################################
# Copyright (c) 2013-2014, EnterpriseDB Corporation
# 
# Redistribution and use in source and binary forms, with or without modification,
# are permitted provided that the following conditions are met:
#
# 1. Redistributions of source code must retain the above copyright notice, this
# list of conditions and the following disclaimer.
#
# 2. Redistributions in binary form must reproduce the above copyright notice,
# this list of conditions and the following disclaimer in the documentation and/or
# other materials provided with the distribution.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
# ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
# (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
# ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
# SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#
#===============================================================================
#title           : pg_nosql_benchmark.
#description     : This script will help in benchmarking PostgreSQL (JSONB) and
#                : MongoDB (BSON).
#author          : Vibhor Kumar (vibhor.aim@gmail.com).
#date            : July 17, 2014
#version         : 2.0.1
#usage           : bash pg_nosql_benchmark
#notes           : Install Vim and Emacs to use this script.
#bash_version    : GNU bash, version 4.1.2(1)-release (x86_64-redhat-linux-gnu)
#===============================================================================

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
# set mongo variables.
################################################################################
MONGO="/usr/bin/mongo"
MONGOIMPORT="/usr/bin/mongoimport"
MONGOHOST="127.0.0.1"
MONGOPORT="27017"
MONGOUSER="mongo"
MONGOPASSWORD="mongo"
MONGODBNAME="benchmark"

################################################################################
# source library files
################################################################################
source ${DIRECTORY}/lib/pg_func_lib.sh
source ${DIRECTORY}/lib/mongo_func_lib.sh

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
#declare -a json_rows=(15000)
declare -a json_rows=(5)

declare -a pg_size_time
declare -a pg_copy_time
declare -a pg_inserts_time
declare -a pg_select_time

# mongo specific arrays
declare -a mongo_size_time
declare -a mongo_copy_time
declare -a mongo_inserts_time
declare -a mongo_select_time

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

mongodb_version=$(mongo_version "${MONGOHOST}"     \
                                "${MONGOPORT}"     \
                                "${MONGODBNAME}"   \
                                "${MONGOUSER}"     \
                                "${MONGOPASSWORD}"
                  )
                  
process_log "MongoDB Version $mongodb_version"                  

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

