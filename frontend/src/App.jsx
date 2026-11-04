import { useState, useEffect, useCallback } from 'react';

function App() {
  const [stroski, setStroski] = useState([]);
  const [form, setForm] = useState({ naziv: '', znesek: '', kategorija: '' });
  const [editingId, setEditingId] = useState(null);
  
  // Novi stanji za DODATNI FUNKCIONALNOSTI
  const [iskanje, setIskanje] = useState('');
  const [sortiranje, setSortiranje] = useState('');

  const API_URL = 'http://localhost:8080/stroski';

  // Posodobljena fetch funkcija, ki v URL doda parametre
  const naloziStroske = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (iskanje) params.append('iskanje', iskanje);
      if (sortiranje) params.append('sortiranje', sortiranje);

      const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
      const response = await fetch(url);
      const data = await response.json();
      setStroski(data);
    } catch (error) {
      console.error("Napaka pri povezavi z zaledjem:", error);
    }
  }, [iskanje, sortiranje]);

  // Avtomatsko iskanje in sortiranje ob vsaki spremembi vnosa
  useEffect(() => {
    naloziStroske();
  }, [naloziStroske]);

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

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Spremljanje stroškov</h1>
      
      {/* Obrazec za vnos */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Naziv" value={form.naziv} required onChange={e => setForm({...form, naziv: e.target.value})} />
        <input type="number" step="0.01" placeholder="Znesek (€)" value={form.znesek} required onChange={e => setForm({...form, znesek: e.target.value})} />
        <input type="text" placeholder="Kategorija" value={form.kategorija} required onChange={e => setForm({...form, kategorija: e.target.value})} />
        <button type="submit">{editingId ? 'Posodobi' : 'Dodaj strošek'}</button>
      </form>

      {/* DODATNE FUNKCIONALNOSTI: Iskanje in Razvrščanje */}
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
      </div>
      
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