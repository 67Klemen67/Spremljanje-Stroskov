package si.um.feri.stroski.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Strosek {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String naziv;
    private double znesek;
    private String kategorija;

    
    public Strosek() {
    }

    
    public Strosek(String naziv, double znesek, String kategorija) {
        this.naziv = naziv;
        this.znesek = znesek;
        this.kategorija = kategorija;
    }

    
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNaziv() { return naziv; }
    public void setNaziv(String naziv) { this.naziv = naziv; }

    public double getZnesek() { return znesek; }
    public void setZnesek(double znesek) { this.znesek = znesek; }

    public String getKategorija() { return kategorija; }
    public void setKategorija(String kategorija) { this.kategorija = kategorija; }
}