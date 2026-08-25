import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Chat.css'; // импорт стилей

export function ChatList() {
  const [dialogs, setDialogs] = useState([]);
  const userId = JSON.parse(localStorage.getItem('currentUser'))?.id;

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/get_dialogs.php?user_id=${userId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setDialogs(data.dialogs);
      })
      .catch(console.error);
  }, [userId]);

  return (
    <div className="chat-page">
      <div className="dialogs-list">
        <div className="dialogs-header">💬 Мои диалоги</div>
        {dialogs.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>
            Нет сообщений
          </div>
        )}
        {dialogs.map(d => (
          <Link to={`/chat/${d.other_user}`} key={d.other_user} className="dialog-item">
            <img
              src={d.photo ? '/' + d.photo : '/no-photo.png'}
              alt=""
              className="dialog-avatar"
              onError={(e) => (e.target.src = '/no-photo.png')}
            />
            <div className="dialog-info">
              <div className="dialog-name">{d.username}</div>
              <div className="dialog-last-msg">{d.last_message || '…'}</div>
            </div>
            <div className="dialog-time">
              {d.last_time ? new Date(d.last_time).toLocaleTimeString() : ''}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}