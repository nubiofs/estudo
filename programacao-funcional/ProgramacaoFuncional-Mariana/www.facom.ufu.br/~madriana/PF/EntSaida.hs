import Random


-- Função para ler um número e retorná-lo

leInt :: IO (Int)
leInt = do putStr "Digite um valor inteiro: "
           readLn



-- Ler dois números e imprimir o MDC

menumdc = do putStrLn "a ?" 
             a <- readLn         
             putStrLn "b ?"         
             b <- readLn        
             putStrLn "mdc(a,b) = " 
             print (mdc a b) 

mdc :: Integer -> Integer -> Integer
mdc a 0 = a
mdc a b = mdc b (mod a b)


-- Ler um número e imprimir a lista de 0 a n

lista::IO ()
lista = do 
	y <- leInt
	print [0..y]


-- Imprimir a soma de vários números, digitando cada um deles

geraSoma::IO ()
geraSoma = do 
	putStrLn "Entre com varios numeros (até 0)"
	z <-  soma
	print (z)


soma::IO Int
soma = do 
 x <- leInt
 if (x==0) 
  then return 0
  else (do y <- soma
           return (x+y))
         	  


-- Função que gera um número aleatorio entre 0 e 100 e solicita
-- que o usuário descubra qual foi o número gerado.

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

