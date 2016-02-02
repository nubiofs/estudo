# estudo
Vários Projetos de Estudo. Cada projeto por pasta individual.

xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

git --version

git config --list

git config --global user.email "nubiofs@gmail.com"
git config --global user.name "nubiofs"

//Criar projetos
mkdir projeto
cd projeto
git init

//Criar arquivo no projeto
touch projeto.txt
echo "oi" >> projeto.txt

//Ver estado
git status

//Adicionar arquivo(s) no STAGE
git add .

//Criar comentario (e adicionar no HEAD)
git commit -m "Versao Incial"

//Adicionar no repositorio remoto (github)
git remote add origin https://github.com/nubiofs/bookmark.git

//Enviando alterações para o remoto (github)
git commit -am ""
git push origin master






