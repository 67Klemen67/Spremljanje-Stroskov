package si.um.feri.stroski.controllers;

import org.springframework.data.domain.Sort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import si.um.feri.stroski.models.Kategorija;
import org.springframework.http.HttpStatus;
import si.um.feri.stroski.repositories.KategorijaRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;



@RestController
@CrossOrigin(origins="*")
@RequestMapping("/kategorije")
public class KategorijaController {

    @Autowired 
    private KategorijaRepository kategorijaRepository;
    
    @GetMapping
    public List<Kategorija> vrniVseKategorije(){
        return kategorijaRepository.findAll(Sort.by("naziv"));
    }

    @PostMapping
    public Kategorija novaKategorija(@RequestBody Kategorija kategorija) {
        String naziv = "";
        if (kategorija.getNaziv() != null) {
            naziv = kategorija.getNaziv();
        }
        naziv.trim();

        if (naziv.isEmpty() || naziv.length() > 30) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Ime kategorije ne sme biti prazno ali daljše od 30 črk."
            );
        }

        Optional<Kategorija> obstojeca = kategorijaRepository.findByNazivIgnoreCase(naziv);
        if (obstojeca.isPresent()) {
            return obstojeca.get();
        }

        Kategorija novaKategorija = new Kategorija(naziv);

        return kategorijaRepository.save(novaKategorija);
        
    }
    
    
}
