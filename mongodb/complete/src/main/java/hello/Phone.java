package hello;

public class Phone {
	
	public String number;
	
	public Phone() {
		
	}

	public Phone(String number) {
		this.number = number;
	}
	
    @Override
    public String toString() {
        return String.format(
                "Phone [number='%s']",
                number);
    }

}
