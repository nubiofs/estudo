package br.gov.serpro.supde.infra.batch.util;

public enum ColorEnum {

	GREEN(1, "green"), 
	BLACK(2, "black"), 
	RED(3, "red");

	public int key;
	public String value;

	private ColorEnum(int key, String value) {
		this.key = key;
		this.value = value;
	}

}
