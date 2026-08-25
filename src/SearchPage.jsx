import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SearchPage.css'; // стили ниже

const SearchPage = () => {
  const [filters, setFilters] = useState({
    city: '',
    ageMin: '',
    ageMax: '',
    interest: '',
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Получаем ID текущего пользователя из localStorage
  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setCurrentUserId(user.id);
      } catch (e) {
        console.warn('Не удалось распарсить currentUser');
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    // Собираем параметры, исключая пустые
    const params = new URLSearchParams();
    if (filters.city.trim()) params.append('city', filters.city.trim());
    if (filters.ageMin) params.append('ageMin', filters.ageMin);
    if (filters.ageMax) params.append('ageMax', filters.ageMax);
    if (filters.interest.trim()) params.append('interest', filters.interest.trim());
    if (currentUserId) params.append('user_id', currentUserId);

    try {
      const response = await fetch(`/api/search_users.php?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.success) {
        setResults(data.users || []);
      } else {
        throw new Error(data.message || 'Ошибка при поиске');
      }
    } catch (err) {
      console.error('Ошибка поиска:', err);
      setError(err.message || 'Не удалось выполнить поиск');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h1 className="search-title">🔍 Поиск людей</h1>
        <p className="search-subtitle">Найдите идеального собеседника по интересам, возрасту и городу</p>

        <form className="search-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">Город</label>
              <input
                type="text"
                id="city"
                name="city"
                value={filters.city}
                onChange={handleChange}
                placeholder="Например: Ростов-на-Дону"
              />
            </div>
            <div className="form-group age-group">
              <label>Возраст</label>
              <div className="age-inputs">
                <input
                  type="number"
                  name="ageMin"
                  value={filters.ageMin}
                  onChange={handleChange}
                  placeholder="От"
                  min="16"
                  max="99"
                />
                <span>—</span>
                <input
                  type="number"
                  name="ageMax"
                  value={filters.ageMax}
                  onChange={handleChange}
                  placeholder="До"
                  min="16"
                  max="99"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="interest">Интерес</label>
              <input
                type="text"
                id="interest"
                name="interest"
                value={filters.interest}
                onChange={handleChange}
                placeholder="Например: спорт, кино"
              />
            </div>
          </div>
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? '⏳ Ищем...' : '🔎 Искать'}
          </button>
        </form>

        {error && <div className="search-error">{error}</div>}

        <div className="results-section">
          {loading && <div className="loading-state">⏳ Загрузка результатов...</div>}

          {!loading && results.length === 0 && (
            <div className="empty-state">
              <p>Пока никого не нашли. Попробуйте изменить параметры поиска.</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="results-header">
                <h3>Найдено {results.length} человек</h3>
              </div>
              <div className="results-grid">
                {results.map((user) => (
                  <div key={user.id} className="user-card">
                    <img
                      src={user.photo ? `/${user.photo}` : '/no-photo.png'}
                      alt={user.username}
                      className="user-avatar"
                      onError={(e) => (e.target.src = '/no-photo.png')}
                    />
                    <div className="user-info">
                      <div className="user-name">{user.username}</div>
                      <div className="user-details">
                        <span>📍 {user.city || 'не указан'}</span>
                        <span>•</span>
                        <span>👤 {user.age} лет</span>
                      </div>
                      {user.interests && (
                        <div className="user-interests">
                          {user.interests.split(',').map((tag, idx) => (
                            <span key={idx} className="interest-tag">{tag.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Link to={`/user/${user.id}`} className="profile-link">
                      Посмотреть профиль
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;