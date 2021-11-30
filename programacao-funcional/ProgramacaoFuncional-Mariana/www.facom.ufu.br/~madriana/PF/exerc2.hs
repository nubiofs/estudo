import IO
import Array

main :: IO ()
main = do c <- getChar
          putChar c



ftest :: Int -> Int
ftest n = if (mod n 2 == 0) then n  else ftest (2 * n + 1)



fibs    :: Int -> Array Int Int
fibs n  =  a  where a = array (0,n) ([(0, 1), (1, 1)] ++ 
                                     [(i, a!(i-2) + a!(i-1)) | i <- [2..n]])


quadrados = array (1,100) [(i, i*i) | i <- [1..100]]
cubos =  array (1, 100) [(i, i*i*i) | i <- [1..100]]

a = array (1,10) ((1,1) : [(i, i * a!(i-1)) | i <- [2..10]])

mat:: Array (Int,Int) Int
mat = array ((1,1),(2,2)) [((1,1),2),((1,2),2),((2,1),3),((2,2),4)]


--transpose :: Array (Int,Int) Int ->  Array (Int,Int) Int
transpose a = array ((lj,uj), (li,ui)) [a!(j,i) | i <- [li,ui], j <- [lj,uj]]
              where ((li,ui), (lj,uj)) = bounds a



minExpt = 0::Int
maxExpt = 100::Int


expts :: Array Int Integer
expts = array (minExpt,maxExpt) [(n,2^n) | n <- [minExpt .. maxExpt]]

all = [1..10]

--taylor::Int -> Double
taylor n = foldr1 (+) [(n^y)* y | y <- [1..n]]

elemTaylor = [