package hello.batch.nosql.spring.data.mongo;

import hello.pojo.Carro;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CarroRepository extends MongoRepository<Carro, String> {

    public List<Carro> findByKm(String km);
    public Carro findByNome(String nome);

}