package br.gov.serpro.supde.infra.batch.sample.test;

import java.util.Map;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import br.gov.serpro.supde.infra.batch.util.JSONUtils;

import com.google.gson.reflect.TypeToken;

public class TestesJSON {

	public static void main(String[] args) {

		//
		//Teste 01
		//
		String json = "{\"name\":\"mkyong\", \"age\":33}";
		Map<String, Object> map = JSONUtils.GSON.fromJson(json, new TypeToken<Map<String, Object>>(){}.getType());

		//java 1.8
		//map.forEach((x,y)-> System.out.println("key : " + x + " , value : " + y));
		//java 1.7
		for(Map.Entry<String, Object> entry : map.entrySet()) {
			String key = entry.getKey();
			Object value = entry.getValue();
			System.out.println("key : " + key + " , value : " + value);
		}

		//
		//Teste 02
		//
		String complexGenericJson = "{\"boxContent\":{\"_name\":\"Norman\",\"age\":26,\"email\":\"norman@fs.io\",\"isDeveloper\":true,\"registerDate\":\"Jun 7, 2016 7:15:29 AM\"}}";

		//Type complexType = new TypeToken<Box<UserDate>>() {}.getType();
		//Box boxWithData = JSONUtils.GSON.fromJson(complexGenericJson, complexType);  
		Box<UserDate> boxData = JSONUtils.GSON.fromJson(complexGenericJson, Box.class);

		//System.out.println("boxWithData: " + boxWithData);
		System.out.println("boxData: " + boxData.getBoxContent());
		System.err.println("");

		//
		//Teste 03
		//
		try {
			
			/*
			{
				"devmovies":
					{
					"filme":
						[
						{
							"id":1,
							"titulo":"Os Arquivos JSON ",
							"ano":1998,
							"resumo":"A história dos arquivos muito leves",
							"generos":["Ação","Sci-fi","Drama"],
							"elenco":["Gillian Triggerson","David Markupovny"]
						},
						{
							"id":2,
							"titulo":"Sexta-feira 13: JSON vive",
							"ano":1986,				
							"generos":["Ação","Horror"],
							"elenco":["Ann Labelvalue Pair", "Jennifer Json", "John Java"]
						}
						]
					}
			}
			*/
			
			//entrada: string json com dados dos filmes
			String jsonStr = "{"
					+ "\"devmovies\":"
					+ "{"
					+ "\"filme\":"
					+ "["
					+ "{"
					+ "\"id\":1,"
					+ "\"titulo\":\"Os Arquivos JSON\","
					+ "\"ano\":1998,"
					+ "\"resumo\":\"A história dos arquivos muito leves\","
					+ "\"generos\":[\"Ação\",\"Sci-fi\",\"Drama\"],"
					+ "\"elenco\":[\"Gillian Triggerson\",\"David Markupovny\"]"
					+ "},"
					+ "{"
					+ "\"id\":2,"
					+ "\"titulo\":\"Sexta-feira 13: JSON Vive\","
					+ "\"ano\":1986,"
					+ "\"generos\":[\"Ação\",\"Horror\"],"
					+ "\"elenco\":[\"Ann Labelvalue Pair\", \"Jennifer Json\", \"John Java\"]"
					+ "}" + "]" + "}" + "}";

			// (1) importa a string para um JSONObject
			JSONObject devMovies = new JSONObject(jsonStr);
			
			// (2) trabalha o conteúdo do JSONObject
			//     imprimindo os dados dos filmes, a partir do objeto devMovies
			//obtém o objeto "devmovies"
			JSONObject filmes = devMovies.getJSONObject("devmovies");

			//obtém o array contendo todos os filmes de "devmovies"
			JSONArray arrFilmes = filmes.getJSONArray("filme");

			//monta laço que percorre o array e imprime os dados de cada filme
			for (int i=0; i < arrFilmes.length(); i++) {

				//recupera filme de índice "i" no array 
				JSONObject f = arrFilmes.getJSONObject(i);

				System.out.println("id: " + f.getInt("id"));
				System.out.println("titulo: " + f.getString("titulo"));
				System.out.println("ano: " + f.getInt("ano"));
				//como o campo "resumo" é opcional, é preciso usar o método "opt()"
				//se o valor "-" for omitido, a palavra "null" é impressa no segundo filme
				System.out.println("resumo: " + f.optString("resumo","-"));

				//gêneros
				JSONArray arrGeneros = f.getJSONArray("generos");
				for (int k=0; k < arrGeneros.length(); k++) {
					System.out.println("genero " + (k+1) + ": " + arrGeneros.getString(k));
				}

				//elenco
				System.out.println("elenco: ");
				JSONArray arrAtores = f.getJSONArray("elenco");
				for (int j=0; j < arrAtores.length(); j++) {
					System.out.println("\t" + arrAtores.getString(j));
				}

				System.out.println();
			}

		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	private static class Box<T> {

		private T boxContent;

		public Box(T boxContent) {
			this.boxContent = boxContent;
		}

		public T getBoxContent() {
			return boxContent;
		}

	}

	private static class UserDate {

		String name;
		int age;
		String email;
		boolean isDeveloper;
		String registerDate;

		@Override
		public String toString(){

			final ToStringBuilder builder = new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE);

			builder.append("name", name)
			.append("age", age)
			.append("email", email)
			.append("isDeveloper", isDeveloper)
			.append("registerDate", registerDate);

			return builder.toString();

		}

	}
	
}

