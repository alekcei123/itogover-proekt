import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likesStats, setLikesStats] = useState({ received: 0, sent: 0, matches: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (!stored) {
      navigate('/login');
      return;
    }
    const u = JSON.parse(stored);
    setUser(u);

    // Загружаем профиль
    fetch(`/api/get_profile.php?user_id=${u.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setProfile(data.profile);
        else console.error('Ошибка загрузки профиля:', data.message);
      })
      .catch(err => console.error('Ошибка сети:', err))
      .finally(() => setLoading(false));

    // Загружаем статистику лайков
    fetch(`/api/get_likes.php?user_id=${u.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setLikesStats({
            received: data.received?.length || 0,
            sent: data.sent?.length || 0,
            matches: data.matches?.length || 0
          });
        }
      })
      .catch(err => console.error('Ошибка загрузки лайков:', err));
  }, [navigate]);

  if (loading) return <p>Загрузка профиля...</p>;
  if (!user) return <p style={{ color: 'red' }}>Вы не авторизованы</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '24px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Мой профиль</h1>
      <p><strong>Email:</strong> {user.email}</p>
      {profile?.city && <p><strong>Город:</strong> {profile.city}</p>}
      {profile?.age && <p><strong>Возраст:</strong> {profile.age}</p>}
      {profile?.gender && <p><strong>Пол:</strong> {profile.gender}</p>}
      {profile?.interests && <p><strong>Интересы:</strong> {profile.interests}</p>}
      {profile?.about && <p><strong>О себе:</strong> <span style={{ whiteSpace: 'pre-line' }}>{profile.about}</span></p>}

      {/* Блок симпатий */}
      <div style={{ marginTop: '24px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>💞 Мои симпатии</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <span>❤️ Лайков мне: <strong>{likesStats.received}</strong></span>
          <span>❤️ Я лайкнул: <strong>{likesStats.sent}</strong></span>
          <span>💞 Взаимных: <strong>{likesStats.matches}</strong></span>
        </div>
        <Link to="/likes" style={{ display: 'inline-block', marginTop: '10px', color: '#d32f2f', fontWeight: 'bold' }}>
          Посмотреть все симпатии →
        </Link>
      </div>

      <p style={{ marginTop: '16px' }}>
        <Link to="/profile/questionnaire" style={{ textDecoration: 'none', color: '#007bff' }}>
          Редактировать анкету
        </Link>
      </p>
    </div>
  );
};

export default ProfilePage;