import { Trophy, Medal, Award, Flame } from 'lucide-react';

function UserList({ users, loading }) {
  if (loading) {
    return (
      <div className="card glass-panel empty-state">
        <div className="loader"></div>
        <p style={{ marginTop: '1rem' }}>Cargando ranking...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="card glass-panel empty-state">
        <Trophy size={48} className="text-secondary" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
        <h3>Aún no hay usuarios</h3>
        <p>Registra al primer usuario para comenzar la competencia.</p>
      </div>
    );
  }

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return <Trophy size={24} color="#facc15" />;
      case 1: return <Medal size={24} color="#94a3b8" />;
      case 2: return <Award size={24} color="#b45309" />;
      default: return <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>#{index + 1}</span>;
    }
  };

  return (
    <div className="card glass-panel" style={{ height: '100%' }}>
      <h2><Flame size={24} className="text-accent" style={{ color: '#ef4444' }} /> Global Leaderboard</h2>
      
      <div className="user-list">
        {users.map((user, index) => (
          <div key={user.id} className={`user-item ${index === 0 ? 'rank-1' : ''}`}>
            <div className="user-info">
              <div style={{ width: '30px', textAlign: 'center' }}>
                {getRankIcon(index)}
              </div>
              <div className="avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
            </div>
            <div className="points-badge">
              {user.points} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
