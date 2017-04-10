#/bin/bash

################################################################################
# set require variables.
################################################################################
DIRECTORY=$(dirname $0)
BASENAME=$(basename $0)

COLLECTION_NAME="json_tables"
SAMPLEJSON="sample.json"

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
source ${DIRECTORY}/lib/mongo_func_lib.sh

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
