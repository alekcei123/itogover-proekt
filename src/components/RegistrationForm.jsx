import React, { useState } from 'react';
import "../App.css";

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    gender: 'male', // ✅ Было '', стало 'male' по умолчанию
    age: '',
    interests: '',
    about: ''
  });
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const imagePreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(imagePreviews);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Простая валидация на клиенте
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    setRegistrationMessage('Пожалуйста, введите корректный email');
    return;
  }
  if (formData.password !== formData.confirmPassword) {
    setRegistrationMessage('Пароли не совпадают');
    return;
  }
  if (formData.password.length < 6) {
    setRegistrationMessage('Пароль должен содержать минимум 6 символов');
    return;
  }
  if (!formData.username || !formData.city || !formData.gender || !formData.age) {
    setRegistrationMessage('Заполните все обязательные поля');
    return;
  }

  try {
    // Формируем payload — здесь age никогда не будет NaN
    const ageValue = formData.age ? parseInt(formData.age, 10) : 0;
    
    const payload = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      city: formData.city.trim(),
      gender: formData.gender,
      age: ageValue, // ✅ число или 0
      interests: formData.interests.trim(),
      about: formData.about.trim(),
    };

    console.log('ОТПРАВЛЯЕМ НА СЕРВЕР:', payload);

    const response = await fetch('http://localhost/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // ✅ Читаем JSON ОДИН раз, сразу в переменную data
    const data = await response.json().catch(() => ({
      success: false,
      message: 'Не удалось прочитать ответ сервера (невалидный JSON)'
    }));

    console.log('ОТВЕТ ОТ PHP:', data);

    // Проверяем успех именно по полю success из ответа PHP
    if (!data.success) {
      setRegistrationMessage(data.message || 'Ошибка регистрации');
      return;
    }

    // Если всё хорошо
    localStorage.setItem('authToken', data.token);
    setRegistrationMessage('');
    alert(`Регистрация успешна! Добро пожаловать, ${formData.username}!`);

  } catch (error) {
    console.error('Ошибка сети (fetch):', error);
    setRegistrationMessage('Не удалось подключиться к серверу. Проверьте, запущен ли XAMPP и работает ли Apache.');
  }
};


  return (
    <div className="registration-form-container">
      <h2>Регистрация на Madagascar DATING SITE</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="username">Имя пользователя *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Введите имя пользователя"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@mail.ru"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Минимум 6 символов"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Подтвердите пароль *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">Город *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Ваш город"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Пол *</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            {/* ✅ УБРАЛИ value="" */}
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
            <option value="other">Другой</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="age">Возраст *</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="18"
            max="99"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="interests">Интересы</label>
          <input
            type="text"
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="Например: путешествия, кино, спорт"
          />
        </div>

        <div className="form-group">
          <label htmlFor="about">О себе</label>
          <textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="Расскажите немного о себе"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="photos">Загрузите фото</label>
          <input
            type="file"
            id="photos"
            name="photos"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          <p className="hint">Можно загрузить несколько фото (JPG, PNG, WEBP)</p>
        </div>

        {previewImages.length > 0 && (
          <div className="gallery">
            <h4>Ваши фото:</h4>
            <div className="gallery-grid">
              {previewImages.map((preview, index) => (
                <div key={index} className="gallery-item">
                  <img src={preview} alt={`Preview ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="submit-btn">Зарегистрироваться</button>
      </form>
      {registrationMessage && <p className="error-message">{registrationMessage}</p>}
      <p className="required-info">* Обязательные поля</p>
    </div>
  );
}

export default RegistrationForm;
