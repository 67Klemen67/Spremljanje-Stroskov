package si.um.feri.stroski.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import si.um.feri.stroski.models.Kategorija;
import java.util.Optional;

public interface KategorijaRepository extends JpaRepository<Kategorija, Long>{
    Optional<Kategorija> findByNazivIgnoreCase(String naziv);
}
