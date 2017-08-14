#!/bin/bash

#201708150000100001
entrada=$1

data=${entrada:0:8}

echo "data: " $data

serventia=${entrada:8:5}

echo "serventia: " $serventia

sequencial=${entrada:13:18}

echo "sequencial: " $sequencial
