#!/bin/sh
#
#Build do(s) projeto(s) no servidor web apache2
#
export APACHE_PATH=/var/www/html

export MY_PROJECT=$1
echo $MY_PROJECT

if [ -z $MY_PROJECT ]; then
    echo "Entre com o nome do diretório do projeto"
    exit
elif [ $MY_PROJECT = "." ]; then
    cp $APACHE_PATH/index.html .
    rm -rf $APACHE_PATH/*
    cp -R . $APACHE_PATH/
    rm -rf index.html
    rm -rf $APACHE_PATH/build.sh
else
    rm -rf $APACHE_PATH/$MY_PROJECT
    cp -R $MY_PROJECT $APACHE_PATH/
fi
