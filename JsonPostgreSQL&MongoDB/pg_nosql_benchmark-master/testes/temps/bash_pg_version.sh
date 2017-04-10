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

################################################################################
# source library files
################################################################################
source ${DIRECTORY}/lib/pg_func_lib.sh

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
