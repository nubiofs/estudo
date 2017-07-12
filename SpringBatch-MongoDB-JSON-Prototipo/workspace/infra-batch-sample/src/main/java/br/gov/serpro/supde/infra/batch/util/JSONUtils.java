package br.gov.serpro.supde.infra.batch.util;

import com.google.gson.Gson;

public class JSONUtils {

	public static final Gson GSON = new Gson();

	public static boolean isJSONValid(String jsonInString) {

		try {
			GSON.fromJson(jsonInString, Object.class);
			return true;
		} catch(com.google.gson.JsonSyntaxException ex) { 
			return false;
		}

	}

}
