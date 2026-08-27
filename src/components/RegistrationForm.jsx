import React, { useState } from 'react';
import "../App.css";

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    gender: 'male',
    age: '',
    education: '',
    interests: '',
    about: ''
  });
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [honeypot, setHoneypot] = useState('');
  // Состояние для чекбокса
  const [agreement, setAgreement] = useState(false);

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

    // --- АНТИСПАМ ---
    if (honeypot) {
      setRegistrationMessage('Ваша заявка отклонена антиспам-системой.');
      return;
    }

    // --- Проверка согласия ---
    if (!agreement) {
      setRegistrationMessage('Для регистрации необходимо согласие на обработку персональных данных');
      return;
    }

    // --- ВАЛИДАЦИЯ ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setRegistrationMessage('Пожалуйста, введите корректный email');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setRegistrationMessage('Пароли не совпадают');
      return;
    }
    if (formData.password.length < 8) {
      setRegistrationMessage('Пароль должен содержать минимум 8 символов');
      return;
    }
    if (!/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
      setRegistrationMessage('Пароль должен содержать хотя бы одну цифру и одну букву');
      return;
    }
    if (!formData.username.trim() || !formData.city.trim() || !formData.gender || !formData.age) {
      setRegistrationMessage('Заполните все обязательные поля');
      return;
    }
    const ageNum = parseInt(formData.age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 99) {
      setRegistrationMessage('Возраст должен быть числом от 18 до 99');
      return;
    }

    try {
      // Создаем FormData (вместо JSON)!
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username.trim());
      formDataToSend.append('email', formData.email.trim());
      formDataToSend.append('password', formData.password);
      formDataToSend.append('city', formData.city.trim());
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('age', ageNum);
      formDataToSend.append('education', formData.education.trim());
      formDataToSend.append('interests', formData.interests.trim());
      formDataToSend.append('about', formData.about.trim());
      // Передаем согласие на сервер
      formDataToSend.append('agreement', agreement ? '1' : '0');

      // Добавляем файлы (фото) прямо в этот же FormData
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formDataToSend.append('photos[]', file);
        });
      }

      // Отправляем ОДИН запрос в register.php (без заголовка Content-Type!)
      const response = await fetch('/api/register.php', {
        method: 'POST',
        body: formDataToSend, 
      });

      const data = await response.json().catch(() => ({
        success: false,
        message: 'Не удалось прочитать ответ сервера (невалидный JSON)'
      }));

      if (!data.success) {
        setRegistrationMessage(data.message || 'Ошибка регистрации');
        return;
      }

      // Успешное завершение
      localStorage.setItem('authToken', data.token);
      setRegistrationMessage('');
      alert(`Регистрация успешна! Добро пожаловать, ${formData.username}!`);

      // Очистка формы
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        city: '',
        gender: 'male',
        age: '',
        education: '',
        interests: '',
        about: ''
      });
      setAgreement(false);
      setPreviewImages([]);
      setSelectedFiles([]);

    } catch (error) {
      console.error('Ошибка сети (fetch):', error);
      setRegistrationMessage('Не удалось подключиться к серверу. Проверьте, запущен ли XAMPP и работает ли Apache.');
    }
  };

  return (
    <div className="registration-form-container">
      <h2>Donskie Matches</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <input
          type="text"
          name="honeypot"
          style={{ display: 'none' }}
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />

        {/* Остальные поля */}
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
            placeholder="Минимум 8 символов, цифра и буква"
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
          <label htmlFor="education">Образование</label>
          <select
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
          >
            <option value="">Выберите</option>
            <option value="Среднее">Среднее</option>
            <option value="Среднее специальное">Среднее специальное</option>
            <option value="Высшее (бакалавр)">Высшее (бакалавр)</option>
            <option value="Высшее (магистр)">Высшее (магистр)</option>
            <option value="Учёная степень">Учёная степень</option>
          </select>
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

        {/* Чекбокс согласия */}
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={agreement}
              onChange={(e) => setAgreement(e.target.checked)}
              required
            />
            <span> Я согласен на обработку персональных данных</span>
          </label>
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