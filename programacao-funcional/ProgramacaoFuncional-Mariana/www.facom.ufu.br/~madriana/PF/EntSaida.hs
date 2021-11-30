import Random


-- Fun��o para ler um n�mero e retorn�-lo

leInt :: IO (Int)
leInt = do putStr "Digite um valor inteiro: "
           readLn



-- Ler dois n�meros e imprimir o MDC

menumdc = do putStrLn "a ?" 
             a <- readLn         
             putStrLn "b ?"         
             b <- readLn        
             putStrLn "mdc(a,b) = " 
             print (mdc a b) 

mdc :: Integer -> Integer -> Integer
mdc a 0 = a
mdc a b = mdc b (mod a b)


-- Ler um n�mero e imprimir a lista de 0 a n

lista::IO ()
lista = do 
	y <- leInt
	print [0..y]


-- Imprimir a soma de v�rios n�meros, digitando cada um deles

geraSoma::IO ()
geraSoma = do 
	putStrLn "Entre com varios numeros (at� 0)"
	z <-  soma
	print (z)


soma::IO Int
soma = do 
 x <- leInt
 if (x==0) 
  then return 0
  else (do y <- soma
           return (x+y))
         	  


-- Fun��o que gera um n�mero aleatorio entre 0 e 100 e solicita
-- que o usu�rio descubra qual foi o n�mero gerado.

menuAdivinhe = do num <- randomRIO(1::Int,100)
                  putStrLn "Gerando numero entre 1 e 100 ..."
                  adivinhe num

adivinhe num = do putStr "Tente descobrir (digite um numero):"
                  numP <- getLine
                  if (read numP) < num
                     then do putStrLn "Muito baixo" 
                             adivinhe num
                     else if (read numP) > num
                             then do putStrLn "Muito alto"
                                     adivinhe num
                             else do putStrLn "Voce venceu"

