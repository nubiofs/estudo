-- Seja uma lista de alunos e suas notas.
-- Deseja-se construir funções para a manipulação destes
-- dados:
-- a) Calcular a Media das notas
-- b) Retornar a Maior nota
-- c) Inserir um novo aluno
-- d) Remover o aluno com a menor nota
-- e) Verificar se um aluno pertence à lista
-- f) Ordenar a lista

type Aluno = (Int, [Char], Float) -- Nº Aluno, Nome, Nota

type Curso = [Aluno]


listaAlunos :: Curso
listaAlunos = [(1234, "Jose Azevedo", 13.2), 
               (2345, "Carlos Silva", 9.7), 
               (3456, "Rosa Mota", 17.9),
               (1447, "Ana Dias", 15.8)]


-- Calcular a média das notas dos alunos

mediaNotas :: Curso -> Float
mediaNotas [] = 0
mediaNotas (x) = (somaNotas x)/(somaAlunos x)


-- Calcular a quantidade de  alunos

somaAlunos :: Curso -> Float
somaAlunos [] = 0
somaAlunos ((x,_,_):xs) = 1 + (somaAlunos xs)


-- Calcular a soma das notas dos alunos

somaNotas :: Curso -> Float
somaNotas [] = 0
somaNotas ((_,_,x):xs) = x + (somaNotas xs)


-- Retornar a maior entre as notas dos alunos

maiorNota:: Curso -> Float
maiorNota [(_,_,x)] = x
maiorNota ((_,_,x):t) = 
  if x > (maiorNota t) then x else (maiorNota t)


menorNota:: Curso -> Float
menorNota [(_,_,x)] = x
menorNota ((_,_,x):t) =   if x < (menorNota t) then x else (menorNota t)


-- Inserir aluno em curso

insere :: Aluno -> Curso -> Curso
insere (x,y,z) [] = [(x,y,z)]
insere (x,y,z) ((a,b,c):t) = (x,y,z):((a,b,c):t)


-- Verificar se um aluno pertence a um curso

pertence :: Aluno -> Curso -> Bool
pertence (x,_,_) [] = False
pertence (x,y,z) ((a,b,c):t) | (x == a) = True
                             | otherwise = pertence (x,y,z) t


-- Eliminar a menor nota

removeMenorNota:: Curso -> Curso
removeMenorNota [] = []
removeMenorNota ((a,b,c):t) | c == menorNota ((a,b,c):t) = t
                            | otherwise = (a,b,c): removeMenorNota t



-- Ordenar a lista por nota : critério crescente

alunoMenorNota:: Curso -> Aluno
alunoMenorNota [(a,b,c)] = (a,b,c)
alunoMenorNota ((a,b,c):t) =   if c < (menorNota t) then (a,b,c) else (alunoMenorNota t)

ordena::Curso -> Curso
ordena [] = [] 
ordena [(a,b,c)] = [(a,b,c)]
ordena ((a,b,c):t) =
    (alunoMenorNota ((a,b,c):t)): (ordena (removeMenorNota ((a,b,c):t)))