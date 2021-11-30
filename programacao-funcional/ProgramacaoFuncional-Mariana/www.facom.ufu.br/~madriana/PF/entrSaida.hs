import IO
import Random

menu::IO()
menu = do putStr "incluir \n"
          putStr "incluir2 \n"
          putStr "incluir3 \n"
          putStr "incluir4 \n"


menu2::IO()
menu2 = do str1 <- getLine
           str2 <- getLine
           putStrLn (str1++str2)



ask :: String -> IO String
ask question = do putStr question 
                  getLine


menu3 :: IO ()
menu3 = do nome <- ask "Digite seu nome? "
           matr <- ask "Digite seu nro de matricula? "
           putStrLn ("Benvindo "++ nome ++ "!")
           putStrLn ("Seu numero de matricula e "++ matr)


leInt :: IO(Int)
leInt = do putStr "Digite um valor inteiro: "
           readLn




mdc :: Integer -> Integer -> Integer
mdc a 0 = a
mdc a b = mdc b (mod a b)

menumdc = do putStrLn "a ?" 
             a <- readLn         
             putStrLn "b ?"         
             b <- readLn        
             putStrLn "mdc(a,b) = " 
             print (mdc a b) 


menu4 = do num <- randomRIO(1::Int,100)
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



type File = String
type PriceList =[(String,Int)]

readPriceList :: File -> IO PriceList
readPriceList fname = do contents <- readFile fname
                         return (read contents)



main :: IO ()
main = do putStr "Digite o nome do arquivo de entrada: "
          ifile <- getLine
          putStr "Digite o nome do arquivo de saida: "
          ofile <- getLine
          s <- readFile ifile
          writeFile ofile s

