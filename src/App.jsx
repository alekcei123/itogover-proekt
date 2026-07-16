import React, { useState } from 'react';
import { useNavigate, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';

import RegistrationForm from './components/RegistrationForm';
import { TariffsPage } from './TariffsPage';
import { TariffDetailPage } from './TariffDetailPage';
import ProfilePage from './ProfilePage';
import QuestionnairePage from './QuestionnairePage';

import couple1 from './assets/3e01cbbf2d48c583d5ae9a24e3fdc4af.jpg';
import couple2 from './assets/7aa293b0d8266a5301e75094a34cc478.jpg';
import couple3 from './assets/happy-couple-love-mountains_289836-193.avif';
import couple4 from './assets/825f959a3d3aa77ff21a846676366be8.jpg';
import couple5 from './assets/beautiful-couple-spend-time-summer-park_1157-22870.avif';

const couplesData = [
  { id: 1, name: 'Игорь и Алина', year: 2010, meetingPlace: 'на квест‑хоре', description: 'Часто ходят на разные квесты, обожают фильмы про Шерлока Холмса', image: couple3 },
  { id: 2, name: 'Степан и Люба', year: 2008, meetingPlace: 'на концерте Басты', description: 'Оба ярые фанаты Николая Вакуленко и любят свой город (Ростов‑на‑Дону)', image: couple1 },
  { id: 3, name: 'Андрей и Ирина', year: 2020, meetingPlace: 'оба творческой профессии', description: 'Андрей — художник, Ирина поёт в хоре. Оба горят своей мечтой и идут к ней.', image: couple2 },
  { id: 4, name: 'Егор и Дарья', year: 2025, meetingPlace: 'оба любят музыку', description: 'Егор музыкальный продюсер, Дарья играет в рок‑группе', image: couple5 },
  { id: 5, name: 'Алексей и Света', year: 2018, meetingPlace: 'любят горы', description: 'Ходили на Эверест, поднимались на Приэльбрусье', image: couple4 },
];

function App() {
  const navigate = useNavigate();

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Ответ сервера:', result);

      if (result.success) {
        if (result.user) {
          localStorage.setItem('currentUser', JSON.stringify(result.user));
        }
        navigate(`/profile/${cleanEmail}`);
        setLoginMessage('');
      } else {
        setLoginMessage(result.message || 'Неверный email или пароль');
      }
    } catch (err) {
      console.error(err);
      setLoginMessage('Сервер не отвечает. Проверьте, запущен ли Apache в XAMPP.');
    }
  };

  return (
    <div className='App'>
      <header className='main-header fixed'>
        <div className='container header-flex'>
          <Link to='/' className='logo' title='На главную'>
            <span>Madagascar</span> DATING SITE
          </Link>
          <nav className='desktop-nav'>
            <ul className='nav-list'>
              <li><Link to='/' className='nav-link'>Главная</Link></li>
              <li><Link to='/registration' className='nav-link'>Регистрация</Link></li>
              <li><Link to='/tariffs' className='nav-link'>Тарифы</Link></li>
            </ul>
          </nav>

          <div className='login-form'>
            <form onSubmit={handleLogin}>
              <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type='password' placeholder='Пароль' value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type='submit'>Войти</button>
            </form>
            {loginMessage && <p className='error-message'>{loginMessage}</p>}
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route
            path='/'
            element={
              <>
                <section className='card'>
                  <h1>Сайт знакомств нового поколения</h1>
                  <h2>Мы учли опыт всех сайтов знакомств и создали Madagascar. Более 1000 анкет девушек и парней — присоединяйтесь к нам!</h2>
                </section>

                <div className='photo-grid'>
                  {couplesData.map((couple) => (
                    <article key={couple.id} className='photo-card'>
                      <img className='wrapper' src={couple.image} alt={couple.name} />
                      <p>{couple.name}</p>
                      <h3>Познакомились в {couple.year} году, {couple.meetingPlace}</h3>
                      <p>{couple.description}</p>
                    </article>
                  ))}
                </div>

                <Link to='/registration' className='slogan-btn'>
                  Не скучайте в одиночестве — присоединяйтесь к нам!
                </Link>
              </>
            }
          />
          <Route path='/registration' element={<RegistrationForm />} />
          <Route path='/tariffs' element={<TariffsPage />} />
          <Route path='/tariff/:id' element={<TariffDetailPage />} />
          <Route path="/profile/:email" element={<ProfilePage />} />
          <Route path="/profile/questionnaire" element={<QuestionnairePage />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </main>

      <footer className='main-footer'>
        <div className='container'>
          <div className='footer-grid'>
            <div className='footer-brand'>
              <div className='logo'>Madagascar</div>
              <p>Сайт знакомств нового поколения!</p>
            </div>
            <nav className='footer-nav'>
              <h4>Навигация</h4>
              <Link to='/' className='nav-link'>Главная</Link>
              <Link to='/registration' className='nav-link'>Регистрация</Link>
              <Link to='/login' className='nav-link'>Войти</Link>
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
          <div className='footer-bottom'>
            <p>&copy; 2025 Название компании. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
