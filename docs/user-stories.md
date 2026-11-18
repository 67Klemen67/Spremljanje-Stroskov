# Uporabniške zgodbe

## US-SEM-01: Vnos začetne bilance in prikaz trenutne bilance

**Odgovorni član:** Semir Slamar

### Uporabniška zgodba

Kot uporabnik želim vnesti začetno bilanco in videti, kako se spreminja glede na zabeležene stroške, da lahko spremljam preostali znesek.

### Sprejemni kriteriji

1. **Given:** Začetna bilanca še ni shranjena in ni zabeleženih stroškov.  
   **When:** Vnesem začetno bilanco 100 € in jo shranim.  
   **Then:** Začetna in trenutna bilanca sta 100 €.

2. **Given:** Začetna bilanca je 100 €, vsota vseh zabeleženih stroškov pa 25 €.  
   **When:** Odprem ali osvežim pregled.  
   **Then:** Trenutna bilanca je 75 €.

3. **Given:** Trenutna bilanca je 75 €.  
   **When:** Dodam strošek 10 € in se ta uspešno shrani.  
   **Then:** Trenutna bilanca se posodobi na 65 €.

4. **Given:** Strošek je že vključen v izračun bilance.  
   **When:** Strošek uredim ali izbrišem in se seznam posodobi.  
   **Then:** Sistem bilanco ponovno izračuna na podlagi trenutno shranjenih stroškov.

5. **Given:** Začetno bilanco sem shranil v istem brskalniku.  
   **When:** Stran ponovno odprem.  
   **Then:** Začetna bilanca se obnovi, trenutna bilanca pa se prikaže z upoštevanimi stroški.

6. **Given:** Vnesem prazno ali negativno začetno bilanco.  
   **When:** Poskusim jo shraniti.  
   **Then:** Sistem je ne shrani, prikaže opozorilo in ohrani zadnjo veljavno bilanco.

### Podrobnosti implementacije

Začetna bilanca se shrani v brskalniku z `localStorage`, zato je dostopna v istem brskalniku. Trenutna bilanca se izračuna kot začetna bilanca minus vsota vseh zabeleženih stroškov.

Izračun mora vključevati vse stroške, tudi kadar je seznam v tabeli filtriran po nazivu ali razvrščen. Po dodajanju, urejanju ali brisanju stroška se bilanca ponovno izračuna. Prazna ali negativna začetna bilanca se zavrne. Za to funkcionalnost spremembe backenda ali podatkovne baze niso potrebne.

### Podnaloge

#### 1. Dodaj vnos in shranjevanje začetne bilance

**Opis:** Dodaj polje za vnos začetne bilance, preveri, da vrednost ni prazna ali negativna, ter veljavno vrednost shrani v `localStorage`. Ob ponovnem odprtju strani obnovi shranjeno vrednost.

**Odgovorni član:** Semir Slamar

#### 2. Izračunaj in prikaži trenutno bilanco

**Opis:** Izračunaj trenutno bilanco tako, da od začetne bilance odšteješ vsoto vseh stroškov. Bilanco osveži po dodajanju, urejanju ali brisanju stroška.

**Odgovorni član:** Semir Slamar

#### 3. Preveri izračun in neveljavne vnose

**Opis:** Preveri izračun brez stroškov in z več stroški, posodobitev po urejanju in brisanju, shranjevanje po ponovnem odprtju strani ter zavrnitev prazne ali negativne začetne bilance.

**Odgovorni član:** Semir Slamar