export const phrases = {
  auth: {
    login: {
      title: "Авторизация",
      subtitle: "Безопасный доступ для сотрудников @troffi.ru",
      emailLabel: "Электронная почта",
      emailPlaceholder: "name@troffi.ru",
      passwordLabel: "Пароль",
      passwordPlaceholder: "••••••••",
      submit: "Войти",
      forgotPassword: "Забыли пароль?",
      noAccount: "Нет аккаунта?",
      registerLink: "Зарегистрироваться",
      invalidPassword: "Неверный пароль",
      domainError: "Доступ разрешен только для почты @troffi.ru",
      userNotFound: "Пользователь не найден. Пожалуйста, зарегистрируйтесь.",
      genericError: "Произошла ошибка. Попробуйте позже.",
    },
    register: {
      title: "Регистрация",
      subtitle: "Создайте корпоративный аккаунт для доступа к сервисам",
      emailLabel: "Электронная почта",
      emailPlaceholder: "name@troffi.ru",
      submit: "Зарегистрироваться",
      success: "Аккаунт успешно создан! Пароль отправлен на вашу почту.",
      emailError: "Требуется корректный email @troffi.ru",
      alreadyExists: "Этот email уже зарегистрирован. Пожалуйста, войдите или восстановите пароль.",
    },
    forgot: {
      title: "Восстановление пароля",
      subtitle: "Мы отправим новый пароль на вашу корпоративную почту",
      emailLabel: "Электронная почта",
      emailPlaceholder: "name@troffi.ru",
      submit: "Отправить новый пароль",
      success: "Новый пароль успешно отправлен на вашу почту.",
      userNotFound: "Пользователь не найден. Пожалуйста, зарегистрируйтесь.",
    },
  },
  common: {
    loading: "Загрузка...",
    processing: "Обработка...",
    success: "Успешно!",
    error: "Ошибка",
  },
  services: {
    header: "Панель управления сервисами",
    addProduct: "Добавить новый товар",
    changePrice: "Изменение цен",
    uploadImage: "Загрузка изображений",
  },
};

export type Phrases = typeof phrases;
