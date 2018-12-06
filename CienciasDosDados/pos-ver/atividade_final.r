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
coeficiente_correlacao_bases = cor(base_aleatoria_1, base_aleatoria_2)
(coeficiente_correlacao_bases)
if(coeficiente_correlacao_bases == 0) {
  print("Bases sem correção.")
} else if (coeficiente_correlacao_bases >= 0) {
  print("Associação positiva. As bases são diretamente proporcionais.")
} else {
  print("Associação negativa. As bases são inversamente proporcionais.")
}



#parei (Ferramentas em IA - Aula_17_11.pdf) página 21

#########################################################
### teste +

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


