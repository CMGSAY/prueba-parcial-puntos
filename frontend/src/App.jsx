import { useState, useEffect } from 'react';
import UserForm from './components/UserForm';
import PointsManager from './components/PointsManager';
import UserList from './components/UserList';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) throw new Error('Error al cargar usuarios');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserRegistered = (newUser) => {
    setUsers(prev => [...prev, newUser].sort((a, b) => b.points - a.points));
  };

  const handlePointsAdded = (updatedUser) => {
    setUsers(prev => 
      prev.map(u => u.id === updatedUser.id ? updatedUser : u)
          .sort((a, b) => b.points - a.points)
    );
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Leaderboard</h1>
        <p>Gestiona los puntos de tus usuarios en tiempo real</p>
      </header>

      {error && <div className="message error">{error}</div>}

      <div className="grid-layout">
        <aside className="sidebar">
          <UserForm onUserRegistered={handleUserRegistered} apiUrl={API_URL} />
          <PointsManager users={users} onPointsAdded={handlePointsAdded} apiUrl={API_URL} />
        </aside>

        <main className="main-content">
          <UserList users={users} loading={loading} />
        </main>
      </div>
    </div>
  );
}

export default App;
