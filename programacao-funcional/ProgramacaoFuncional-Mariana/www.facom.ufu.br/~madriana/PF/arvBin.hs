-- Definicao de dados para ARVORE BINARIA DE INTEIROS e funcoes 
-- folhas (devolve os elementos nas folhas), soma e pertence.

data ArvBinInt = Nil | NoInt Int ArvBinInt ArvBinInt deriving Show

arvDados::ArvBinInt
arvDados = NoInt 4 (NoInt 2 Nil Nil)
                   (NoInt 10 (NoInt 5 Nil Nil) 
                             (NoInt 15 Nil Nil)) 

folhas::ArvBinInt -> [Int]
folhas Nil = []
folhas (NoInt n Nil Nil) = [n]
folhas (NoInt _ esq dir) = folhas esq ++ folhas dir

soma::ArvBinInt -> Int
soma Nil = 0
soma (NoInt n Nil Nil) = n
soma (NoInt n esq dir) = n + soma esq + soma dir

pertenceArv::Int -> ArvBinInt -> Bool
pertenceArv x Nil = False
pertenceArv x (NoInt v esq dir) = x==v || if x<v
                                  then (pertenceArv x esq)
                                  else (pertenceArv x dir)


-- Definicao de dados para ARVORE BINARIA GENERICA e funcoes 
-- para percorrer a arvore

data ArvBinGen a = Nulo | No a (ArvBinGen a) (ArvBinGen a) 
                          deriving Show


arvGen::ArvBinGen [Char]
arvGen = No "+" (No "2" Nulo Nulo)
                (No "*" (No "5" Nulo Nulo) 
                             (No "1" Nulo Nulo ))


-- Percurso 1 (em ordem)
inOrder::ArvBinGen [Char] -> [[Char]]
inOrder Nulo = []
inOrder (No n esq dir) = inOrder esq ++ [n] ++ inOrder dir


-- Percurso 2 (pre ordem)
preOrder::ArvBinGen [Char] -> [[Char]]
preOrder Nulo = []
preOrder (No n esq dir) = n:preOrder esq ++ preOrder dir


-- Percurso 3 (pos ordem)
posOrder::ArvBinGen [Char] -> [[Char]]
posOrder Nulo = []
posOrder (No n esq dir) = posOrder esq ++ posOrder dir ++ [n]



