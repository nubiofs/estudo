#/bin/bash

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

echo 'DIRECTORY: ' $DIRECTORY 
#echo 'BASENAME: ' $BASENAME

source ${DIRECTORY}/bash.sh

echo 'BASENAME: ' $BASENAME
