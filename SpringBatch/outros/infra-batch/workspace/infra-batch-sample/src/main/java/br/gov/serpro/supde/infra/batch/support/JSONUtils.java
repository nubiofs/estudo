package br.gov.serpro.supde.infra.batch.support;

import br.gov.serpro.supde.infra.batch.sample.domain.Product;

import com.google.gson.Gson;

public class JSONUtils {

	private static final Gson gson = new Gson();
	private static Product product;
	
	private JSONUtils() {
	}

	public static boolean isJSONValid(String jsonInString) {
		try {
			setProduct(gson.fromJson(jsonInString, Product.class));
			return true;
		} catch (com.google.gson.JsonSyntaxException ex) {
			setProduct(null);
			return false;
		}
	}

	public static Product getProduct() {
		return product;
	}

	public static void setProduct(Product product) {
		JSONUtils.product = product;
	}

}
