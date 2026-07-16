import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (!stored) {
      navigate('/login');
      return;
    }
    const u = JSON.parse(stored);
    setUser(u);

    // Загружаем анкету по user_id
    fetch(`http://localhost/get_profile.php?user_id=${u.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setProfile(data.profile);
      })
      .finally(() => setLoading(false));
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

      <p>
        <a href="/profile/questionnaire" style={{ textDecoration: 'none', color: '#007bff' }}>Редактировать анкету</a>
      </p>
    </div>
  );
};

export default ProfilePage;
