#
# Comandos auxiliares (interessantes)
#
# - Get the current working directory:
# getwd()
#
# - Obtendo ajuda:
# example("rep")
# demo(graphics)
#
# - Obtendo dados do linux:
# read.table(pipe("ps"), header=TRUE)
# read.table(pipe("ls"), header=TRUE)
#
# - Informações de um pacote:
# RShowDoc("NEWS", package = "lattice")

#
# Atividade: criar um vetor Cardápio com as opções de um restaurante
# e outro com os preços. E a partir desses dois armazenar na variável
# Total uma estrutura de dados. Utilize o seguinte comando.
#
cardapio = c("Entrada", "Principal", "Sobremesa")
precos <- c("9.50", "23.00", "12.64")
# as.numeric(precos)
restaurante <- data.frame(Cardápio = cardapio, Preço = precos)
print(restaurante)

#
# Atividade: Aproveitando o exemplo anterior. Criar um vetor dias com
# as quantidades pedidas dos pratos em dois dias e em seguida
# concatenar usando a função list() com cardápio e preços.
#
df <- data.frame(list(Cardápio = cardapio, Preço = precos, Dias = dias))

# t(data.frame(list(Cardápio = cardapio, Preço = precos, Dias = dias)))

# tb <- read.table("tabela01.txt", header=T, sep="\t");
# if(is.data.frame(tb)) print(tb)

#
# Atividade: Criar uma planilha e importar seus dados para o R.
#
library(xlsx)
resultado <- read.xlsx("planilha01.xlsx", 1)
head(resultado)

#
# Atividade: Exportar um data.frame do R, para criar uma planilha de
# dados
#
write.xlsx(df, "restaurante.xlsx")

# carros <- read.csv(file = "carros.csv", header = TRUE, sep = ";")
# head(carros)

# (https://www.stat.berkeley.edu/~s133/R-4a.html)
# Contains the information about the country by continents "conts"
# conts = read.csv('http://www.stat.berkeley.edu/classes/s133/data/conts.txt',na.string='.',stringsAsFactors=FALSE)
# table(conts$cont)
# sum(conts$cont == "EU")

#
# Saving Plots in R
#
# a <- 1:10
# b <- seq(2, 20, 2)
# jpeg("aXb.jpg")
# plot(a, b)
# dev.off()
#
# dev.copy(png,'myplot.png')
# dev.off()
#
# pdf("aXb.pdf")
# plot(a, b)
# dev.off()
#
# x <- stats::rnorm(50)
# opar <- par(bg = "white")
# plot(x, ann = FALSE, type = "n")
# abline(h = 0, col = gray(.90))
# lines(x, col = "green4", lty = "dotted")
# points(x, bg = "limegreen", pch = 21)
# title(main = "Simple Use of Color In a Plot",
#       +       xlab = "Just a Whisper of a Label",
#       +       col.main = "blue", col.lab = gray(.8),
#       +       cex.main = 1.2, cex.lab = 1.0, font.main = 4, font.lab = 3)
#
# par(mfrow=c(2,2))
# curve(sin(x),from=-pi,to=pi,main="Sine")
# curve(cos(x),from=-pi,to=pi,main="Cosine")
# curve(tan(x),from=-pi,to=pi,main="Tangent")
# curve(sin(x)^2/cos(x),from=-pi,to=pi,main="Sin^2/Cosine")
#
# - Obtem a localização precisa no grafico plotado:
# locator()

# as.Date('1/15/2001',format='%m/%d/%Y')
# mydate = strptime('16/Oct/2005:07:51:00',format='%d/%b/%Y:%H:%M:%S')
# seq(as.Date('1976-7-4'),by='days',length=10)
# seq(as.Date('2000-6-1'),to=as.Date('2000-8-1'),by='2 weeks')
# Sys.time()
# rdates = scan(what="")

#
# Atividade para plotar dados da base Iris:
# Bases de Dados
# http://archive.ics.uci.edu/ml/datasets/Iris
#
# iris
# table(iris)
# ncol(iris)
# nrow(iris)
# head(iris)
eixo_x = iris[2]
eixo_y = iris[4]
# head(eixo_y)
# is.data.frame(eixo_y)
ex = eixo_x$Sepal.Width
ey = eixo_y$Petal.Width
plot(x=ex, y=ey, type="p", xlim=c(1, 20), ylim=c(1, 20), main="PLANTA IRIS", xlab = "Sepal Width", ylab = "Petal Width", col = "blue")

