data XML =  NoText String  | NoDef String [XML] deriving (Show, Eq)

arvXML::XML
arvXML = NoDef "Cliente" [ NoDef "Nome" [NoText "Ana"],
                           NoDef "Nasc" [NoDef "Dia" [NoText "10"],
                                         NoDef "Mes" [NoText "08"],  
                                         NoDef "Ano" [NoText "1988"]],  
                           NoDef "Fone" [NoText "123456"]]


percurso::XML->[String]
percurso (NoText s) = [s]
percurso (NoDef e xs) = [e] ++ achatar (map percurso xs)

achatar::[[a]]->[a]
achatar [] = []
achatar (x:xs) = x ++ achatar xs

-- Exemplo de uso da função 'achatar':
-- achatar [[1],[1],[2],[2]]
-- [1,1,2,2]