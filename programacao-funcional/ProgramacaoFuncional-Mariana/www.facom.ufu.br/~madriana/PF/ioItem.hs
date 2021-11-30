

arq :: IO ()
arq = do  putStr "Digite o nome do arquivo de entrada: "
          ifile <- getLine
          putStr "Digite o nome do arquivo de saida: "
          ofile <- getLine
          s <- readFile ifile
          writeFile ofile s



type Cents = Int
type PriceList = [(String,Cents)]
type ShoppingList = [(String,Cents,Cents)]



readShoppinList :: IO ShoppingList
readShoppinList = do putStr "Digite um item de compra: "
                     item <- getLine
                     if item == ""
                        then return []
                        else do putStr "Quantidade = "
                                q <- readLn
                                putStr "Preco Unit = "
                                p <- readLn
                                items <- readShoppinList
                                return ((item,q,p):items)


gravaArq :: IO ()
gravaArq = do g <- readShoppinList
              putStr "Digite o nome do arquivo de gravacao: "
              ofile <- getLine
              writeFile ofile (show g)


valorPagar:: IO ()
valorPagar = do putStr "Digite o nome do arquivo: "
                fnome <- getLine
                g <- readPriceList fnome
                let c = calcPag g
                print c


calcPag::ShoppingList->Int
calcPag [] = 0
calcPag ((x,y,z):xs) = (y*z) + calcPag xs


type File = String

readPriceList :: File -> IO ShoppingList
readPriceList fname = do cs <- readFile fname
                         print cs 
                         return (read cs)




contaItens:: IO ()
contaItens = do putStr "Digite o nome do arquivo: "
                fnome <- getLine
                g <- readPriceList fnome
                let c = conta g
                print c


conta::[a]->Int
conta [] = 0
conta (x:xs) = 1 + conta xs



                          
