#!/bin/sh
export MY_PROJECT=testes/
rm -rf /var/www/html/$MY_PROJECT
cp -R $MY_PROJECT /var/www/html/
