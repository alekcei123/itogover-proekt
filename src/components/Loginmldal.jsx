import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [loginMessage, setLoginMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLoginMessage('Пожалуйста, введите корректный email');
      return;
    }
    if (!password) {
      setLoginMessage('Пожалуйста, укажите пароль');
      return;
    }

    try {
      // ✅ Используем относительный путь через прокси (как в регистрации)
      const response = await fetch('/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        setLoginMessage('Успешный вход!');
        
        // ИЗМЕНЕНИЕ 1: Получаем полный объект пользователя с бэкенда
        const userData = result.user; 
        
        // ИЗМЕНЕНИЕ 2: Сохраняем пользователя в localStorage (чтобы другие компоненты знали его роль)
        localStorage.setItem('user', JSON.stringify(userData));

        // ИЗМЕНЕНИЕ 3: Передаем наверх полный объект, а не только email
        onLogin(userData); 

        setTimeout(() => {
          // ИЗМЕНЕНИЕ 4: Динамический редирект в зависимости от роли
          const role = userData?.role || 'user';
          
          if (role === 'developer') {
            navigate('/developer'); // Панель разработчика
          } else if (role === 'support') {
            navigate('/support');   // Панель поддержки
          } else {
            navigate('/profile');   // Обычный пользователь (или замените на '/')
          }
        }, 1500);
      } else {
        setLoginMessage(result.message || 'Ошибка входа: неверный email или пароль');
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
      setLoginMessage('Не удалось подключиться к серверу. Проверьте, запущен ли Apache.');
    }
  };

  if (!isOpen) return null;

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
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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