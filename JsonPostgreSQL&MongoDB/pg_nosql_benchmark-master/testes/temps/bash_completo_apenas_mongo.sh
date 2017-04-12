#/bin/bash

################################################################################
# set require variables.
################################################################################
DIRECTORY=$(dirname $0)
BASENAME=$(basename $0)

COLLECTION_NAME="json_tables"
SAMPLEJSON="sample_json_rows=(10000000).json"

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

#MONGO_INSERTS="sample_mongo_inserts.json"

################################################################################
# source library files
################################################################################
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
declare -a json_rows=(10000000)
#declare -a json_rows=(15000)
#declare -a json_rows=(5)

# mongo specific arrays
declare -a mongo_size_time
declare -a mongo_copy_time
#declare -a mongo_inserts_time
declare -a mongo_select_time

################################################################################
# main function
################################################################################

mongodb_version=$(mongo_version "${MONGOHOST}"     \
                                "${MONGOPORT}"     \
                                "${MONGODBNAME}"   \
                                "${MONGOUSER}"     \
                                "${MONGOPASSWORD}"
                  )
                  
process_log "MongoDB Version $mongodb_version"                  

for (( indx=0 ; indx < ${#json_rows[@]} ; indx++ ))
do

	#mongo_json_insert_maker "${COLLECTION_NAME}" "${json_rows[${indx}]}" "${MONGO_INSERTS}"
	
	drop_mongocollection "${MONGOHOST}"     \
                        "${MONGOPORT}"     \
                        "${MONGODBNAME}"   \
                        "${MONGOUSER}"     \
                        "${MONGOPASSWORD}" \
                        "${COLLECTION_NAME}"

	mongo_copy_time[${indx}]=$(mongodb_import_benchmark "${MONGOHOST}"       \
                                                       "${MONGOPORT}"       \
                                                       "${MONGODBNAME}"     \
                                                       "${MONGOUSER}"       \
                                                       "${MONGOPASSWORD}"   \
                                                       "${COLLECTION_NAME}" \
                                                       "${SAMPLEJSON}"
                              )

	mongodb_create_index "${MONGOHOST}"     \
                        "${MONGOPORT}"     \
                        "${MONGODBNAME}"   \
                        "${MONGOUSER}"     \
                        "${MONGOPASSWORD}" \
                        "${COLLECTION_NAME}"

	mongo_select_time[${indx}]=$(mongodb_select_benchmark "${MONGOHOST}"     \
                                                         "${MONGOPORT}"     \
                                                         "${MONGODBNAME}"   \
                                                         "${MONGOUSER}"     \
                                                         "${MONGOPASSWORD}" \
                                                         "${COLLECTION_NAME}"
                                )

	mongo_size_time[${indx}]=$(mongo_collection_size "${MONGOHOST}"     \
                                                    "${MONGOPORT}"     \
                                                    "${MONGODBNAME}"   \
                                                    "${MONGOUSER}"     \
                                                    "${MONGOPASSWORD}" \
                                                    "${COLLECTION_NAME}"
                             )

	#mongo_inserts_time[${indx}]=$(mongodb_inserts_benchmark "${MONGOHOST}" "${MONGOPORT}" "${MONGODBNAME}" "${MONGOUSER}" "${MONGOPASSWORD}" "${COLLECTION_NAME}" "${MONGO_INSERTS}")

done

print_result "number of rows"     "${json_rows[@]}"
#
# De (ns) "Nanosegundos" para (milissegundos) basta dividir 1000000
#
print_result "MONGO IMPORT (ns)"  "${mongo_copy_time[@]}"
#print_result "MONGO INSERT (ns)"  "${mongo_inserts_time[@]}"
print_result "MONGO SELECT (ns)"  "${mongo_select_time[@]}"
print_result "MONGO SIZE (bytes)" "${mongo_size_time[@]}"

#rm -rf ${SAMPLEJSON}*
#rm -rf ${MONGO_INSERTS}


