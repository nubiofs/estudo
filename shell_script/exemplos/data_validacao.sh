#!/bin/bash

#para o formato "mm/dd/aaaa"
function validar_data01(){
	
date "+%d/%m/%Y" -d $1 > /dev/null  2>&1

valido=$?

if [[ $valido -eq 0 ]]
then
	echo "A data $1 é válida"
else
	echo "A data $1 não é válida"
fi

}

#formato "aaaa/mm/dd"
function validar_data02(){
	
date "+%Y/%m/%d" -d $1 > /dev/null  2>&1

valido=$?

if [[ $valido -eq 0 ]]
then
	echo "A data $1 é válida"
else
	echo "A data $1 não é válida"
fi

}

#formato "aaaammdd"
function validar_data03(){
	
date "+%Y%m%d" -d $1 > /dev/null  2>&1

valido=$?

if [[ $valido -eq 0 ]]
then
	echo "A data $1 é válida"
else
	echo "A data $1 não é válida"
fi

}

#https://stackoverflow.com/questions/18731346/validate-date-format-in-a-shell-script
isDateInvalid()
{
    DATE="${1}"

    # Autorized separator char ['space', '/', '.', '_', '-']
    SEPAR="([ \/._-])?"

    # Date format day[01..31], month[01,03,05,07,08,10,12], year[1900..2099]
    DATE_1="((([123][0]|[012][1-9])|3[1])${SEPAR}(0[13578]|1[02])${SEPAR}(19|20)[0-9][0-9])"

    # Date format day[01..30], month[04,06,09,11], year[1900..2099]
    DATE_2="(([123][0]|[012][1-9])${SEPAR}(0[469]|11)${SEPAR}(19|20)[0-9][0-9])"

    # Date format day[01..28], month[02], year[1900..2099]
    DATE_3="(([12][0]|[01][1-9]|2[1-8])${SEPAR}02${SEPAR}(19|20)[0-9][0-9])"

    # Date format day[29], month[02], year[1904..2096]
    DATE_4="(29${SEPAR}02${SEPAR}(19|20(0[48]|[2468][048]|[13579][26])))"

    # Match the date in the Regex

    if ! [[ "${DATE}" =~ "^(${DATE_1}|${DATE_2}|${DATE_3}|${DATE_4})$" ]]
    then
        echo -e "ERROR - '${DATE}' invalid!"
    else
        echo "${DATE} is valid"
    fi
}


#validar_data01 "09/99/2013"

#validar_data01 "09/19/2013"

#validar_data01 "09/09/2013"

#validar_data01 "02/27/2013"

#validar_data01 "02/29/2013"

#validar_data02 "2013/02/27"

#validar_data02 "2013/02/29"

validar_data03 "19760920"

validar_data03 "19762001"

validar_data03 "19760229"

validar_data03 "19760230"

validar_data03 "00010203"

validar_data03 "29990219"

#isDateInvalid "27/02/2013"




