# Uporabniške zgodbe

## US-SEM-01: Vnos začetne bilance in prikaz trenutne bilance

**Odgovorni član:** Semir Slamar  
**Prioriteta:** Visoka  
**Ocena zahtevnosti:** 3 Story Points

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

---

## US-KLE-01: Izvoz seznama stroškov v CSV datoteko

**Odgovorni član:** Klemen Skuhala  
**Prioriteta:** Srednja  
**Ocena zahtevnosti:** 2 Story Points

### Uporabniška zgodba

Kot uporabnik želim izvoziti trenutno prikazan seznam stroškov v CSV datoteko, da lahko podatke shranim kot varnostno kopijo ali jih analiziram v zunanjih preglednicah (npr. Excel).

### Sprejemni kriteriji

1. **Given:** V tabeli je prikazan vsaj en strošek.  
   **When:** Kliknem na gumb "Izvozi v CSV".  
   **Then:** Sistem prenese datoteko `stroski.csv`, ki vsebuje glavo tabele (ID, Naziv, Znesek, Kategorija) in vse prikazane stroške.

2. **Given:** Seznam stroškov sem filtriral z iskalnikom po nazivu ali razvrstil po znesku, tako da je prikazan le ožji izbor stroškov.  
   **When:** Kliknem na gumb "Izvozi v CSV".  
   **Then:** Prenesena datoteka `stroski.csv` vsebuje natanko tiste stroške in v tistem vrstnem redu, kot so trenutno prikazani v tabeli.

3. **Given:** Tabela stroškov je prazna (ni vnesenih stroškov ali iskanje ne vrne nobenega zadetka).  
   **When:** Kliknem na gumb "Izvozi v CSV".  
   **Then:** Sistem datoteke ne prenese in na zaslonu prikaže opozorilo: "Izvoz ni mogoč, ker na seznamu ni nobenega stroška."

### Podrobnosti implementacije

Funkcionalnost se implementira na obličju (`frontend/src/App.jsx`). Ob kliku na gumb za izvoz se preveri dolžina seznama `stroski`. Če je seznam prazen (`stroski.length === 0`), se v stanje `napakaIzvoza` shrani opozorilno sporočilo in izvoz se prekine.

Če seznam vsebuje podatke, se sestavi CSV niz z ločilom `;` (podpičje) in predpono UTF-8 BOM (`\uFEFF`), ki zagotavlja pravilen prikaz slovenskih šumnikov (č, š, ž) v programu Microsoft Excel. S pomočjo brskalniškega objekta `Blob` (`text/csv;charset=utf-8;`) in začasnega elementa `<a>` z atributom `download="stroski.csv"` se sproži prenos datoteke. Za to funkcionalnost spremembe backenda ali podatkovne baze niso potrebne.

### Podnaloge

#### 1. Implementiraj logiko za generiranje CSV datoteke in preverjanje praznega seznama

**Opis:** V `App.jsx` dodaj funkcijo `izvoziVCsv`, ki preveri, ali so v tabeli stroški, pretvori prikazane stroške v CSV format z UTF-8 BOM kodiranjem ter sproži prenos datoteke `stroski.csv` ali nastavi sporočilo o napaki.

**Odgovorni član:** Klemen Skuhala

#### 2. Dodaj gumb za izvoz in prikaz opozorila v uporabniški vmesnik

**Opis:** V orodno vrstico ob iskalniku in razvrščanju dodaj gumb "Izvozi v CSV" ter pod orodno vrstico dodaj izpis opozorila v primeru poskusa izvoza praznega seznama.

**Odgovorni član:** Klemen Skuhala

---

## US-JAN-01: Dodajanje nove kategorije med vnosom stroška

**Odgovorni član:** Jan Pečnik  
**Prioriteta:** Srednja  
**Ocena zahtevnosti:** 5 Story Points

### Uporabniška zgodba

Kot uporabnik želim med vnosom stroška ustvariti novo kategorijo, kadar ustrezna še ne obstaja, da jo lahko takoj uporabim pri stroških.

### Sprejemni kriteriji

1. **Given:** Pri vnosu stroška na seznamu kategorij ni želene kategorije.  
   **When:** Izberem "+ Dodaj novo kategorijo", vnesem ime "Hrana" in kliknem "Potrdi".  
   **Then:** Kategorija se shrani, pojavi se na seznamu kategorij in je izbrana v obrazcu za strošek.

2. **Given:** Kategorija "Hrana" že obstaja.  
   **When:** Poskusim dodati kategorijo "hrana" (z malo začetnico).  
   **Then:** Sistem kategorije ne podvoji, v obrazcu izbere obstoječo kategorijo "Hrana" in pod vnosnim poljem izpiše, da kategorija že obstaja.

3. **Given:** Odprto je okno za vnos nove kategorije.  
   **When:** Poskusim shraniti prazno ime ali ime, daljše od 30 znakov.  
   **Then:** Sistem ničesar ne shrani in pod vnosnim poljem izpiše sporočilo o napaki.

4. **Given:** Odprto je okno za vnos nove kategorije, v obrazcu za strošek pa sem že vnesel naziv in znesek.  
   **When:** Kliknem "Prekliči".  
   **Then:** Okno se zapre, nova kategorija se ne ustvari, naziv in znesek v obrazcu ostaneta nespremenjena.

### Podrobnosti implementacije

Backend: nov entitetni razred `Kategorija` (polji `id`, `naziv`), `KategorijaRepository` z metodo `findByNazivIgnoreCase` in `KategorijaController` z `GET /kategorije` ter `POST /kategorije`. Pri POST-u se naziv obreže, preveri se, da ni prazen in ni daljši od 30 znakov (sicer vrne napako 400), nato se preveri, ali kategorija že obstaja (velike in male črke se ne upoštevajo). Če obstaja, jo vrne in je ne podvoji.

Frontend (`App.jsx`): polje `kategorija` je spustni seznam, napolnjen iz `GET /kategorije`. Možnost "+ Dodaj novo kategorijo" odpre okno (`<dialog>`) z vnosnim poljem ter gumboma "Potrdi" in "Prekliči". Napake in obvestilo o že obstoječi kategoriji se izpišejo v oknu pod poljem. Pri podvojenem imenu frontend obstoječo kategorijo izbere v obrazcu.

Entiteta `Strosek` ostane nespremenjena, ker polje `kategorija` ostane besedilo. Tabelo `kategorija` ustvari Hibernate samodejno (`ddl-auto=update`).

### Podnaloge

#### 1. Backend: entiteta, repozitorij in controller za kategorije

**Opis:** Ustvari razred `Kategorija`, `KategorijaRepository` in `KategorijaController` z `GET /kategorije` ter `POST /kategorije`. V POST dodaj preverjanje praznega in predolgega imena (napaka 400) ter preverjanje podvojenega imena brez upoštevanja velikih črk.

**Odgovorni član:** Jan Pečnik

#### 2. Frontend: spustni seznam kategorij in okno za novo kategorijo

**Opis:** V `App.jsx` zamenjaj besedilno polje za kategorijo s spustnim seznamom, napolnjenim iz `GET /kategorije`. Dodaj možnost "+ Dodaj novo kategorijo", ki odpre okno z vnosnim poljem, gumboma "Potrdi" in "Prekliči" ter izpisom napak pod poljem.

**Odgovorni član:** Jan Pečnik

#### 3. Preveri sprejemne kriterije

**Opis:** Preveri dodajanje nove kategorije, podvojeno ime z drugačnimi velikimi črkami, prazno in predolgo ime ter preklic z ohranitvijo vnesenih podatkov v obrazcu.

**Odgovorni član:** Jan Pečnik