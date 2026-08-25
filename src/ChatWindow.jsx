import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './Chat.css';

export function ChatWindow() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const containerRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;
    fetch(`/api/get_user_by_id.php?user_id=${userId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setOtherUser(data.user);
      });
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadMessages = () => {
    if (!currentUser) return;
    fetch(`/api/get_messages.php?user1=${currentUser.id}&user2=${userId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setMessages(data.messages);
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
          }, 100);
        }
      })
      .catch(console.error);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const res = await fetch('/api/send_message.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_id: currentUser.id,
        receiver_id: parseInt(userId),
        message: newMessage.trim()
      })
    });
    if (res.ok) {
      setNewMessage('');
      loadMessages();
    }
  };

  if (!otherUser) return <div className="chat-page" style={{ textAlign: 'center', padding: '2rem' }}>Загрузка...</div>;

  return (
    <div className="chat-page">
      <div className="chat-window">
        <div className="chat-header">
          <img
            src={otherUser.photo ? '/' + otherUser.photo : '/no-photo.png'}
            alt=""
            className="chat-header-avatar"
            onError={(e) => (e.target.src = '/no-photo.png')}
          />
          <span className="chat-header-name">{otherUser.username}</span>
        </div>

        <div className="chat-messages" ref={containerRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.sender_id === currentUser.id ? 'message-sent' : 'message-received'
              }`}
            >
              {msg.message}
              <div className="message-time">
                {new Date(msg.created_at).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        <form className="chat-input-area" onSubmit={sendMessage}>
          <input
            type="text"
            className="chat-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение..."
          />
          <button type="submit" className="chat-send-btn">
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
}