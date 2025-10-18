# 🛍️ TroffiServices - WooCommerce Product Management

Modern Next.js приложение для управления товарами в WooCommerce магазинах через REST API.

## 🚀 Возможности

- ✅ **Добавление товаров** в WooCommerce магазины
- ✅ **Загрузка изображений** через WordPress Media API
- ✅ **Управление категориями** и производителями
- ✅ **Валидация данных** перед отправкой
- ✅ **Обработка ошибок** с детальными сообщениями
- ✅ **Retry логика** при сетевых сбоях

## 🛠 Технологии

- **Frontend**: Next.js 14, React, TypeScript
- **API**: WooCommerce REST API, WordPress Media API
- **Стили**: CSS Modules
- **Аутентификация**: Basic Auth + Application Passwords

## 📦 Установка

```bash
# Клонирование репозитория
git clone https://github.com/someTrickyCase/TroffiServices.git
cd TroffiServices

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```

## ⚙️ Настройка окружения

Создай файл .env в корне проекта:
env

# WooCommerce API credentials для магазинов

### Формат: DOMAIN_NAME=consumer_key+consumer_secret+wp_application_password

[site_domen]=ck_xxxxxxxxxxxx+cs_xxxxxxxxxxxx+xxxx xxxx xxxx xxxx xxxx

### WordPress Application Password для загрузки изображений

WP_API_USERNAME=your_username

## 🔐 Получение credentials

- WooCommerce API:

```text
    WooCommerce → Настройки → Advanced → REST API
    Создай новые keys с правами Read/Write
    Добавь в .env в формате: DOMAIN=key+secret
```

- WordPress Application Password:

```text
    WordPress → Пользователи → Профиль
    Application Passwords → Создать новый
    Скопируй сгенерированный пароль
```

## Особенности

1. 🖼️ Изображения загружаются через WordPress Media API
2. 🔄 Авто-повторы при временных сетевых ошибках
3. 🎯 Валидация SKU на уникальность
