package si.um.feri.stroski.controllers;

import org.springframework.data.domain.Sort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import si.um.feri.stroski.models.Strosek;
import si.um.feri.stroski.repositories.StrosekRepository;

import java.util.List;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/stroski")
public class StrosekController {

    @Autowired
    private StrosekRepository strosekRepository;

    
    @PostMapping
    public Strosek dodajStrosek(@RequestBody Strosek strosek) {
        return strosekRepository.save(strosek);
    }

    
  // 2. READ - Pridobivanje vseh stroškov z ISKANJEM in RAZVRŠČANJEM
    @GetMapping
    public List<Strosek> vrniVseStroske(
            @RequestParam(required = false) String iskanje,
            @RequestParam(required = false) String sortiranje) {

        // Določanje smeri razvrščanja (privzeto je brez)
        Sort sort = Sort.unsorted();
        if ("znesekAsc".equals(sortiranje)) {
            sort = Sort.by(Sort.Direction.ASC, "znesek");
        } else if ("znesekDesc".equals(sortiranje)) {
            sort = Sort.by(Sort.Direction.DESC, "znesek");
        }

        // Če je uporabnik nekaj vpisal v iskalnik
        if (iskanje != null && !iskanje.isEmpty()) {
            return strosekRepository.findByNazivContainingIgnoreCase(iskanje, sort);
        }
        
        // Če iskalnik prazen, vrni vse (z upoštevanim sortiranjem)
        return strosekRepository.findAll(sort);
    }

    
    @GetMapping("/{id}")
    public Strosek vrniStrosekPoId(@PathVariable Long id) {
        return strosekRepository.findById(id).orElse(null);
    }


    @PutMapping("/{id}")
    public Strosek posodobiStrosek(@PathVariable Long id, @RequestBody Strosek posodobljenStrosek) {
        return strosekRepository.findById(id).map(obstojeci -> {
            obstojeci.setNaziv(posodobljenStrosek.getNaziv());
            obstojeci.setZnesek(posodobljenStrosek.getZnesek());
            obstojeci.setKategorija(posodobljenStrosek.getKategorija());
            return strosekRepository.save(obstojeci);
        }).orElse(null); 
    }

    
    @DeleteMapping("/{id}")
    public void izbrisiStrosek(@PathVariable Long id) {
        strosekRepository.deleteById(id);
    }
}