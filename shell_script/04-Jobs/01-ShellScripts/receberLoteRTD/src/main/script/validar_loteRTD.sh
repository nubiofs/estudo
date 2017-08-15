#!/bin/bash

#################################################################################
#################################################################################
#Título			: validar_loteRTD
#Descrição		: Inicializar a validação e processamento de Lote RTD
#Autor			: Serpro
#Data			: 11/08/2017
#Versão			: 1.0.0
#Uso			: ./validar_loteRTD.sh [arquivo_lote.zip]
#Obsevação      : A entrada [arquivo_lote.zip] deve estar presente em 
#
#|---maquinas-sinter
#   |-----qware
#   |-------centralRTD
#   |---------inbox
#   |-----------lotes
#   |---------outbox
#   |-----------lotes
#   |-------------rejeitados
#   |-------------validados
#   |---------------processados
#   |-----STaaS
#   |-------centralRTD
#   |---------lotes
#   |-----------rejeitados
#   |-------------20170801
#   |-----------validados
#   |-------------20170810
#   |-------------processados
#   |---------------20170815
#
# # Conforme "Configuração das Variáveis de Ambientes" em README.txt:
# $ echo $ENTRADA_LOTES_RTD
#
#bash_version	: GNU bash, versão 4.3.48(1)-release (x86_64-pc-linux-gnu)
#===============================================================================
#===============================================================================

################################################################################
# set variáveis requeridas
################################################################################

# quit on any error
set -e

# verify any  undefined shell variables
set -u

# Modo strict
set -o pipefail

################################################################################
# Declaração Globais
################################################################################

BASENAME=$(basename $0)

#$ ./validar_loteRTD.sh [arquivo_lote.zip]
lote_zip=$1
nomeclatura_lote=$(basename "$lote_zip" ".zip")
lote_lot=$nomeclatura_lote.lot
saida_recebimento_validado=$SAIDA_RECEBIMENTO_LOTES_RTD_VALIDADOS/$nomeclatura_lote'-REC.json'

tempo_inicial=""
data_validacao=`date +%Y-%m-%d`

function log(){
    echo "[PID:$$ ${BASENAME} $(date +'%m-%d-%y %H:%M:%S')]: $*" >&2
}

function log_inicio(){
    echo " "
    echo "################################ INICIO ################################"
    log "Realizando validações Lote RTD $lote_zip"
    tempo_inicial=$(get_timestamp_nano)
    #echo $tempo_inicial
}

###########################
# timestamp em nanosegundos
#
function get_timestamp_nano ()
{
    echo $(date +"%F %T.%N")
}

###############################
# get diferença em nanosegundos
#
function get_timestamp_diff_nano ()
{
     typeset -r F_TIMESTAMP1="$1"
     typeset -r F_TIMESTAMP2="$2"
     local SECONDS_DIFF
     local NANOSECONDS_DIFF
     local SECONDS_NANO

     SECONDS_DIFF=$(echo $(date -d "${F_TIMESTAMP1}" +%s) \
                      -  $(date -d "${F_TIMESTAMP2}" +%s)|bc)
     NANOSECONDS_DIFF=$(echo $(date -d "${F_TIMESTAMP1}" +%N) \
                          -  $(date -d "${F_TIMESTAMP2}" +%N)|bc)
     SECONDS_NANO=$(echo ${SECONDS_DIFF} \* 1000000000|bc)
     printf "%d\n" $(((${SECONDS_NANO}  + ${NANOSECONDS_DIFF})))

}

function log_fim(){
    
    local tempo_total="$(get_timestamp_diff_nano "$(get_timestamp_nano)" "$tempo_inicial")"
    local tempo="$tempo_total ns|"
    tempo="$tempo $(echo $tempo_total / 1000000 | bc) ms|"
    tempo="$tempo $(echo $tempo_total / 1000000000 | bc) s"

    log "Validações Lote RTD finalizada em $tempo"
    echo "################################# FIM ##################################"
    echo " "

}

function log_erro_sair(){
    log "ERRO: $*"
    log_fim
    exit 1
}

################################################################################
# Declaração de Funções de Validações do Lote RTD
################################################################################

function verificar_nomeclatura_lote(){

    local lote=$1
    local data=${lote:0:8}
    local valida=$(date "+%Y%m%d" -d $data)
    if [[ ! $valida == "$data" ]]
    then
        log_nomenclatura_errada "Data Inválida"
    fi

    local exp_reg='^[0-9]+$'
    local serventia=${lote:8:5}
    if ! [[ $serventia =~ $exp_reg ]]
    then
        log_nomenclatura_errada "Número de Serventia Inválido"
    fi

    local sequencial=${lote:13:4}
    if ! [[ $sequencial =~ $exp_reg ]]
    then
        log_nomenclatura_errada "Número Sequencial Inválido"
    fi

}

function log_nomenclatura_errada(){

    local motivo_rejeicao=$1

    log_erro_sair "Nomenclatura fora do padrão YYYYMMDDSSSSSNNNN"

    #TODO colocar no arquivo recebimento (YYYYMMDDSSSSSNNNN-REC.txt)
    #echo $motivo_rejeicao >  YYYYMMDDSSSSSNNNN-REC.txt

}

##############################################
#Verifica se arquivo de lote já foi recebido e 
#analisado (se o mesmo se encontra no STaaS)
#
function verificar_arquivo_ja_existente(){

    local arquivo=$1
    local extensao=$2
    local nome=$(basename "$arquivo" ".$extensao")

    local retorno=$(find $PERMANENTE_LOTES_RTD -type f -name "$nome.*")
    
    if [[ $retorno == *"$nome"* ]]
    then
        #TODO gerar arquivo recebimento
        log_erro_sair "Arquivo de lote já existe no sistema"
    fi

}

#######################################################
#Processa as seguintes validações no arquivo lote .zip:
#
#1) Tem extensão .zip
#2) É do tipo ZIP
#3) Não é vazio
#4) Foi descompatado sem problemas
#5) Contem os arquivos .lot e .pk7s 
#6) O arquivo .lot é do tipo Text
#7) O arquivo .pk7s é do tipo ???
#
function validar_lote(){

    #Com extensão .zip
    if [ ! "$(cut -d'.' -f2 <<< $1)" == "zip" ]
    then
        log_erro_sair "Informar arquivo de Lote RTD com extensão '.zip'"
    fi

    verificar_arquivo_tipo $1 "Zip archive data"

    # verificar_arquivo_vazio $ENTRADA_LOTES_RTD/$1
    # if [ $? -eq 1 ]
    # then
    #     gerar_arquivo_recebimento $1 ' é um arquivo vazio'
    # fi

    # log "Copiar $1 para $SINTER_RTD_LOTES"
    # cp $ENTRADA_LOTES_RTD/$1 $SINTER_RTD_LOTES

    # log "Descompactar $SINTER_RTD_LOTES/$lote_zip"
    # #unzip -ot $SINTER_RTD_LOTES/$lote_zip
    # unzip -o $SINTER_RTD_LOTES/$lote_zip -d $SINTER_RTD_LOTES

    # if [ ! $? -eq 0 ]
    # then
    #     rm -rf $SINTER_RTD_LOTES/$lote_zip
    #     gerar_arquivo_recebimento $lote_zip ' arquivo apresentou erro na descompactação.'
    # fi

}

function verificar_arquivo_tipo(){

    local arquivo=$1
    local tipo=$2

    log "Verificando se o $arquivo é do tipo ($tipo)"
    local tipo_arquivo=$(file $ENTRADA_LOTES_RTD/$arquivo)
    if [[ ! $tipo_arquivo == *"$tipo"* ]]
    then
        mensagem_erro="Arquivo de Lote RTD ($arquivo) não é do tipo ($tipo)"
        rec=$(gerar_arquivo_recebimento "SAIDA_REJEITADO" $arquivo $mensagem_erro)
        destino=$PERMANENTE_LOTES_RTD_REJEITADOS/${arquivo:0:8}
        mkdir $destino
        log "Copiando $arquivo para $destino"
        cp -rf $ENTRADA_LOTES_RTD/$arquivo $destino
        log_erro_sair $mensagem_erro
    fi

}

###################################################
#Processa erro na identifcação de lote do tipo TXT.
#Se arquivo do tipo TXT copia E descompacta o mesmo
#
function verificar_arquivo_lot(){

    verificar_arquivo_vazio $SINTER_RTD_LOTES/$lote_lot
    if [ $? -eq 1 ]
    then
        mover_arquivos_lotes $nomeclatura_lote.* $RELATORIOS_LOTES_RTD_REJEITADOS
        gerar_arquivo_recebimento $lote_lot ' é um arquivo vazio'
    fi

    log "Verificando se $lote_lot é do tipo (UTF-8 Unicode text)"
    local tipo_arquivo=$(file $SINTER_RTD_LOTES/$lote_lot)
    if [[ ! $tipo_arquivo == *"UTF-8 Unicode text"* ]]
    then
        mover_arquivos_lotes $nomeclatura_lote.* $RELATORIOS_LOTES_RTD_REJEITADOS
        gerar_arquivo_recebimento $lote_lot ' não é do tipo Text'
    fi

    gerar_relatorio_ok $lote_lot ' lote validado com sucesso'
    mover_arquivos_lotes $nomeclatura_lote.* $RELATORIOS_LOTES_RTD_VALIDADOS

}

function verificar_arquivo_pk7s(){
    #TODO
    echo "TODO"
}

function verificar_arquivo_vazio(){

    log "Verificando se $1 é vazio"

    local tipo_arquivo=$(file $1)
    #echo 'tipo_arquivo: ' $tipo_arquivo

    local str=$(du -ks $1)
    #echo 'str: ' $str

    local tamanho=${str:0:1}
    #echo 'tamanho: ' $tamanho

    if [[ ($tipo_arquivo == *": empty"*) && ($tamanho == "0") ]]
    then
        return 1
    fi

    return 0

}

##################################
#Criar arquivo de recebimento que
#contem o resultado da validação
#de formatação de lotes RTD
#
function gerar_arquivo_recebimento(){

    local local_recebimento=$1
    local arquivo=$2
    local msg=$3

    local saida_recebimento=""
    local saida="{ \"idLote\" : \"$arquivo\", \"Data de Valicação\" : \"$data_validacao\", "
    #\"\"

    if [[ "$local_recebimento" == "SAIDA_REJEITADO" ]]
    then
        saida_recebimento=$SAIDA_RECEBIMENTO_LOTES_RTD_REJEITADOS/$nomeclatura_lote'-REC.json'
        saida="$saida\"Situação\" : \"Rejeitado com Inconformidade\", "
        saida="$saida\"Motivo da Rejeição\" : \"$msg\" }"
    fi

    log "Criando arquivo de recebimento $saida_recebimento"

    touch $saida_recebimento

    #echo "$arquivo $msg" > $saida_recebimento
    echo "$saida" > $saida_recebimento

    return $saida_recebimento

}

##############################
#Criar arquivo de relatório OK
#
function gerar_relatorio_ok(){

    local arquivo=$1
    local msg=$2
    local relatorio=$saida_recebimento_validado

    log "Criando arquivo de relatorio $relatorio"

    touch $relatorio
    echo $arquivo $msg > $relatorio

}

function mover_arquivos_lotes(){

    local arquivos=$1
    local dir_destino=$2

    log "Movendo arquivo(s) $arquivos para $dir_destino"
    mv $SINTER_RTD_LOTES/$arquivos $dir_destino

}

###################################
# Realiza as validações de Lote RTD 
#
function main(){

    log_inicio

    if [ ! -f "$ENTRADA_LOTES_RTD/$1" ]
    then
        #Erro que não precisa ir para o "arquivo de recebimento"
        log_erro_sair "Informar arquivo de lote existente: $ENTRADA_LOTES_RTD/$1"
    fi

    verificar_nomeclatura_lote $1

    verificar_arquivo_ja_existente $1 "zip"

    validar_lote $1

    log_fim

    exit 0

}

# Chamada a função principal
main $lote_zip