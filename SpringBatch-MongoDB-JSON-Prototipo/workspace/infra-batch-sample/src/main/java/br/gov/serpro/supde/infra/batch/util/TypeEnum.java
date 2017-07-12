package br.gov.serpro.supde.infra.batch.util;

public enum TypeEnum {

	PHONE(1, "phone"), 
	ACCESSORY(2, "accessory"), 
	CHARGER(3, "charger"), 
	CASE(4, "case"),
	SERVICE2968(5, "service2968"),
	SERVICE8780(6, "service8780"),
	SERVICE(7, "service"),
	TV(8, "tv");

	public int key;
	public String value;

	private TypeEnum(int key, String value) {
		this.key = key;
		this.value = value;
	}

}
