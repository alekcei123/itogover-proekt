-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Июн 29 2026 г., 20:08
-- Версия сервера: 10.4.6-MariaDB
-- Версия PHP: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `how_saer`
--

-- --------------------------------------------------------

--
-- Структура таблицы `tariffs`
--

CREATE TABLE `tariffs` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `duration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `features` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ;

--
-- Дамп данных таблицы `tariffs`
--

INSERT INTO `tariffs` (`id`, `title`, `price`, `duration`, `description`, `features`, `is_active`, `created_at`) VALUES
(13, 'Бесплатный', '0.00', 'навсегда', 'Минимальный доступ: просмотр профилей, 2 лайка в день, базовые сообщения.', '[\"2 лайка/день\", \"базовые сообщения\", \"просмотр профилей\"]', 1, '2026-06-29 17:44:50'),
(14, 'Старт', '399.00', '1 месяц', 'Хороший старт: 15 лайков в день, расширенный поиск по интересам, сохранение избранных.', '[\"15 лайков/день\", \"поиск по интересам\", \"сохранение избранных\", \"уведомления о совпадениях\"]', 1, '2026-06-29 17:44:50'),
(15, 'Комфорт', '899.00', '3 месяца', 'Комфортное общение: безлимит лайков, приоритетная выдача, фильтры по возрасту и локации.', '[\"безлимит лайков\", \"приоритетная выдача\", \"фильтры по возрасту и локации\", \"история просмотров\"]', 1, '2026-06-29 17:44:50'),
(16, 'Про', '1999.00', '6 месяцев', 'Продвинутый тариф: скрытые профили, персональные подборки, расширенная аналитика активности.', '[\"скрытые профили\", \"персональные подборки\", \"аналитика активности\", \"поддержка в чате\"]', 1, '2026-06-29 17:44:50'),
(17, 'VIP', '4499.00', '12 месяцев', 'Полный доступ и привилегии: всё включено, персональный менеджер, эксклюзивные события.', '[\"всё включено\", \"персональный менеджер\", \"эксклюзивные события\", \"без рекламы\", \"ранний доступ к новинкам\"]', 1, '2026-06-29 17:44:50');

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `tariffs`
--
ALTER TABLE `tariffs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
