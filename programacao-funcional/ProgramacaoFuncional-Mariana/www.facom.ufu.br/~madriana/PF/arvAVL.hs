
data Avl a = Nulo | No a (Avl a) (Avl a) deriving (Eq,Ord,Show)


-- Para inserir uma lista de elementos numa arvore AVL, com balanceamento:
-- insereAvlLista Nulo [3,4,2,5,1]


insereAvlLista::Ord a => (Avl a)  -> [a] -> (Avl a)
insereAvlLista arv [] = arv
insereAvlLista arv (h:t) = insereAvlLista (insereAvl arv h) t

insereAvl ::Ord a=> (Avl a) -> a -> (Avl a)
insereAvl Nulo x = No x Nulo Nulo
insereAvl (No y esq dir) x
    | x == y     = No y esq dir
    | x < y       = rebalancear (No y (insereAvl esq x) dir)
    | otherwise = rebalancear (No y esq (insereAvl dir x))


rotacaoDir  (No x (No y s1 s2) s3) = No y s1 (No x s2 s3)
rotacaoEsq  (No x  s1 (No y s2 s3)) = No y (No x s1 s2) s3


rebalancear :: Ord a => (Avl a) -> (Avl a)
rebalancear (No y s1 s2)
     | abs (sy) < 2               = No y s1 s2
     | sy == 2 && st1 /= -1  = rotacaoDir (No y s1 s2)
     | sy == 2 && st1 == -1 = rotacaoDir (No y (rotacaoEsq s1) s2)
     | sy == -2 && st2 /= 1  = rotacaoEsq (No y s1 s2)
     | sy == -2 && st2 == 1 = rotacaoEsq (No y s1 (rotacaoDir s2))
   where
       sy  = fatorBal (No y s1 s2)
       st1 = fatorBal s1
       st2 = fatorBal s2


fatorBal :: Ord a=>(Avl a) -> Int
fatorBal Nulo = 0
fatorBal (No x s1 s2) = (altura s1) - (altura s2)


altura ::Ord a=> (Avl a) -> Int
altura Nulo = 0
altura (No x s1 s2) = 1 + (max (altura s1) (altura s2))








