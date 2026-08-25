import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MeetPlaceScreen.css'; // Подключаем наши новые стили

const MeetPlaceScreen = () => {
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState(null);

  const places = [
    { id: 1, name: '🍕 Пиццерия «У Джо»', desc: 'Уютная атмосфера и лучшая пепперони в городе' },
    { id: 2, name: '🌳 Городской парк', desc: 'Прогулка вдоль озера и свежий воздух' },
    { id: 3, name: '🎬 Кинотеатр «Космос»', desc: 'Новинки кино и большой экран' },
  ];

  const handleSelect = (place) => {
    setSelectedPlace(place);
    console.log('Выбрано место:', place.name);
    // Здесь позже можно добавить логику отправки в чат
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="meet-place-container">
      <h2 className="meet-place-title">Выберите место для свидания</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
        Здесь будет список локаций: кафе, парки, кинотеатры и т.д.
      </p>

      <div className="places-grid">
        {places.map((place) => {
          const isSelected = selectedPlace?.id === place.id;
          return (
            <button
              key={place.id}
              onClick={() => handleSelect(place)}
              className={`place-card \${isSelected ? 'selected' : ''}`}
              style={isSelected ? { 
                borderColor: '#d32f2f', 
                backgroundColor: '#fff0f0', 
                fontWeight: 'bold' 
              } : {}}
            >
              <span>{place.name}</span>
            </button>
          );
        })}
      </div>

      {selectedPlace && (
        <p style={{ textAlign: 'center', color: '#d32f2f', marginBottom: '20px' }}>
          Вы выбрали: <b>{selectedPlace.name}</b>
        </p>
      )}

      <button onClick={handleBack} className="back-btn">
        ← Назад
      </button>
    </div>
  );
};

export default MeetPlaceScreen;
