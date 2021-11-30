-- 
-- Fa�a um programa em linguagem Haskell para convers�o de valores representando 
-- Temperaturas nas escalas Celsius, Fahrenheit e Kelvin. 
--


data Temperatura = Celsius Float | Fahrenheit Float | Kelvin Float  

-- fun��o para convers�o de uma temperatura em escala qualquer para a escala Celsius
emC::Temperatura->Temperatura
emC (Celsius c) = Celsius c
emC (Fahrenheit c) = Celsius ((c - 32) * 5 / 9)
emC (Kelvin c) = Celsius (c - 273)


-- redefini��o da compara��o das temperaturas nas diversas escalas (Classe Eq)
instance Eq Temperatura where
    (Celsius c) == (Celsius d) = c == d
    t1 == t2 = (emC t1) == (emC t2)

-- redefini��o do formato de exibi��o das temperaturas para as diversas escalas  (Classe Show)
instance Show Temperatura where
   show (Celsius c) = show c ++ "C"
   show (Fahrenheit c) = show c ++ "F"
   show (Kelvin c) = show c ++ "K"

-- redefini��o da compara��o das temperaturas nas diversas escalas (Classe Ord)
instance Ord Temperatura where
  (Celsius x) > (Celsius y) = x > y
  t1 > t2 = (emC t1) > (emC t2)
  (Celsius x) < (Celsius y) = x < y
  t1 < t2 = (emC t1) < (emC t2)
  (Celsius x) >= (Celsius y) = x >= y
  t1 >= t2 = (emC t1) >= (emC t2)
  (Celsius x) <= (Celsius y) = x <= y
  t1 <= t2 = (emC t1) <= (emC t2)


-- fun��o para verificar se uma lista de temperaturas (em diversas escalas) est� ordenada (fluxo ascendente)
emOrdem::[Temperatura]->Bool
emOrdem [a] = True
emOrdem (a:b:as) = if (a <= b) then emOrdem (b:as)
                               else False