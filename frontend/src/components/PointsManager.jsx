import { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';

function PointsManager({ users, onPointsAdded, apiUrl }) {
  const [userId, setUserId] = useState('');
  const [points, setPoints] = useState(10);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${apiUrl}/users/add-points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, points: Number(points) })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al sumar puntos');
      }

      setStatus({ type: 'success', message: '¡Puntos añadidos!' });
      onPointsAdded(data);
      
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card glass-panel">
      <h2><PlusCircle size={20} className="text-success" /> Asignar Puntos</h2>
      
      {status.message && (
        <div className={`message ${status.type}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="user-select">Seleccionar Usuario</label>
          <select 
            id="user-select"
            className="input-field" 
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            disabled={loading || users.length === 0}
          >
            <option value="">-- Selecciona --</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.points} pts)
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="points">Cantidad de Puntos</label>
          <input 
            type="number" 
            id="points"
            className="input-field" 
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            min="1"
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-success" disabled={loading || !userId || users.length === 0}>
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sumar Puntos'}
        </button>
      </form>
    </div>
  );
}

export default PointsManager;
