import { useState, useEffect, useCallback } from 'react';

function App() {
  const [stroski, setStroski] = useState([]);
  const [vsiStroski, setVsiStroski] = useState([]);

  const [zacetnaBilanca, setZacetnaBilanca] = useState(
    () => localStorage.getItem('zacetnaBilanca') ?? ''
  );
  const [vnosBilance, setVnosBilance] = useState(
    () => localStorage.getItem('zacetnaBilanca') ?? ''
  );
  const [napakaBilance, setNapakaBilance] = useState('');
  const [napakaIzvoza, setNapakaIzvoza] = useState('');
  const [form, setForm] = useState({ naziv: '', znesek: '', kategorija: '' });
  const [editingId, setEditingId] = useState(null);
  
  // Novi stanji za DODATNI FUNKCIONALNOSTI
  const [iskanje, setIskanje] = useState('');
  const [sortiranje, setSortiranje] = useState('');

  const [kategorije, setKategorije] = useState([]);
  const [oknoOdprto, setOknoOdprto] = useState(false);
  const [novaKategorija, setNovaKategorija] = useState('');
  const [sporocilo, setSporocilo] = useState('');

  const API_URL = 'http://localhost:8080/stroski';
  const KATEGORIJE_URL = 'http://localhost:8080/kategorije';

  // Posodobljena fetch funkcija, ki v URL doda parametre
  const naloziStroske = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (iskanje) params.append('iskanje', iskanje);
      if (sortiranje) params.append('sortiranje', sortiranje);

      // Filtriran seznam je za tabelo, vsi stroški pa za pravilen izračun bilance.
      const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;

      const [response, vsiResponse] = await Promise.all([
        fetch(url),
        fetch(API_URL)
      ]);

      if (!response.ok || !vsiResponse.ok) {
        throw new Error('Stroškov ni bilo mogoče naložiti.');
      }

      const [data, vsi] = await Promise.all([
        response.json(),
        vsiResponse.json()
      ]);

      setStroski(data);
      setVsiStroski(vsi);
      if (data.length > 0) {
        setNapakaIzvoza('');
      }
    } catch (error) {
      console.error("Napaka pri povezavi z zaledjem:", error);
    }
  }, [iskanje, sortiranje]);

  // Avtomatsko iskanje in sortiranje ob vsaki spremembi vnosa
  useEffect(() => {
    naloziStroske();
  }, [naloziStroske]);

  useEffect(() => {
  fetch(KATEGORIJE_URL)
    .then(r => (r.ok ? r.json() : []))
    .catch(() => [])                    
    .then(setKategorije);
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setEditingId(null);
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    }
    setForm({ naziv: '', znesek: '', kategorija: '' });
    naloziStroske();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    naloziStroske();
  };

  const handleEdit = (strosek) => {
    setForm({ naziv: strosek.naziv, znesek: strosek.znesek, kategorija: strosek.kategorija });
    setEditingId(strosek.id);
  };

 const handleKategorija = (e) => {
  if (e.target.value === '__nova__') {
    setNovaKategorija('');
    setSporocilo('');
    setOknoOdprto(true);
    return;
  }
  setForm({ ...form, kategorija: e.target.value });
};

const zapriOkno = () => {
  setOknoOdprto(false);
  setNovaKategorija('');
  setSporocilo('');
};

const potrdiKategorijo = async () => {
  const naziv = novaKategorija.trim();

  if (naziv === '' || naziv.length > 30) {
    setSporocilo('Ime ne sme biti prazno ali daljše od 30 znakov.');
    return;
  }

  const obstojeca = kategorije.find(k => k.naziv.toLowerCase() === naziv.toLowerCase());
  if (obstojeca) {
    setForm({ ...form, kategorija: obstojeca.naziv });
    setSporocilo('Kategorija že obstaja, izbrana je obstoječa.');
    return;
  }

  try {
    const res = await fetch('http://localhost:8080/kategorije', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ naziv })
    });
    if (!res.ok) throw new Error('Napaka');
    const nova = await res.json();
    setKategorije([...kategorije, nova]);
    setForm({ ...form, kategorija: nova.naziv });
    zapriOkno();
  } catch (error) {
    setSporocilo('Kategorije ni bilo mogoče shraniti, poskusi znova.');
  }
};

  // Izračun skupnih stroškov in trenutne bilance in preverjanje pravilnosti vnosa začetne bilance
  const skupniStroski = vsiStroski.reduce(
    (skupaj, strosek) => skupaj + Number(strosek.znesek),
    0
  );

  const trenutnaBilanca =
    zacetnaBilanca === ''
      ? null
      : Number(zacetnaBilanca) - skupniStroski;

  const shraniBilanco = (e) => {
    e.preventDefault();

    const vrednost = Number(vnosBilance);

    if (
      vnosBilance.trim() === '' ||
      !Number.isFinite(vrednost) ||
      vrednost < 0
    ) {
      setNapakaBilance('Vnesi veljavno bilanco, ki je 0 ali več.');
      return;
    }

    const shranjenaVrednost = String(vrednost);

    localStorage.setItem('zacetnaBilanca', shranjenaVrednost);
    setZacetnaBilanca(shranjenaVrednost);
    setVnosBilance(shranjenaVrednost);
    setNapakaBilance('');
  };

  // Izvoz trenutno prikazanih stroškov v CSV datoteko (US-KLE-01)
  const izvoziVCsv = () => {
    if (stroski.length === 0) {
      setNapakaIzvoza('Izvoz ni mogoč, ker na seznamu ni nobenega stroška.');
      return;
    }

    setNapakaIzvoza('');

    const glava = ['ID', 'Naziv', 'Znesek (EUR)', 'Kategorija'];
    const vrstice = stroski.map(s => [
      s.id,
      `"${String(s.naziv).replace(/"/g, '""')}"`,
      Number(s.znesek).toFixed(2),
      `"${String(s.kategorija).replace(/"/g, '""')}"`
    ]);

    const csvVsebina = [
      glava.join(';'),
      ...vrstice.map(v => v.join(';'))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvVsebina], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const povezava = document.createElement('a');
    povezava.href = url;
    povezava.setAttribute('download', 'stroski.csv');
    document.body.appendChild(povezava);
    povezava.click();
    document.body.removeChild(povezava);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Spremljanje stroškov</h1>
      {oknoOdprto && (
      <dialog open>
        <h3>Nova kategorija</h3>
        <input
          type="text"
          autoFocus
          placeholder="Ime nove kategorije"
          value={novaKategorija}
          onChange={e => setNovaKategorija(e.target.value)}
        />
        {sporocilo && <p role="alert">{sporocilo}</p>}
        <button type="button" onClick={zapriOkno}>Prekliči</button>
        <button type="button" onClick={potrdiKategorijo}>Potrdi</button>
      </dialog>
    )}
      {/* Obrazec za začetno bilanco */}
      <form onSubmit={shraniBilanco} style={{ marginBottom: '20px' }}>
        <label htmlFor="zacetna-bilanca">Začetna bilanca (€): </label>
        <input
          id="zacetna-bilanca"
          type="number"
          min="0"
          step="0.01"
          required
          value={vnosBilance}
          onChange={e => setVnosBilance(e.target.value)}
        />
        <button type="submit">Shrani bilanco</button>
      </form>

      {napakaBilance && <p role="alert">{napakaBilance}</p>}

      {trenutnaBilanca !== null && (
        <div>
          <p>Začetna bilanca: {Number(zacetnaBilanca).toFixed(2)} €</p>
          <p>Trenutna bilanca: {trenutnaBilanca.toFixed(2)} €</p>
        </div>
      )}
      
      {/* Obrazec za vnos */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Naziv" value={form.naziv} required onChange={e => setForm({...form, naziv: e.target.value})} />
        <input type="number" step="0.01" placeholder="Znesek (€)" value={form.znesek} required onChange={e => setForm({...form, znesek: e.target.value})} />
        <select value={form.kategorija} required onChange={handleKategorija}>
          <option value="">Izberi kategorijo</option>
          {kategorije.map(k => <option key={k.id} value={k.naziv}>{k.naziv}</option>)}
          <option value="__nova__">+ Dodaj novo kategorijo</option>
        </select>
        <button type="submit">{editingId ? 'Posodobi' : 'Dodaj strošek'}</button>
      </form>

      {/* DODATNE FUNKCIONALNOSTI: Iskanje, Razvrščanje in Izvoz v CSV */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '15px', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
        <input 
          type="text" 
          placeholder="🔍 Išči po nazivu..." 
          value={iskanje} 
          onChange={e => setIskanje(e.target.value)} 
          style={{ padding: '5px', flex: 1 }}
        />
        <select value={sortiranje} onChange={e => setSortiranje(e.target.value)} style={{ padding: '5px' }}>
          <option value="">Brez razvrščanja</option>
          <option value="znesekAsc">Znesek: od najnižjega</option>
          <option value="znesekDesc">Znesek: od najvišjega</option>
        </select>
        <button type="button" onClick={izvoziVCsv} style={{ padding: '5px 12px', cursor: 'pointer' }}>
          Izvozi v CSV
        </button>
      </div>

      {napakaIzvoza && (
        <p role="alert" style={{ color: '#b00020', fontWeight: 'bold', marginBottom: '15px' }}>
          {napakaIzvoza}
        </p>
      )}
      
      {/* Tabela */}
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr>
            <th>ID</th><th>Naziv</th><th>Znesek (€)</th><th>Kategorija</th><th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {stroski.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td><td>{s.naziv}</td><td>{s.znesek}</td><td>{s.kategorija}</td>
              <td>
                <button onClick={() => handleEdit(s)} style={{ marginRight: '5px' }}>Uredi</button>
                <button onClick={() => handleDelete(s.id)}>Izbriši</button>
              </td>
            </tr>
          ))}
          {stroski.length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Ni zabeleženih stroškov (ali zadetkov iskanja).</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;