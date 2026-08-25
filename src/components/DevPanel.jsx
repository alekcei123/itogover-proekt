import React, { useState, useEffect } from 'react';
import './Panels.css';

const DevPanel = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ users: 0, requests: 0, uptime: '0%' });
  const [settings, setSettings] = useState({ siteName: 'Donskie Matches', maintenanceMode: false });

  // Загрузка данных (ЗАМЕНИТЕ НА FETCH К ВАШЕМУ PHP)
  useEffect(() => {
    // Эмуляция запроса к серверу
    setTimeout(() => {
      setLogs([
        { id: 1, time: '13:00:01', message: 'Пользователь Настя (id:3) вошла в систему', type: 'info' },
        { id: 2, time: '13:01:12', message: 'Выполнен запрос /api/get_recommendations.php', type: 'success' },
        { id: 3, time: '13:02:45', message: 'Ошибка 500: Некорректный запрос к БД', type: 'error' },
        { id: 4, time: '13:05:00', message: 'Кэш приложения обновлен', type: 'info' },
      ]);
      setStats({ users: 150, requests: 2300, uptime: '99.9%' });
    }, 500);
  }, []);

  // Функция очистки логов (ЗАМЕНИТЕ НА FETCH К PHP)
  const handleClearLogs = () => {
    if (window.confirm('Вы уверены, что хотите очистить логи?')) {
      setLogs([]);
      alert('Логи очищены!');
    }
  };

  // Функция переключения режима обслуживания (ЗАМЕНИТЕ НА FETCH)
  const toggleMaintenance = () => {
    setSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
  };

  // Рендеринг логов с цветом
  const getLogClass = (type) => {
    if (type === 'error') return 'log-error';
    if (type === 'success') return 'log-success';
    return 'log-info';
  };

  return (
    <div className="panel-container dev-mode">
      <header className="panel-header">
        <h1>⚙️ Панель разработчика</h1>
        <p>Управление системой, логирование и технические настройки</p>
      </header>

      {/* Блок статистики */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Всего пользователей</h3>
          <p className="stat-value">{stats.users}</p>
        </div>
        <div className="stat-card">
          <h3>Запросов за час</h3>
          <p className="stat-value">{stats.requests}</p>
        </div>
        <div className="stat-card">
          <h3>Аптайм</h3>
          <p className="stat-value">{stats.uptime}</p>
        </div>
      </div>

      <div className="panel-grid">
        {/* Логи системы */}
        <div className="card log-card">
          <div className="card-header">
            <h3>📜 Логи системы</h3>
            <button className="btn btn-danger" onClick={handleClearLogs}>Очистить логи</button>
          </div>
          <div className="log-list">
            {logs.length > 0 ? (
              logs.map(log => (
                <div key={log.id} className={`log-item ${getLogClass(log.type)}`}>
                  <span className="log-time">[{log.time}]</span>
                  <span>{log.message}</span>
                </div>
              ))
            ) : (
              <p className="empty-text">Логи пусты. Запись остановлена.</p>
            )}
          </div>
        </div>

        {/* Настройки системы */}
        <div className="card settings-card">
          <h3>⚡ Настройки системы</h3>
          
          <div className="setting-row">
            <label>Название сайта:</label>
            <input 
              type="text" 
              value={settings.siteName} 
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>

          <div className="setting-row">
            <label>Режим технического обслуживания:</label>
            <label className="switch">
              <input type="checkbox" checked={settings.maintenanceMode} onChange={toggleMaintenance} />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="setting-row">
            <button className="btn btn-primary" style={{width: '100%'}}>Сохранить настройки</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevPanel;