// src/pages/QuestionnairePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuestionnairePage = () => {
  const [formData, setFormData] = useState({
    city: '',
    age: 0,
    interests: '',
    about: '',
    gender: 'other',
  });
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  // При загрузке берём user из localStorage (результат login.php)
  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (!stored) {
      navigate('/login'); // если нет авторизации — на логин
      return;
    }
    const user = JSON.parse(stored);
    // Если у пользователя уже есть анкета — загружаем её (опционально)
    fetch(`http://localhost/get_profile.php?user_id=${user.id}`, { method: 'GET' })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.profile) {
          setFormData(data.profile);
        }
      })
      .catch(() => {}); // если анкеты ещё нет — оставляем форму пустой
  }, [navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Для теста жёстко ставим user_id = 1. Позже замени на получение из localStorage/сессии
  const payload = {
    user_id: 1, 
    city: formData.city,
    age: parseInt(formData.age) || 0,
    interests: formData.interests,
    about: formData.about,
    gender: formData.gender,
  };

  try {
    const res = await fetch('http://localhost/save_profile.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Обязательно
      },
      body: JSON.stringify(payload), // Обязательно
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Server error:', data);
      alert('Ошибка: ' + (data.debug_message || data.error));
      return;
    }

    console.log('Success:', data);
    alert('Анкета сохранена!');
    // Тут можно редирект или сброс формы
  } catch (err) {
    console.error('Fetch error:', err);
    alert('Ошибка сети: проверь, запущен ли XAMPP и доступен ли localhost');
  }
};
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>{formData.city || formData.about ? 'Редактировать анкету' : 'Заполните анкету'}</h2>
      {status && status !== 'saving' && <p style={{ color: 'red' }}>{status}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label>Город *</label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Возраст *</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: Number(e.target.value) }))}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            min="13"
            max="120"
            required
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Пол *</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          >
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
            <option value="other">Другой</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Интересы (через запятую):</label>
          <input
            type="text"
            value={formData.interests}
            onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>О себе:</label>
          <textarea
            value={formData.about}
            onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
            rows="4"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'saving'}
          style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
        >
          {status === 'saving' ? 'Сохраняем...' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
};

export default QuestionnairePage;
