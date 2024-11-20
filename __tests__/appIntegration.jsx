import { test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import App from '../src/App.jsx';

window.HTMLElement.prototype.scrollIntoView = function () {}; // mock функции current.scrollIntoView , так как она отсутствует в jsdom

const startChatButtonName = 'Открыть Чат';

const mainApp = {
  allTextboxNames: ['Email', 'Адрес', 'Город'],
  passwordTextboxName: 'Пароль',
  countryComboboxName: 'Страна',
  countryComboboxOptions: ['Выберите', 'Аргентина', 'Россия', 'Китай'],
  rulesCheckboxName: 'Принять правила',
  registerButtonName: 'Зарегистрироваться',
};

beforeEach(async () => {
  await render(<App />);
  const user = userEvent.setup();
  const startButton = await getButtonByName(startChatButtonName);
  await act(async () => user.click(startButton));
});

const getButtonByName = (buttonName) => {
  return screen.getByRole('button', { name: buttonName });
};

test('All element of main App are enable', async () => { 
  // проверка наличия всех полей ввода, кроме пароля
  mainApp.allTextboxNames.forEach((texboxName) => {
    const textbox = screen.getAllByRole('textbox', { name: texboxName });
    expect(textbox).toBeVisible;
    expect(textbox).toBeEnabled;
  });

  // проверка наличия поля ввода пароля
  const passwordTextbox = screen.getByLabelText(mainApp.passwordTextboxName);
  expect(passwordTextbox).toBeVisible;
  expect(passwordTextbox).toBeEnabled;
  
  // проверка наличия выпадающего списка стран
  const countryCombobox = screen.getByRole('combobox', { name: mainApp.countryComboboxName });
  expect(countryCombobox).toBeVisible;
  expect(countryCombobox).toBeEnabled;

  // проверка корректности всех опций из списка стран
  mainApp.countryComboboxOptions.forEach((optionName) => {
    const option = screen.getAllByRole('option', { name: optionName });
    expect(option).toBeVisible;
    expect(option).toBeEnabled;
  });

  // проверка наличия чекбокса принятия правил
  const rulesCheckbox = screen.getByRole('checkbox', { name: mainApp.rulesCheckboxName });
  expect(rulesCheckbox).toBeVisible;
  expect(rulesCheckbox).toBeEnabled;

  // проверка наличия кнопки регистрации
  const registerButton = screen.getByRole('checkbox', { name: mainApp.rulesCheckboxName });
  expect(registerButton).toBeVisible;
  expect(registerButton).toBeEnabled;
});
