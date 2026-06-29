import React, { useState } from 'react';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Простая валидация
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setLoginMessage('Пожалуйста, введите корректный email');
    return;
  }
  if (!city) {
    setLoginMessage('Пожалуйста, укажите город');
    return;
  }

  try {
    const response = await fetch('http://localhost./login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, city }),
    });

    const result = await response.json();

    if (result.success) {
      setLoginMessage('Успешный вход!');
      onLogin({ email, city }); // Передаём данные в родительский компонент
      setTimeout(() => {
        onClose(); // Закрываем модальное окно после успешного входа
      }, 1500);
    } else {
      setLoginMessage(result.message || 'Ошибка при входе');
    }
  } catch (error) {
    console.error('Ошибка сети:', error);
    setLoginMessage('Не удалось подключиться к серверу');
  }
};
  return (
    <div className="modal-overlay">
      <div className="login-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Вход на сайт</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">Город:</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          {loginMessage && <p className="error-message">{loginMessage}</p>}
          <button type="submit" className="login-btn">Войти</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
