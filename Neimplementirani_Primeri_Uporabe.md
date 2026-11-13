# Podrobni opisi primerov uporabe, ki še niso implementirani – Spremljanje stroškov
 
Ta dokument vsebuje podrobne opise primerov uporabe iz diagrama primerov uporabe (DPU), ki v aplikaciji **še niso implementirani**

## Primer uporabe: Dodajanje nove kategorije
 
**ID:** PU-01
 
**Cilj:** Uporabnik med vnosom stroška ustvari novo kategorijo, ker ustrezna še ne obstaja, in jo takoj uporabi pri stroških.
 
**Akterji:** uporabnik, sistem (frontend, backend), podatkovna baza
 
**Predpogoji:**
- Aplikacija deluje in je povezana z bazo.
- Uporabnik pri vnosu stroška v seznamu ne najde želene kategorije.
**Stanje sistema po PU:** V bazi je nova kategorija. Ta je na voljo pri vnosu in urejanju stroškov. Če je uporabnik uspešno zaključil tudi vnos stroška, je v bazi tudi nov strošek s to kategorijo.
 
**Scenarij:**
1. Uporabnik pri vnosu stroška izbere možnost »Dodaj novo kategorijo«.
2. Sistem prikaže polje za vnos imena kategorije.
3. Uporabnik vnese ime kategorije in potrdi.
4. Sistem preveri, da je ime veljavno in še ne obstaja.
5. Sistem kategorijo shrani v bazo.
6. Sistem osveži seznam kategorij in novo kategorijo izbere v obrazcu za vnos stroška.
7. Uporabnik nadaljuje z vnosom stroška.
**Alternativni tokovi:**
- 3a. Uporabnik prekliče vnos, tako se nova kategorija ne ustvari, obrazec za strošek pa ostane nespremenjen.
- 4a. Kategorija z istim imenom (velike črke se ne upoštevajo) že obstaja, zato sistem je ne podvoji, obstoječo kategorijo izbere v obrazcu in uporabnika o tem obvesti.
**Izjeme:**
- Ime je prazno ali predolgo: sistem pokaže sporočilo o napaki in ničesar ne shrani.
- Baza ni dosegljiva: sistem pokaže »Kategorije ni bilo mogoče shraniti, poskusi znova.« Vneseni podatki o stroških ostanejo v obrazcu.
---
 
## Primer uporabe: Upravljanje kategorij
 
**ID:** PU-02
 
**Cilj:** Administrator vzdržuje enoten seznam kategorij: jih pregleduje, dodaja, preimenuje in briše.
 
**Akterji:** administrator, sistem (frontend, backend), podatkovna baza
 
**Predpogoji:**
- Aplikacija deluje in je povezana z bazo.
- Administrator ima dostop do administratorskega dela aplikacije.
**Stanje sistema po PU:** Seznam kategorij v bazi je spremenjen glede na izvedene akcije (nova, preimenovana ali izbrisana kategorija). Ob preimenovanju se pri obstoječih stroških prikaže novo ime.
 
**Scenarij:**
1. Administrator odpre stran za upravljanje kategorij.
2. Sistem prikaže seznam vseh kategorij (ime, število stroškov v kategoriji).
3. Administrator izbere akcijo (dodaj, preimenuj ali izbriši).
4. Za dodajanje ali preimenovanje vnese ime kategorije in potrdi.
5. Sistem preveri podatke in spremembo shrani v bazo.
6. Sistem osveži seznam in prikaže potrditev.
**Alternativni tokovi:**
- 3a. Administrator izbere brisanje kategorije brez stroškov, kjer sistem zahteva potrditev ter nato kategorijo izbriše.
- 3b. Administrator izbere brisanje kategorije, ki ima stroške, kjer sistem ponudi, da se stroški prenesejo v drugo kategorijo, ali da se brisanje prekliče.
- 4a. Administrator prekliče urejanje in se nič ne spremeni.
**Izjeme:**
- Ime je prazno ali že obstaja: sistem pokaže sporočilo o napaki in ničesar ne shrani.
- Kategorija ne obstaja več (npr. jo je že izbrisal drug administrator): sistem osveži seznam.
- Baza ni dosegljiva: sistem pokaže sporočilo o napaki, seznam ostane nespremenjen.
---
 
## Primer uporabe: Nastavitev proračuna
 
**ID:** PU-03
 
**Cilj:** Uporabnik določi, koliko denarja si v obdobju (npr. mesec) dovoli porabiti. Proračun se uporabi pri pregledu bilance.
 
**Akterji:** uporabnik, sistem (frontend, backend), podatkovna baza
 
**Predpogoji:** Aplikacija deluje in je povezana z bazo.
 
**Stanje sistema po PU:** V bazi je shranjen nov ali posodobljen proračun za izbrano obdobje.
 
**Scenarij:**
1. Uporabnik odpre stran »Proračun«.
2. Sistem prikaže trenutno nastavljen proračun (če obstaja).
3. Uporabnik vnese znesek proračuna in izbere obdobje.
4. Uporabnik klikne »Shrani«.
5. Sistem preveri, če je znesek pozitivno število.
6. Sistem proračun shrani v bazo.
7. Sistem prikaže potrditev in posodobljen proračun.
**Alternativni tokovi:**
- 2a. Proračun za izbrano obdobje še ni nastavljen, zato sistem prikaže prazen obrazec in pojasnilo, da proračuna še ni.
- 3a. Proračun za obdobje že obstaja, zato ga sistem ob shranjevanju prepiše z novim zneskom (posodobitev).
- 4a. Uporabnik prekliče in se nič ne shrani.
**Izjeme:**
- Znesek je prazen, ni število, je 0 ali negativen: sistem pokaže sporočilo o napaki in ničesar ne shrani.
- Baza ni dosegljiva: sistem pokaže »Proračuna ni bilo mogoče shraniti.«
---
 
## Primer uporabe: Pregled porabe po kategorijah
 
**ID:** PU-04
 
**Cilj:** Uporabnik vidi, koliko je porabil v posamezni kategoriji, da ugotovi, kje gre največ denarja.
 
**Akterji:** uporabnik, sistem (frontend, backend), podatkovna baza
 
**Predpogoji:** Aplikacija deluje in je povezana z bazo.
 
**Stanje sistema po PU:** Stanje sistema se ne spremeni (samo branje podatkov).
 
**Scenarij:**
1. Uporabnik odpre stran »Poraba po kategorijah«.
2. Frontend pošlje zahtevo backendu za vsoto stroškov po kategorijah.
3. Backend sešteje zneske stroškov in jih združi po kategorijah.
4. Sistem prikaže tabelo (in po želji graf): kategorija, skupni znesek, delež v celotni porabi.
**Alternativni tokovi:**
- 1a. Uporabnik izbere obdobje (npr. tekoči mesec) pri katerem sistem upošteva samo stroške tega obdobja.
- 3a. Ni nobenega stroška, zato sistem prikaže sporočilo »Ni zabeleženih stroškov.«
**Izjeme:**
- Backend ni dosegljiv ali pride do napake: sistem pokaže sporočilo o napaki in možnost ponovnega poskusa.
- Strošek brez kategorije: sistem ga prikaže pod »Brez kategorije«, da skupna vsota ostane pravilna.
---
 
## Primer uporabe: Pregled bilance
 
**ID:** PU-05
 
**Cilj:** Uporabnik vidi, koliko od nastavljenega proračuna je že porabil in koliko še ima na voljo.
 
**Akterji:** uporabnik, sistem (frontend, backend), podatkovna baza
 
**Predpogoji:**
- Aplikacija deluje in je povezana z bazo.
- Za izbrano obdobje je nastavljen proračun.
**Stanje sistema po PU:** Stanje sistema se ne spremeni (samo branje podatkov).
 
**Scenarij:**
1. Uporabnik odpre stran »Bilanca«.
2. Frontend zahteva bilanco za obdobje (privzeto tekoči mesec).
3. Backend prebere proračun in sešteje vse stroške v obdobju.
4. Backend izračuna bilanco: proračun minus skupni stroški.
5. Sistem prikaže proračun, skupno porabo in preostanek (ter odstotek porabljenega proračuna).
**Alternativni tokovi:**
- 3a. Proračun ni nastavljen, zato sistem prikaže skupno porabo in povezavo na nastavitev proračuna.
- 5a. Poraba presega proračun, zato sistem preostanek prikaže kot negativen in uporabnika opozori na preseženi proračun.
**Izjeme:**
- Backend ni dosegljiv ali pride do napake: sistem pokaže sporočilo o napaki in možnost ponovnega poskusa.
- Podatki v bazi so neveljavni (npr. strošek brez zneska): sistem take zapise preskoči in o tem obvesti.