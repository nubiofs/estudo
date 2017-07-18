package hello.batch.nosql.spring.data.mongo;

import hello.pojo.Carro;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.mongodb.repository.MongoRepository;

//@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface CarroRepository extends MongoRepository<Carro, String> {

    public List<Carro> findByKm(String km);
    @Cacheable({"carro", "nome"})
    //@Cacheable(cacheNames="carro", key="#nome")
    //@Cacheable(cacheNames="carro", sync="true")
    //@Cacheable(cacheNames="carro", condition="#nome.length() >= 32")
    public Carro findByNome(String nome);
    public Long countByKm(String km);
    public Long deleteByKm(String km);
    public List<Carro> findByKmAndNome(String km, String nome);
    // Enabling static ORDER BY for a query
    //List<Person> findByLastnameOrderByFirstnameAsc(String lastname);
    //List<Person> findByLastnameOrderByFirstnameDesc(String lastname);
    public List<Carro> findByNomeOrderByKmDesc(String nome);
    public List<Carro> findByNomeOrderByKm(String nome);
    
//    @Query("{ 'firstname' : ?0 }")
//    @Query(value="{ 'firstname' : ?0 }", fields="{ 'firstname' : 1, 'lastname' : 1}")
//    List<Person> findByThePersonsFirstname(String firstname);

}