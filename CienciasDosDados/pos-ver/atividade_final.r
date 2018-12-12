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

# 3) Para o dataset "avocado.csv -> Dados históricos sobre preços de abacate 
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

# 3.c) Concatene e exporte os parâmetros type, year e region para um arquivo nomeado
#“abacate.xlsx” (a ser criado pelo usuário)
abacate_df = data.frame(Type = type, Year = year, Region = region)
write.xlsx(abacate_df, "abacate.xlsx")

# 3.d) Plote um gráfico de pontos dos parâmetros de total.bags (eixo X) por year (eixo Y).
plot(x = totalBags, y = year, type = "p", 
     xlim = c(min(totalBags), max(totalBags)), 
     ylim = c(min(year), max(year)), 
     main = "Gráfico de Pontos", 
     xlab = "Total Bags", ylab = "Year", col="blue")

# TODO (TITULOS E ARQ .PDF)!!!

# 3.e) Plote um gráfico de barras para o parâmetro Averageprice.
qtd_averagePrice = tapply(rep(1, length(averagePrice)), averagePrice, sum)
barplot(qtd_averagePrice, xlab = "Average Price", ylab = "Frequência")

# TODO (TITULOS E ARQ .PDF)!!!

# 3.f) Plote um gráfico de pizza para o parâmetro year.
qtd_year = tapply(rep(1, length(year)), year, sum)
pie(qtd_year)

# TODO (TITULOS E ARQ .PDF)!!!

# 3.g) Plote histogramas distintos para os parâmetros Averageprice e year.
hist(averagePrice, 10, main = "Histograma de Average Price", 
     xlab = "Average Price", ylab = "Frequência")
hist(year, 10, main = "Histograma de Year", 
     xlab = "Year", ylab = "Frequência", freq = T)

# TODO (TITULOS E ARQ .PDF)!!!

# 3.h) Calcule a correlação entre os parâmetros Averageprice e year; 
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

# 4) Considere as seguintes matrizes e faça o que se pede.
matrix_a = matrix(c(1,4,0,-6,-2,6,4,3,-3,4,0,1,2,-1,6,-5), ncol = 4, nrow = 4, byrow = TRUE) 
View(matrix_a)
matrix_b = matrix(c(5,-4,-1,5,1,3,0,1,0,-3,5,-2,8,-4,3,2), ncol = 4, nrow = 4, byrow = TRUE) 
View(matrix_b) 
# 4.a) C = (AB)T Multiplicação Matricial, seguido de transposição
AB = matrix_a %*% matrix_b
C = t(AB)
(C)
# 4.b) d = det(A + 2B)
d = det(matrix_a + (2 * matrix_b))
(d)
# 4.c) e = (A2 − 5B)34 Elemento da terceira linha e quarta coluna
e = ((matrix_a %*% matrix_a) - (5 * matrix_b))[3, 4]
(e)

# 5) Implemente uma função em R que calcule a soma dos 100 primeiros termos 
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

# 6) 
itensVendidos = read.xlsx("restaurante.xlsx", 1)
(itensVendidos)
qtd_itens = itensVendidos$Quantidade
(qtd_itens)
# Média de Quantidade:
mean(qtd_itens, na.rm = TRUE)
# Mediana de Quantidade:
median(sort(qtd_itens), na.rm = TRUE)
# Moda de Quantidade:
q = table(qtd_itens)
q[q == max(q)]
# Variância de Quantidade:
var(qtd_itens, na.rm = TRUE)
# Desvio Padrão de Quantidade:
sd(qtd_itens, na.rm = TRUE)
# Correlação entre Item e Quantidade:
correlacao_item_quantidade = cor(itensVendidos$Item, itensVendidos$Quantidade, use = "na.or.complete")
(correlacao_item_quantidade)
funcao_interpretacao_proporcionalidade(correlacao_item_quantidade)
suppressWarnings(print(funcao_interpretacao_correlacao(abs(correlacao_item_quantidade))))

# 7) Calcule as probabilidades dos seguintes eventos. 
# Para cada letra crie o espaço amostral e o
# evento desejado.
# 7.a) Obter três caras, sem importar a ordem, nos 6 lançamentos de uma moeda justa.
espaco_amostral_7a = tosscoin(6)
(espaco_amostral_7a)
evento_7a = subset(espaco_amostral_7a, isrep(espaco_amostral_7a, vals = "H", nrep = 3))
(evento_7a)
probabilidade_7a = nrow(evento_7a) / nrow(espaco_amostral_7a)
(probabilidade_7a)
  
# 7.b) Obter quatro coroas, sem importar a ordem, no lançamento de 7 vezes de uma moeda
# com p_cara = 0.75 e p_coroa= 0.25. Use a função iidspace para criar as probabilidades.
espaco_amostral_7b = iidspace(c("H", "T"), ntrials = 7, probs = c(0.75, 0.25))
(espaco_amostral_7b)
evento_7b = subset(espaco_amostral_7b, isrep(espaco_amostral_7b, vals = "T", nrep = 4))
(evento_7b)
probabilidade_7b = nrow(evento_7b) / nrow(espaco_amostral_7b)
(probabilidade_7b)

# 7.c) Obter a soma do resultado do lançamento de 4 vezes de um dado com 8 faces maior que 23.
s7.c = rolldie(4, nsides = 8, makespace = TRUE)
(s7.c)
espaco_amostral_7c = addrv(s7.c, U=X1+X2+X3+X4)
head(espaco_amostral_7c)
probabilidade_7c = Prob(espaco_amostral_7c, U > 23)
(probabilidade_7c)

# 7.d) Obter uma carta (qualquer naipe) de valor entre 5 e 9 na retirada de um baralho com os
# coringas presentes.
espaco_amostral_7d = cards(makespace = TRUE, jokers = TRUE)
(espaco_amostral_7d)
evento_7d = subset(espaco_amostral_7d, rank %in% 5:9)
(evento_7d)
Prob(evento_7d)

# 7.e) Considere três lançamentos de um dado justo de seis faces. Evento A (valores iguais) e
# B (soma dos valores menor ou igual a 12). Calcule P(A|B) e P(B|A).
espaco_amostral_7e = rolldie(3, nsides = 6, makespace = TRUE)
(espaco_amostral_7e)
evento_a_7e = subset(espaco_amostral_7e, X1 == X2 & X2 == X3)
(evento_a_7e)
evento_b_7e = subset(espaco_amostral_7e, X1 + X2 + X3 <= 12)
(evento_b_7e)
Prob(evento_a_7e, given = evento_b_7e)
Prob(evento_b_7e, given = evento_a_7e)

# 8)

data("cars")
cars
