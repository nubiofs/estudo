#!/bin/bash

#VER ESSES:
#https://gist.github.com/rroemhild/190970
#https://github.com/jmorenoamor/ksh-logger/blob/master/logger.ksh
#https://github.com/fredpalmer/log4bash
#https://github.com/nubiofs/b-log
#https://github.com/posva/task-logger.sh
#https://github.com/a2o/snoopy

#Imprimindo log para arquivo
#logger ver
#--> tail -n 1 /var/log/syslog

#Imprimindo log para tela
#logger -s "$1"


##
## Simple logging mechanism for Bash
##
## Author: Michael Wayne Goodman <goodman.m.w@gmail.com>
## Thanks: Jul for the idea to add a datestring. See:
## http://www.goodmami.org/2011/07/simple-logging-in-bash-scripts/#comment-5854
## Thanks: @gffhcks for noting that inf() and debug() should be swapped,
##         and that critical() used $2 instead of $1
##
## License: Public domain; do as you wish
##

exec 3>&2 # logging stream (file descriptor 3) defaults to STDERR
verbosity=3 # default to show warnings
silent_lvl=0
crt_lvl=1
err_lvl=2
wrn_lvl=3
inf_lvl=4
dbg_lvl=5

notify() { log $silent_lvl "NOTE: $1"; } # Always prints
critical() { log $crt_lvl "CRITICAL: $1"; }
error() { log $err_lvl "ERROR: $1"; }
warn() { log $wrn_lvl "WARNING: $1"; }
inf() { log $inf_lvl "INFO: $1"; } # "info" is already a command
debug() { log $dbg_lvl "DEBUG: $1"; }
log() {
    if [ $verbosity -ge $1 ]; then
        datestring=`date +'%Y-%m-%d %H:%M:%S'`
        # Expand escaped characters, wrap at 70 chars, indent wrapped lines
        echo -e "$datestring $2" | fold -w70 -s | sed '2~1s/^/  /' >&3
    fi
}

log 3

##########
### EXAMPLE COMMAND LINE ARGUMENTS ###

usage() {
    echo "Usage:"
    echo "  $0 [OPTIONS]"
    echo "Options:"
    echo "  -h      : display this help message"
    echo "  -q      : decrease verbosity level (can be repeated: -qq, -qqq)"
    echo "  -v      : increase verbosity level (can be repeated: -vv, -vvv)"
    echo "  -l FILE : redirect logging to FILE instead of STDERR"
}

while getopts "hqvl:" opt; do
    case "$opt" in
       h) usage; exit 0 ;;
       q) (( verbosity = verbosity - 1 )) ;;
       v) (( verbosity = verbosity + 1 )) ;;
       l) exec 3>>$OPTARG ;;
       *) error "Invalid options: $1"; usage; exit 1 ;;
    esac
done
shift $((OPTIND-1))
args="$@"

notify "This logging system uses the standard verbosity level mechanism to choose which messages to print. Command line arguments customize this value, as well as where logging messages should be directed (from the default of STDERR). Long messages will be split at spaces to wrap at a character limit, and wrapped lines are indented. Wrapping and indenting can be modified in the code."

inf "Inspecting argument list: $args"

if [ ! "$args" ]; then
    warn "No arguments given"
else
    for arg in $args; do

        debug "$arg"
    done
fi


