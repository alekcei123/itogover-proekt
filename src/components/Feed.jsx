// pages/Feed.jsx
// pages/Feed.jsx
import React, { useState, useEffect } from 'react';
import UserCard from '../components/UserCard'; // Импорт компонента выше

const Feed = () => {
  const [users, setUsers] = useState([]);
  const [commonInterests, setCommonInterests] = useState({});

  // 1. Сначала загружаем список пользователей (например, из другого API)
  useEffect(() => {
    const fetchUsers = async () => {
      // Пример: загружаем пользователей
      const res = await fetch('http://localhost/api/get-users.php'); 
      const data = await res.json();
      setUsers(data.data);
    };
    fetchUsers();
  }, []);

  // 2. Когда пользователи загружены, запрашиваем для них интересы
  useEffect(() => {
    if (users.length === 0) return;

    // ВАЖНО: Не делай цикл fetch внутри useEffect без ограничений!
    // Для MVP можно так, но помни про проблему N+1 запросов.
    users.forEach(user => {
      loadCommonInterests(user.id);
    });
  }, [users]);

  const loadCommonInterests = async (userId) => {
    try {
      const res = await fetch('http://localhost/api/get-recommendations.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      
      const data = await res.json();
      
      if (data.status === 'success') {
        setCommonInterests(prev => ({
          ...prev,
          [userId]: data.data // Сохраняем массив интересов для этого ID
        }));
      }
    } catch (err) {
      console.error('Ошибка загрузки интересов:', err);
    }
  };

  return (
    <div className="feed-container">
      <h2>Лента рекомендаций</h2>
      {users.length === 0 ? (
        <p>Загрузка...</p>
      ) : (
        users.map(user => (
          // Передаем в карточку и самого юзера, и объект с интересами
          <UserCard 
            key={user.id} 
            user={user} 
            commonInterests={commonInterests} 
          />
        ))
      )}
    </div>
  );
};

export default Feed;
