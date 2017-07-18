package hello.pojo;

import java.util.Date;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

//format of data inputs and outputs, you write code to represent a row of data.
@Document
public class Carro {

	private String km;
    private String nome;

    @CreatedDate
    private Date createdDate;
    
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private String id;
    
//    @DBRef
//    private List<Account> accounts;
    /*

@Document
public class Account {

  @Id
  private ObjectId id;
  private Float total;
}

@Document
public class Person {

  @Id
  private ObjectId id;
  @Indexed
  private Integer ssn;
  @DBRef
  private List<Account> accounts;
}
     */
    
//    @RelatedDocument
//    private SurveyInfo surveyInfo;

//    @Field("fName")
//    private String firstName;

//    @Indexed(unique = true)
//    private Integer ssn;
    
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
