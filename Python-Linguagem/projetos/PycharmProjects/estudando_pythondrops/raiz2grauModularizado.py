import math

# 1º modulo
def obterCoeficientes():
	return 1, -5, 6

# 2º modulo
def calcDelta(a, b, c):
	delta = (b ** 2) - (4*a*c)
	if delta < 0:
		return float('nan')
	else:
		return delta

# 3 º modulo
def calcRaizes(a, b, c):
	delta = calcDelta(a, b, c)
	if math.isnan(delta):
		print("Não possui raizes reais")
	elif delta == 0:
		raiz = -b / 2*a
		print("Possui uma raiz: ", raiz)
	else:
		x1 = (-b + math.sqrt(delta)) / 2*a
		x2 = (-b - math.sqrt(delta)) / 2*a
		print("\nX1: ", x1, ", X2: ", x2)

# Invocando modulos

if __name__ == '__main__':
	a, b, c = obterCoeficientes()
	calcRaizes(a, b, c)





