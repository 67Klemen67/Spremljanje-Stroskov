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