package hello.pojo;

//format of data inputs and outputs, you write code to represent a row of data.
public class Carro {

	private String km;
    private String nome;

    public Carro() {

    }

	public Carro(String km, String nome) {
		super();
		this.km = km;
		this.nome = nome;
	}
	
	public String getKm() {
		return km;
	}
	
	public void setKm(String km) {
		this.km = km;
	}
	
	public String getNome() {
		return nome;
	}
	
	public void setNome(String nome) {
		this.nome = nome;
	}

	@Override
	public String toString() {
		return "Carro [km=" + km + ", nome=" + nome + "]";
	}
	
}
