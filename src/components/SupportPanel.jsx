import React, { useState, useEffect } from 'react';
import './Panels.css'; 


const API_URL = 'http://127.0.0.1/api';

const SupportPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        // ИЗМЕНЕНИЕ: Используем полный путь
        const res = await fetch(`${API_URL}/get_users.php`);
        if (!res.ok) throw new Error('Сервер не отвечает');
        
        const data = await res.json();
        
        if (data.status === 'success' && Array.isArray(data.data)) {
          const formattedUsers = data.data.map(user => ({
            ...user,
            status: user.is_banned == 1 ? 'Забанена' : 'Активна',
            complaints: user.complaints || 0 
          }));
          setUsers(formattedUsers);
          setError(null);
        } else {
          throw new Error('Неверный формат данных от API');
        }
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  
  const toggleBan = async (id) => {
    const userToUpdate = users.find(user => user.id === id);
    if (!userToUpdate) return;

    const newStatus = userToUpdate.status === 'Забанена' ? 'Активна' : 'Забанена';
    const newIsBanned = newStatus === 'Забанена' ? 1 : 0;

    setUsers(prevUsers => prevUsers.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ));

    try {
      
      const response = await fetch(`${API_URL}/ban_user.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: id, is_banned: newIsBanned }),
      });

      if (!response.ok) throw new Error('Ошибка сети');
      const result = await response.json();

      if (!result.success) {
        setUsers(prevUsers => prevUsers.map(user => 
          user.id === id ? { ...user, status: userToUpdate.status } : user
        ));
        alert('Не удалось обновить статус: ' + (result.message || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Ошибка API:', error);
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === id ? { ...user, status: userToUpdate.status } : user
      ));
      alert('Ошибка соединения с сервером');
    }
  };

  const bannedCount = users.filter(u => u.status === 'Забанена').length;
  const activeCount = users.filter(u => u.status === 'Активна').length;

  const getRoleBadge = (role) => {
    if (role === 'developer') return <span className="badge badge-developer">Разработчик</span>;
    if (role === 'support') return <span className="badge badge-support">Поддержка</span>;
    return <span className="badge badge-user">Пользователь</span>;
  };

  return (
    <div className="panel-container">
      <header className="panel-header">
        <h1>🛡️ Панель поддержки</h1>
        <p>Управление пользователями, обработка жалоб и банов</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card"><h3>Всего пользователей</h3><p className="stat-value">{users.length}</p></div>
        <div className="stat-card"><h3>Активных</h3><p className="stat-value" style={{ color: '#4caf50' }}>{activeCount}</p></div>
        <div className="stat-card"><h3>Забаненных</h3><p className="stat-value" style={{ color: '#f44336' }}>{bannedCount}</p></div>
      </div>

      {loading ? (
        <div className="card loading-state">Загрузка списка пользователей...</div>
      ) : error ? (
        <div className="card error-state"><p>Не удалось загрузить данные.</p><p><strong>Ошибка:</strong> {error}</p></div>
      ) : (
        <div className="card table-card">
          <div className="card-header"><h3>📋 Список пользователей</h3></div>
          <table className="panel-table">
            <thead>
              <tr><th>ID</th><th>Никнейм</th><th>Email</th><th>Роль</th><th>Статус</th><th>Жалобы</th><th>Действия</th></tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>{user.status}</td>
                  <td>{user.complaints > 0 ? <span style={{color: 'red', fontWeight: 'bold'}}>{user.complaints}</span> : 0}</td>
                  <td>
                    <button 
                      className={`btn ${user.status === 'Забанена' ? 'btn-green' : 'btn-red'}`}
                      onClick={() => toggleBan(user.id)}
                    >
                      {user.status === 'Забанена' ? 'Разбанить' : 'Забанить'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SupportPanel;