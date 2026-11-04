package si.um.feri.stroski.repositories; // Pazi na svoj paket!

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import si.um.feri.stroski.models.Strosek;
import java.util.List;

public interface StrosekRepository extends JpaRepository<Strosek, Long> {
    // Nova metoda za iskanje in razvrščanje hkrati
    List<Strosek> findByNazivContainingIgnoreCase(String naziv, Sort sort);
}