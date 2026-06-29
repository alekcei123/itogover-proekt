import React, { useState } from 'react';
import "../App.css";

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    gender: '',
    age: '',
    interests: '',
    about: ''
  });
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [previewImages, setPreviewImages] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработка загрузки файлов
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Создаём URL для предпросмотра
    const imagePreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(imagePreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация
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
      // Создаём FormData для отправки файлов и данных
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('interests', formData.interests);
      formDataToSend.append('about', formData.about);

      // Добавляем файлы
      selectedFiles.forEach(file => {
        formDataToSend.append('photos', file);
      });

      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        setRegistrationMessage('');
        alert(`Регистрация успешна! Добро пожаловать, ${formData.username}!`);
      } else {
        setRegistrationMessage('Ошибка при регистрации. Попробуйте ещё раз.');
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
      setRegistrationMessage('Не удалось подключиться к серверу.');
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
            <option value="">Выберите пол</option>
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

        {/* Галерея предпросмотра */}
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
