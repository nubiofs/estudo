#!/bin/bash

SHELL=/bin/bash

#########################################################
## Setando as Variáveis de Ambiente (ver "README.txt") ##
## Configurações para Processamento de Lotes RTD ##
#########################################################

# Configuração do diretorio raiz para execução do script de validação de lotes RTD
export diretorio_raiz=$(PWD)

# Diretorio HOME do projeto SINTER
export SINTER=$(diretorio_raiz)/src/test/resources/massa-dados/maquinas-sinter

# Diretorio de Entrada de Lotes RTD (*.zip) vindos da Central RTD
# "após carga on-line dos mesmos no Serpro SINTER, pelo QWARE/CONTROL-M."
export ENTRADA_LOTES_RTD=$(SINTER)/qware/centralRTD/inbox/lotes

# Diretorio de Saída para os arquivos de recebimento de Lotes validados
# "destino dos arquivos *-REC.json após CORRETA VALIDAÇÃO da formatação dos Lotes"
export SAIDA_RECEBIMENTO_LOTES_RTD_VALIDADOS=$(SINTER)/qware/centralRTD/outbox/lotes/validados

# Diretorio de Saída para os arquivos de recebimento de Lotes rejeitados
# "destino dos arquivos *-REC.json após INCORRETA VALIDAÇÃO da formatação"
export SAIDA_RECEBIMENTO_LOTES_RTD_REJEITADOS=$(SINTER)/qware/centralRTD/outbox/lotes/rejeitados

# Diretorio de Saída para os arquivos de relatório de Lotes / Extratos RTD processados
# "destino dos arquivos *-REL.json após processamento dos Lotes/Extratos pelo Spring-batch"
export SAIDA_RELATORIO_LOTES_EXTRATOS_RTD_PROCESSADOS=$(SAIDA_RECEBIMENTO_LOTES_RTD_VALIDADOS)/processados

# Diretorios de armazenamento permanente "STaaS" para os arquivos de Lotes/Extratos RTD recebidos, validados, rejeitados e processados
# "destino dos arquivos (*.zip, *-REC.json e *-REL.json) após VALIDAÇÃO do lote e PROCESSAMENTO de seus extratos"
export PERMANENTE_LOTES_RTD=$(SINTER)/STaaS/centralRTD/lotes
export PERMANENTE_LOTES_RTD_VALIDADOS=$(PERMANENTE_LOTES_RTD)/validados
export PERMANENTE_LOTES_RTD_REJEITADOS=$(PERMANENTE_LOTES_RTD)/rejeitados
export PERMANENTE_LOTES_EXTRATOS_RTD_PROCESSADOS=$(PERMANENTE_LOTES_RTD_VALIDADOS)/processados

#Criação do deploy
build: clean

	mkdir build
	cp ./src/main/script/validar_loteRTD.sh build/
	cp ./README.txt build/

#Uso: make test lote=[arquivo_lote.zip]
test:

	./src/main/script/validar_loteRTD.sh ${lote}

#Uso: make test-all
test-all:

	make test lote=20170809000010001.zip
	make test lote=20170809000010002.tar
	make test lote=20170230000010003.zip
	make test lote=201702270001a0004.zip
	make test lote=2017072700003001b.zip
	make test lote=20170809000010005.zip

clean:
	
	rm -rf ./build