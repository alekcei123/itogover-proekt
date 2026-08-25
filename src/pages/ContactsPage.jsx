import { useState } from 'react';

export function ContactsPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = 'Имя обязательно';
    if (!form.email.includes('@')) err.email = 'Введите корректный email';
    if (form.message.length < 10) err.message = 'Сообщение должно быть не менее 10 символов';
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (honeypot) {
      setStatus('Ваше сообщение отклонено антиспам-системой.');
      return;
    }

    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }
    setErrors({});

    setStatus('Спасибо! Мы свяжемся с вами в ближайшее время.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="contacts-page">
      <h1>Контакты</h1>
      <p>Свяжитесь с нами по любым вопросам. Мы всегда рады помочь.</p>

      {status && <p className="status-message">{status}</p>}

      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="honeypot"
          style={{ display: 'none' }}
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />

        <div className="form-group">
          <label htmlFor="name">Ваше имя</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Иван Иванов"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="ivan@example.com"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="message">Сообщение</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            placeholder="Опишите ваш вопрос..."
          />
          {errors.message && <span className="error">{errors.message}</span>}
        </div>

        <button type="submit" className="submit-btn">Отправить</button>
      </form>

      <div className="contact-info">
        <h3>Другие способы связи</h3>
        <p>Телефон: +7 850 302-45-11</p>
        <p>Email: info@site.ru</p>
        <p>Мы в соцсетях: Telegram, VK</p>
      </div>
    </div>
  );
}