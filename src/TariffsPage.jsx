import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function TariffsPage() {
  const [status, setStatus] = useState('Загрузка тарифов...');
  const [tariffs, setTariffs] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTariffs();
  }, []);

  const loadTariffs = async () => {
    setStatus('Загрузка тарифов...');
    setError(null);

    try {
      const response = await fetch('http://localhost/tariffs.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();

      // Защита от HTML вместо JSON
      if (text.trim().startsWith('<')) {
        console.error('Сервер вернул HTML вместо JSON:', text);
        throw new Error('Сервер вернул HTML вместо JSON. Проверьте URL и логи PHP.');
      }

      const data = JSON.parse(text);

      if (!data.success) {
        throw new Error(data.message || 'Ошибка на стороне сервера');
      }

      setTariffs(data.data || []);
      setStatus(`Тарифы успешно загружены (${(data.data || []).length} шт.)`);
    } catch (err) {
      console.error('Ошибка загрузки тарифов:', err);
      setError(err);
      setStatus('Ошибка загрузки: проверьте сервер и консоль');
    }
  };

  if (error) {
    return (
      <div className="tariff-container">
        <h2>Тарифы сайта знакомств</h2>
        <div id="status">{status}</div>
        <p className="error-message">Не удалось загрузить тарифы: {error.message}</p>
        <button className="btn" onClick={loadTariffs}>
          Обновить тарифы
        </button>
      </div>
    );
  }

  return (
    <div className="tariff-container">
      <h2>Тарифы сайта знакомств</h2>
      <div id="status">{status}</div>

      <div className="tariffs-grid" id="tariffs-container">
        {tariffs.length === 0 ? (
          <p>Тарифы не найдены</p>
        ) : (
          tariffs.map((tariff) => {
            // Исправляем key для фич: используем индекс только внутри карточки
            const featuresList = Array.isArray(tariff.features)
              ? tariff.features.map((f, idx) => (
                  <li key={`${tariff.id}-feature-${idx}`}>{f}</li>
                ))
              : [];

            return (
              <div
                key={tariff.id}
                className={`tariff-card ${tariff.price == 0 ? 'free' : ''}`}
              >
                <div className="tariff-header">
                  <h3>{tariff.title}</h3>
                  {tariff.price == 0 ? (
                    <span className="badge">Бесплатно</span>
                  ) : (
                    <p className="price">
                      {tariff.price} ₽ / {tariff.duration}
                    </p>
                  )}
                </div>
                <ul className="features-list">
                  {featuresList.length > 0 ? featuresList : <li>Нет особенностей</li>}
                </ul>
                <button
                  className="select-btn"
                  onClick={() => navigate(`/tariff/${tariff.id}`)}
                >
                  {tariff.price == 0 ? 'Активировать' : 'Выбрать тариф'}
                </button>
              </div>
            );
          })
        )}
      </div>

      <button id="reload-tariffs" className="btn" onClick={loadTariffs}>
        Обновить тарифы
      </button>
    </div>
  );
}
