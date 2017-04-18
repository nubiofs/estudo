#!/bin/bash

# Parametros de entrada do script:
# 1 - caminho para o arquivo a ser dividido
# 2 - quantidade de arquivos gerados (gridSize)
# 3 - identificador para diferenciar os arquivos
split --lines=$(wc -l $1 | awk '{ print int($1/'$2')+1 }') $1 $3
