# 2) Crie duas bases de dados aleatórias. 
# A primeira composta dos elementos de uma Distribuição Uniforme composta por 
# 70 elementos entre os valores 5 e 10.
# A segunda composta dos elementos de uma Distribuição Normal de média 7,00 e 
# desvio padrão 1,50 composta por 70 elementos.
base_aleatoria_1 = runif(70, 5, 10)
(base_aleatoria_1)
base_aleatoria_2 = rnorm(70, 7, 1.5)
(base_aleatoria_2)

# 2.a) Calculo das Médias:
media_base1 = mean(base_aleatoria_1)
(media_base1)
media_base2 = mean(base_aleatoria_2)
(media_base2)

# 2.b) Variância
(var(base_aleatoria_1))
(var(base_aleatoria_2))

# 2.c) Desvio padrão
desvio_padrao_base1 = sd(base_aleatoria_1)
(desvio_padrao_base1)
desvio_padrao_base2 = sd(base_aleatoria_2)
(desvio_padrao_base2)

# 2.d) Mediana
(median(base_aleatoria_1))
(median(base_aleatoria_2))

# 2.e) Quartis
(quantile(base_aleatoria_1))
(quantile(base_aleatoria_2))

# 2.f) Coeficiente de Dispersão
coeficiente_dispersao_base1 = (desvio_padrao_base1/media_base1) * 100
(coeficiente_dispersao_base1)
coeficiente_dispersao_base2 = (desvio_padrao_base2/media_base2) * 100
(coeficiente_dispersao_base2)

# 2.g) Coeficiente de Correlação entre as duas bases 
# (interprete, com um comentário simples, o resultado encontrado)
funcao_interpretacao_proporcionalidade = function(correlacao) {
  
  if(correlacao == 0) {
    return("Bases/Parâmetros sem correção.")
  } else if (correlacao >= 0) {
    return("Associação positiva. As bases/parâmetros são diretamente proporcionais.")
  } else {
    return("Associação negativa. As bases/parâmetros são inversamente proporcionais.")
  }
  
}
#
funcao_interpretacao_correlacao = function(coeficiente){
  
    if (coeficiente >= 0.00 && coeficiente <= 0.19) {
      return("Uma correlação bem fraca.")
    } else if (coeficiente >= 0.20 && coeficiente <= 0.39) {
      return("Uma correlação fraca.")
    } else if (coeficiente >= 0.40 && coeficiente <= 0.69) {
      return("Uma correlação moderada.")
    } else if (coeficiente >= 0.70 && coeficiente <= 0.89) {
      return("Uma correlação forte.")
    } else if (coeficiente >= 0.90 && coeficiente <= 1.00) {
      return("Uma correlação muito forte.")
    }      

}
#Cálculo da correlação e apresentação proporcionalidade:
coeficiente_correlacao_bases = cor(base_aleatoria_1, base_aleatoria_2, use = "na.or.complete")
(coeficiente_correlacao_bases)
#Interpretacao da proporcionalidade:
funcao_interpretacao_proporcionalidade(coeficiente_correlacao_bases)
#Interpretacao da correlação:
suppressWarnings(print(funcao_interpretacao_correlacao(abs(coeficiente_correlacao_bases))))

#03) Para o dataset "avocado.csv -> Dados históricos sobre preços de abacate 
#e volume de vendas em vários mercados dos EUA", faça o que se pede:
avocado_prices = read.csv(file = "avocado.csv", header = TRUE, sep = ",")
head(avocado_prices)

# 3.a) Obtenha os parâmetros estatísticos da base com a função summary.
summary(avocado_prices)
dim(avocado_prices)

# 3.b) Salve cada coluna da base de dados em uma variável distinta.
colnames(avocado_prices)
x = avocado_prices$X
date = avocado_prices$Date
averagePrice = avocado_prices$AveragePrice
totalVolume = avocado_prices$Total.Volume
x4046 = avocado_prices$X4046
x4225 = avocado_prices$X4225
x4770 = avocado_prices$X4770
totalBags = avocado_prices$Total.Bags
smallBags = avocado_prices$Small.Bags
largeBags = avocado_prices$Large.Bags
xLargeBags = avocado_prices$XLarge.Bags
type = avocado_prices$type
year = avocado_prices$year
region = avocado_prices$region

#3.c) Concatene e exporte os parâmetros type, year e region para um arquivo nomeado
#“abacate.xlsx” (a ser criado pelo usuário)
abacate_df = data.frame(Type = type, Year = year, Region = region)
write.xlsx(abacate_df, "abacate.xlsx")

#3.d) Plote um gráfico de pontos dos parâmetros de total.bags (eixo X) por year (eixo Y).
plot(x = totalBags, y = year, type = "p", 
     xlim = c(min(totalBags), max(totalBags)), 
     ylim = c(min(year), max(year)), 
     main = "Gráfico de Pontos", 
     xlab = "Total Bags", ylab = "Year", col="blue")

#3.e) Plote um gráfico de barras para o parâmetro Averageprice.
qtd_averagePrice = tapply(rep(1,18249), averagePrice, sum)
barplot(qtd_averagePrice, xlab = "Average Price", ylab = "Frequência")

#3.f) Plote um gráfico de pizza para o parâmetro year.
qtd_year = tapply(rep(1,18249), year, sum)
pie(qtd_year)

#3.g) Plote histogramas distintos para os parâmetros Averageprice e year.
hist(averagePrice, 10, main = "Histograma de Average Price", 
     xlab = "Average Price", ylab = "Frequência")
hist(year, 10, main = "Histograma de Year", 
     xlab = "Year", ylab = "Frequência", freq = T)

#3.h) Calcule a correlação entre os parâmetros Averageprice e year; 
#Total.volume e Total.bags; e
#Total.bags e year. Interprete cada resultado com um breve comentário
correlacao_averageprice_year = cor(averagePrice, year, use = "na.or.complete")
(correlacao_averageprice_year)
funcao_interpretacao_proporcionalidade(correlacao_averageprice_year)
suppressWarnings(print(funcao_interpretacao_correlacao(abs(correlacao_averageprice_year))))
#
correlacao_totalVolume_totalBags = cor(totalVolume, totalBags, use = "na.or.complete")
(correlacao_totalVolume_totalBags)
funcao_interpretacao_proporcionalidade(correlacao_totalVolume_totalBags)
suppressWarnings(print(funcao_interpretacao_correlacao(abs(correlacao_totalVolume_totalBags))))
#
correlacao_totalBags_year = cor(totalBags, year, use = "na.or.complete")
(correlacao_totalBags_year)
funcao_interpretacao_proporcionalidade(correlacao_totalBags_year)
suppressWarnings(print(funcao_interpretacao_correlacao(abs(correlacao_totalBags_year))))

#4) Considere as seguintes matrizes e faça o que se pede.
matrix_a = matrix(c(1,4,0,-6,-2,6,4,3,-3,4,0,1,2,-1,6,-5), ncol = 4, nrow = 4, byrow = TRUE) 
View(matrix_a)
matrix_b = matrix(c(5,-4,-1,5,1,3,0,1,0,-3,5,-2,8,-4,3,2), ncol = 4, nrow = 4, byrow = TRUE) 
View(matrix_b) 
#4.a) C = (AB)T Multiplicação Matricial, seguido de transposição
AB = matrix_a %*% matrix_b
C = t(AB)
#4.b) d = det(A + 2B)
d = det(matrix_a + (2 * matrix_b))
#4.c) e = (A2 − 5B)34 Elemento da terceira linha e quarta coluna
e = ((matrix_a %*% matrix_a) - (5 * matrix_b))[3, 4]

#5) Implemente uma função em R que calcule a soma dos 100 primeiros termos 
#de f(x) = ex. A função é expressa na seguinte forma. 
#Verifique sua função para x = −4 e x = 6.
funcao_soma_100_termos = function(x) {
  
  soma = 0
  
  for(i in 0:99) {
  #for(i in 0:1) {
  #for(i in 0:2) {
    soma = soma + (((x) ^ i) / (factorial(i)))
  }
  
  return(soma)
    
} 
funcao_soma_100_termos(-4)
funcao_soma_100_termos(6)


  
  



#parei (Ferramentas em IA - Aula_17_11.pdf) página 50

#########################################################
#########################################################
### teste +

#head(type)
#class(type)
#unique(type)

#library("rJava")
#library("xlsxjars")
#library("xlsx")


# tryCatch({
#   library("ggplot2")  
# }, error = function(e) {
#   print(e)
#   install.packages("ggplot2")
#   library("ggplot2")
# })

#install.packages(c("rJava", "xlsxjars", "xlsx"), dependencies = "TRUE")
#library("xlsx")

#Pre-condição:
# tryCatch({
#   library("memisc")  
# }, error = function(e) {
#   print(e)
#   install.packages("memisc")
#   library("memisc")
# })



# Ou via, exemplo extra:
# funcao_media = function(base_aleatoria) {
#   
#   soma = lapply(list(base_aleatoria), sum)
#   media = as.numeric(soma) / length(base_aleatoria)
#   
#   if (media ==  mean(base_aleatoria)) {#Se é igual ao resultado de 'mean'
#     
#     return(media)
#     
#   }
#   else {
#     
#     return("Error!")
#     
#   }
#   
# }
# (funcao_media(base_aleatoria_1))
# (funcao_media(base_aleatoria_2))



#
# hist(base_aleatoria_2, 5, main = "Histograma da base aleatória 2, separado por faixas de 5", 
#      xlab = "Valores até 70", ylab = "Frequência")

#library("ggplot2")


# sum(seq(1:5))
# 
# hist(pnorm(1.96, 0, 1), 5, main = "Histograma da base aleatória 2, separado por faixas de 5", 
#      xlab = "Valores até 70", ylab = "Frequência")
# 
# dados = qnorm(seq(1:5), 7.5, 1)
# hist(dados, 5, main = "Histograma da base aleatória 2, separado por faixas de 5", 
#      xlab = "Valores até 70", ylab = "Frequência", xlim = c(1, 5))
# 
# pnorm(84, mean=72, sd=15.2, lower.tail=FALSE) 

# https://www.r-bloggers.com/normal-distribution-functions/
# http://www.r-tutor.com/elementary-statistics/probability-distributions/normal-distribution
# http://www.portalaction.com.br/probabilidades/62-distribuicao-normal

#===== calculo manual da variancia

#vetorx = c(1.00, 2.00, 3.00, 4.00, 5.00, 6.00, 7.00)
# vetorx = base_aleatoria_1
# 
# sub_media_2 = function(x) {
#     
#   y = (x - as.numeric(mean(vetorx)))
#   return(y ^ 2) 
#   
# }
# 
# soma_total = 0
# 
# for(x in vetorx) {
#   print(x)
#   soma_total = soma_total + sub_media_2(x)
# }
# 
# (soma_total/length(vetorx))

### teste - 
#########################################################



