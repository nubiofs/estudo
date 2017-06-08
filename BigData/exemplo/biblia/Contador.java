/*Objetivo desse script Java é contar quantos caracteres, palavras, linhas de um arquivo informado via linha de comando
@autor: Reginaldo
compilar: javac Contador.java
executar: java Contador nomearquivo1 nomearquivo2 nomearquivoN*/
import java.io.*;
public class Contador{
	private static void contaLinhas(String arquivo, BufferedReader in) throws IOException{
		long numerocaracteres=0;
		long numerolinhas=0;
		long numeropalavras=0;
		String linha;
		do{
			linha = in.readLine();
			if(linha != null){
				numerocaracteres += linha.length();
				numeropalavras += contaPalavras(linha);
				numerolinhas++;
			}
		}while(linha != null);
		   System.out.println("Arquivo:" +arquivo);
		   System.out.println("Número de caracteres: " +numerocaracteres);
		   System.out.println("Número de palavras: " +numeropalavras);
		   System.out.println("Número de linhas: " +numerolinhas); 
	}
	private static void contaLinhas(String arquivo){
		BufferedReader in = null;
		try{
			FileReader file = new FileReader(arquivo);
			in = new BufferedReader(file);
			contaLinhas(arquivo,in);
		}catch(IOException e){
			e.printStackTrace();
		}
	}
	private static long contaPalavras(String linha){
		long numeropalavras=0;
		int indice = 0;
		boolean espacoembranco = true;
		while(indice < linha.length()){
			char c = linha.charAt(indice++);
			boolean espacoembrancoatual = Character.isWhitespace(c);
			if(espacoembranco && !espacoembrancoatual){
				numeropalavras++;
			}
			espacoembranco = espacoembrancoatual;
		}
		     return numeropalavras;
		
	}
public static void main(String[] args){
        long numerocaracteres=0;
	long numeropalavras=0;
	long numerolinhas=0;
	String linha;	
	if(args.length < 1){
	      System.out.println("Utilização: java Contador <arquivo> [...]");
	       return;
	}
	try{
		if(args.length == 0){
			BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
			linha = in.readLine();
			numerocaracteres = linha.length();
			if(numerocaracteres != 0){
				numerolinhas=1;
			}
			System.out.println("Numero de caracteres: " +numerocaracteres);
			System.out.println("Numero de palavras: " +contaPalavras(linha));
			System.out.println("Numero de linhas: " +numerolinhas);
		}
		else{
			    //System.out.println("Foram passados" +args.length+ "parametros");
			    for(int i=0; i<args.length; i++){
				contaLinhas(args[i]);		
			   }
		}
	}catch(IOException e){
		e.printStackTrace();
	}
	
   }//fim do main
}//fim da classe