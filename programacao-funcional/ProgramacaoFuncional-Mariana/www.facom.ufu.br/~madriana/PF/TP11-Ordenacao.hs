

-- Funções Exemplos

insereOrdenado :: Ord a => a -> [a] -> [a]
insereOrdenado e [] = [e]
insereOrdenado e (x:xs)
    | e<=x = e : x : xs
    | otherwise = x : insereOrdenado e xs


quicksort :: Ord a => [a ] -> [a ]
quicksort [ ] = [ ]
quicksort (x : xs) = quicksort menores ++ [x ] ++ quicksort maiores
	where
	menores = [a | a <- xs, a <= x ]
	maiores = [b | b <- xs, b > x ]


-- Respostas
-- 1) Passos da ordenação
-- quicksort [5,3,7,8,2,1,4]
-- quicksort [3,2,1,4] ++ [5] ++ quicksort [7,8]
-- .....

-- 2) Os elementos repetidos são eliminados
-- quicksort "mariana"
-- "aimnr"


-- 3) Usando "filter"
quicksortF :: Ord a => [a ] -> [a ]
quicksortF [ ] = [ ]
quicksortF (x : xs) = quicksortF menores ++ [x ] ++ quicksortF maiores
	where
	menores = filter (<= x) xs
	maiores = filter (> x) xs


mistura [] y = y
mistura x [] = x
mistura (x:xs) (y:ys)
         | x <= y = x: mistura xs (y:ys)
         | otherwise = y: mistura (x:xs) ys

mergesort [] = []
mergesort [x] = [x]
mergesort xs = mistura (mergesort as) (mergesort bs)
                       where (as, bs) = splitAt (length xs `div` 2) xs
               

mergesort2 [] = []
mergesort2 [x] = [x]
mergesort2 xs = mistura (mergesort2 as) (mergesort2 bs)
                   where 
                      metade = length xs `div` 2
                      as = take metade xs
                      bs = drop metade xs



bolha lista = bolhaOrd lista (length lista)

bolhaOrd lista 0 = lista
bolhaOrd lista n = bolhaOrd (troca lista) (n-1)

troca [] = []
troca [x] = [x]
troca (x:y:zs) | x > y = y: troca (x:zs)
               | otherwise = x: troca (y:zs)





selecao:: (Ord a) => [a]->[a]
selecao [] = []
selecao xs = [x] ++ selecao (remove x xs)
             where x = minimo xs


remove:: (Ord a) => a->[a]->[a]
remove a [] = []
remove a (x:xs)
 | a==x = xs
 | otherwise = x:(remove a xs)

minimo::(Ord a) => [a]->a
minimo [] = undefined
minimo [x] = x
minimo (x:xs)
 | x <= (minimo xs) = x
 | otherwise = minimo xs





insercao ::(Ord a) => [a] -> [a]
insercao [] = []
insercao (x:xs) = insereOrd x (insercao xs)

insereOrd ::(Ord a) => a -> [a] -> [a]
insereOrd x [] = [x]
insereOrd x (y:ys)
  | x <= y = (x:y:ys)
  | otherwise = y: (insereOrd x ys)










