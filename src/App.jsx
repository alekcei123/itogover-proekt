import React, { useState } from 'react';
import { useNavigate, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';

import RegistrationForm from './components/RegistrationForm';
import HomePage from './components/HomePage';
import { TariffsPage } from './TariffsPage';
import { TariffDetailPage } from './TariffDetailPage';
import ProfilePage from './ProfilePage';
import QuestionnairePage from './QuestionnairePage';
import MeetPlaceScreen from './components/MeetPlaceScreen'; 
import UserProfileView from './UserProfileView'; 
import { ChatList } from './ChatList';      
import { ChatWindow } from './ChatWindow';  
import SearchPage from './SearchPage';

// ИСПРАВЛЕННЫЕ ИМПОРТЫ: добавлен путь ./components/
import SupportPanel from './components/SupportPanel';
import DevPanel from './components/DevPanel';

// Компонент защиты маршрутов
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    if (!cleanEmail || !cleanPassword) {
      setLoginMessage('Все поля обязательны');
      return;
    }
    try {
      const response = await fetch('http://localhost/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      console.log('Ответ сервера:', result);

      if (result.success) {
        if (result.user) {
          localStorage.setItem('currentUser', JSON.stringify(result.user));
          setCurrentUser(result.user);
        }
        setLoginMessage('');
        if (result.user?.role === 'developer') {
          navigate('/developer');
        } else if (result.user?.role === 'support') {
          navigate('/support');
        } else {
          navigate(`/profile/${cleanEmail}`);
        }
        setEmail('');
        setPassword('');
      } else {
        setLoginMessage(result.message || 'Неверный email или пароль');
      }
    } catch (err) {
      console.error(err);
      setLoginMessage('Сервер не отвечает. Проверьте, запущен ли Apache в XAMPP.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className='App'>
      <header className='main-header fixed'>
        <div className='container header-flex'>
          <Link to='/' className='logo' title='На главную'>
            <span>Donskie Matches</span> 
          </Link>
          <nav className='desktop-nav'>
            <ul className='nav-list'>
              <li><Link to='/' className='nav-link'>Главная</Link></li>
              {!currentUser && <li><Link to='/registration' className='nav-link'>Регистрация</Link></li>}
              <li><Link to='/tariffs' className='nav-link'>Тарифы</Link></li>
              {(currentUser?.role === 'user' || currentUser?.role === 'support' || currentUser?.role === 'developer') && (
                <>
                  <li><Link to='/chat' className='nav-link'>💬 Сообщения</Link></li>
                  <li><Link to='/search' className='nav-link'>🔍 Поиск</Link></li>
                </>
              )}
              {currentUser?.role === 'support' && (
                <li><Link to='/support' className='nav-link'>🛡️ Панель поддержки</Link></li>
              )}
              {currentUser?.role === 'developer' && (
                <li><Link to='/developer' className='nav-link'>⚙️ Панель разработчика</Link></li>
              )}
            </ul>
          </nav>
          <div className='login-form'>
            {currentUser ? (
              <button className="header-login-btn" onClick={handleLogout}>
                Выйти ({currentUser.email})
              </button>
            ) : (
              <form onSubmit={handleLogin}>
                <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type='password' placeholder='Пароль' value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button className="header-login-btn" type='submit'>Войти</button>
              </form>
            )}
            {loginMessage && <p className='error-message'>{loginMessage}</p>}
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/registration' element={<RegistrationForm />} />
          <Route path='/tariffs' element={<TariffsPage />} />
          <Route path='/tariff/:id' element={<TariffDetailPage />} />
          <Route path="/profile/:email" element={<ProfilePage />} />
          <Route path="/profile/questionnaire" element={<QuestionnairePage />} />
          <Route path="/meet-place" element={<MeetPlaceScreen />} />
          <Route path="/user/:userId" element={<UserProfileView />} />
          <Route path="/chat" element={<ChatList />} />
          <Route path="/chat/:userId" element={<ChatWindow />} />
          <Route path="/search" element={<SearchPage />} />

          <Route path="/support" element={
            <ProtectedRoute allowedRoles={['support', 'developer']}>
              <SupportPanel /> 
            </ProtectedRoute>
          } />
          <Route path="/developer" element={
            <ProtectedRoute allowedRoles={['developer']}>
              <DevPanel />
            </ProtectedRoute>
          } />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </main>

      <footer className='main-footer'>
        <div className='container'>
          <div className='footer-grid'>
            <div className='footer-brand'>
              <div className='logo'>Donskie Matches</div>
              <p>Сайт знакомств нового поколения!</p>
            </div>
            <nav className='footer-nav'>
              <h4>Навигация</h4>
              <Link to='/' className='nav-link'>Главная</Link>
              {!currentUser && <Link to='/registration' className='nav-link'>Регистрация</Link>}
              <Link to='/chat' className='nav-link'>💬 Сообщения</Link>
              <Link to='/search' className='nav-link'>🔍 Поиск</Link>
              {!currentUser && <Link to='/login' className='nav-link'>Войти</Link>}
            </nav>
            <div className='footer-contacts'>
              <h4>Контакты</h4>
              <p>Тел.: +7 850 302-45-11</p>
              <p>Email: info@site.ru</p>
            </div>
            <div className='footer-social'>
              <h4>Мы в соцсетях</h4>
              <a href='#' aria-label='Telegram'>Telegram</a>
              <a href='#' aria-label='VK'>VK</a>
            </div>
          </div>
          <div className='footer-bottom'></div>
        </div>
      </footer>
    </div>
  );
}

export default App;