import math

a = 1
b = -5
c = 6

x = (b ** 2) - (4 * a * c)

if x < 0:

	print("Raiz negativa")

else:

	r = math.sqrt(x)
	x1 = (-b + r) / (2*a)
	x2 = (-b - r) / (2*a)

print("\n\nX' = %s \nX' = " % x1, x2)
