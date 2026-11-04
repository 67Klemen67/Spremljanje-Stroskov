# Aplikacija za spremljanje stroškov (Expense Tracker)

## O projektu
Aplikacija "Spremljanje stroškov" je spletni sistem, namenjen beleženju, pregledovanju in upravljanju osebnih finančnih izdatkov. Glavni cilj projekta je uporabnikom omogočiti boljši pregled nad financami in načrtovanjem proračuna. Sistem podpira vse osnovne CRUD operacije nad stroški ter dodatne funkcionalnosti, kot sta dinamično iskanje po nazivu in razvrščanje podatkov po višini zneska. Projekt je zasnovan po strogo ločeni arhitekturi backend-a in frontend-a.

## Uporabljene tehnologije
**Zaledje (Backend):**
- **Java** (JDK 17+)
- **Spring Boot** (ogrodje za REST API)
- **Spring Data JPA** (za ORM in komunikacijo z bazo)
- **PostgreSQL** (relacijska podatkovna baza)
- **Swagger / springdoc-openapi** (v 2.2.0 - za dokumentacijo API-ja)

**Obličje (Frontend):**
- **React** (uporabniški vmesnik)
- **Vite** (gradbeno orodje in lokalni strežnik)
- **Node.js / npm** (paketni upravljalnik)

**Infrastruktura:**
- **Docker & Docker Compose** (za kontejnerizacijo podatkovne baze)

## Struktura projekta
Projekt je strogo ločen na obličje in zaledje:


📦 Vaja-Stroski (Glavna mapa)
 ┣ 📂 backend/               # Zaledni sistem (Spring Boot)
 ┃ ┣ 📂 src/main/java/...    # Izvorna koda (modeli, repozitoriji, kontrolerji)
 ┃ ┣ 📂 src/main/resources/  # Konfiguracije (application.properties)
 ┃ ┣ 📜 pom.xml              # Maven odvisnosti in nastavitve
 ┃ ┗ 📜 docker-compose.yml   # Skripta za zagon PostgreSQL baze
 ┣ 📂 frontend/              # Obličje (React)
 ┃ ┣ 📂 src/                 # Komponente in logika (App.jsx)
 ┃ ┣ 📜 package.json         # Seznam npm paketov in skript
 ┃ ┗ 📜 vite.config.js       # Vite konfiguracija
 ┗ 📜 README.md              # Dokumentacija projekta

 # Navodila za nameščanje in zagon
 Za uspešen zagon aplikacije moramo imeti nameščene naslednje predpostavke:
 
 **Java Development Kit (JDK) (version 17+)**
 **Node.js in npm**
 **Docker in Docker Desktop**

 # 1.Zagon podatkovne baze
 ## Odprite terminal in se pomaknite v mapo backend:
 cd backend
 ## Zaženite Docker vsebnik s PostgreSQL bazo:
 docker compose up -d
 (Baza bo samodejno ustvarjena s podatki iz docker-compose.yml, zaledje pa se bo nanjo povezalo preko nastavitev v application.properties).

 # 2. Zagon backenda (zaledja)
1. Prepričajte se, da ste v mapi **backend**.

2. Aplikacijo lahko zaženete preko vašega razvojnega okolja (npr. zagon StroskiApplication.java v IntelliJ IDEA / VS Code) ali preko Maven ukaza v terminalu.

3. Zaledje bo uspešno zagnano na: http://localhost:8080

4. Swagger dokumentacija bo na voljo na: http://localhost:8080/swagger-ui/index.html

# 3. Zagon frontenda (obličja)
1. Odprite nov terminal in se pomaknite v mapo frontend:
**cd frontend**

2. Namestite potrebne knjižnice:
**npm install**

3. Zaženite lokalni strežnik:
**npm run dev**

4. Aplikacija bo dosegljiva v brskalniku na: http://localhost:5173

# Navodila za razvijalce
## Delo z repozitorijem (GitHub Workflow)
Za prispevanje k projektu sledite standardnemu Git poteku dela:

1. Naredite klon repozitorija: git clone <povezava-do-repozitorija>

2. Za vsako novo funkcionalnost ustvarite novo vejo: git checkout -b feature/ime-funkcionalnosti

3. Redno potrjujte spremembe z jasnimi sporočili: git commit -m "Dodano iskanje po nazivu stroška"

4. Potisnite vejo na GitHub: git push origin feature/ime-funkcionalnosti

5. Ustvarite Pull Request (PR) in počakajte na pregled kode pred združevanjem v glavno (main) vejo.

## Standardi kodiranja

1. Spremenljivke in metode: Poimenovanja naj bodo opisna in v camelCase formatu (npr. naloziStroske).

2. Komentarji: Koda naj bo komentirana tam, kjer kompleksnost logike to zahteva, še posebej pri komunikaciji med FE in BE komponentami.

3. Arhitektura: Strogo ohranjajte ločenost! Frontend koda ne sme vsebovati nobenih direktnih klicev v podatkovno bazo, zaledje pa ne sme generirati HTML kode (vrača naj izključno JSON).