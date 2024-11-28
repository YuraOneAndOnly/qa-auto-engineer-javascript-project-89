export const mainApp = {
  inputScreen: {
    emailTextbox: {
      type: 'textbox',
      name: 'Email',
      placeholder: 'Email',
    },
    passwordTextbox: {
      type: 'passwordTextbox',
      name: 'Пароль',
      placeholder: 'Пароль',
    },
    addressTextbox: {
      type: 'textbox',
      name: 'Адрес',
      placeholder: 'Невский проспект, 12',
    },
    cityTextbox: {
      type: 'textbox',
      name: 'Город',
      placeholder: '',
    },
    countryCombobox: {
      type: 'combobox',
      name: 'Страна',
      options: ['Выберите', 'Аргентина', 'Россия', 'Китай'],
      defaultOption: 'Выберите',
    },
    rulesCheckbox: {
      type: 'checkbox',
      name: 'Принять правила',
      state: false,
    },
    registerButton: { type: 'button', name: 'Зарегистрироваться' },
  },
  resultScreen: {
    backButton: { type: 'button', name: 'Назад' },
  },
};
