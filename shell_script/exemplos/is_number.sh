#!/bin/bash

#função que retorna a quantidade de digitos de uma string
#awk -F '[0-9]' '{print NF-1}' <<< "$num"

exp_reg='^[0-9]+$'
if ! [[ $1 =~ $exp_reg ]] ; then
	echo "error: ($1) Not a number!" >&2; exit 1
else
	echo "($1) is a number!" >&2; exit 0
fi
