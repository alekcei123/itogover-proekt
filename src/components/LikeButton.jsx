import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LikeButton.css';

const LikeButton = ({ targetUserId, currentUserId, onLike }) => {
  const [liked, setLiked] = useState(false);
  const [match, setMatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Проверяем, лайкал ли уже этот пользователь
  useEffect(() => {
    const checkLike = async () => {
      try {
        // ИЗМЕНЕНИЕ: Добавлен полный путь к серверу XAMPP (порт 80)
        const res = await fetch(`http://localhost/get_likes.php?user_id=${currentUserId}`);
        const data = await res.json();
        if (data.success) {
          const alreadyLiked = data.sent.some(item => item.id === targetUserId);
          setLiked(alreadyLiked);
        }
      } catch (e) {
        console.error('Ошибка проверки лайка:', e);
      }
    };
    if (currentUserId && targetUserId) {
      checkLike();
    }
  }, [currentUserId, targetUserId]);

  const handleLike = async () => {
    if (loading || liked) return;
    setLoading(true);

    try {
      // ИЗМЕНЕНИЕ: Добавлен полный путь к серверу XAMPP (порт 80)
      const res = await fetch('http://localhost/like_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          liker_id: currentUserId,
          liked_id: targetUserId
        })
      });

      const data = await res.json();

      if (data.success) {
        setLiked(true);
        if (data.match) {
          setMatch(true);
          alert('🎉 Взаимная симпатия! Перейдите в чат, чтобы познакомиться.');
        }
        if (onLike) onLike(data);
      } else {
        alert(data.message || 'Ошибка при лайке');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Не удалось поставить лайк. Проверьте соединение.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="like-button-wrapper">
      <button
        className={`like-btn ${liked ? 'liked' : ''} ${match ? 'match' : ''}`}
        onClick={handleLike}
        disabled={loading || liked}
      >
        {loading ? '⏳' : liked ? (match ? '💞 Взаимно!' : '❤️ Лайкнут') : '🤍 Лайк'}
      </button>
      {match && (
        <div className="match-badge">
          💞 Взаимная симпатия!
        </div>
      )}
    </div>
  );
};

export default LikeButton;