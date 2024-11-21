import { test, expect, beforeEach, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import App from '../src/App.jsx';

window.HTMLElement.prototype.scrollIntoView = function () {}; // mock функции current.scrollIntoView , так как она отсутствует в jsdom

const startChatButtonName = 'Открыть Чат';

const mainApp = {
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
};

const wrongEmails = ['test', 'test@', '@test', '@', '@@', 'test@@test'];

beforeEach(async () => {
  await render(<App />);
});

const getButtonByName = (buttonName) => {
  return screen.getByRole('button', { name: buttonName });
};

describe('Main app rendering tests', () => {
  // проверка отображения всех текстбоксов
  test.each(
    Object.values(mainApp).filter(
      (item) => item.name && item.name !== 'Пароль' && item.type == 'textbox',
    ), // Фильтруем текстбоксы, исключая 'Пароль'
    // первое item.name исключает undefined
  )('All textboxes of main App are enabled', (element) => {
    const realElement = screen.getByRole('textbox', { name: element.name });
    expect(realElement).toBeEnabled;
    expect(realElement).toBeVisible;
  });

  // проверка отображения всех комбобоксов
  test.each(
    Object.values(mainApp).filter((item) => item.name && item.type == 'combobox'), // Фильтруем все комбобоксы
    // первое item.name исключает undefined
  )('All comboboxes of main App are enabled', (element) => {
    const realElement = screen.getByRole('combobox', { name: element.name });
    expect(realElement).toBeEnabled;
    expect(realElement).toBeVisible;
  });

  // проверка отображения всех опций комбобоксов
  test.each(
    Object.values(mainApp)
      .filter((item) => item.options && item.type == 'combobox') // Фильтруем объекты, где есть options и тип combobox
      .flatMap((item) => item.options), // Извлекаем options и объединяем в один массив
  )('All combobox options of main App are visible and enabled', (element) => {
    const realElement = screen.getByRole('option', { name: element });
    expect(realElement).toBeEnabled;
    expect(realElement).toBeVisible;
  });

  // проверка отображения всех текстбоксов паролей
  test.each(
    Object.values(mainApp).filter((item) => item.name && item.type == 'passwordTextbox'), // Фильтруем все комбобоксы
    // первое item.name исключает undefined
  )('All password textboxes of main App are enabled', (element) => {
    const realElement = screen.getByLabelText(element.name);
    expect(realElement).toBeEnabled;
    expect(realElement).toBeVisible;
  });

  // проверка отображения всех чекбоксов
  test.each(
    Object.values(mainApp).filter((item) => item.name && item.type == 'checkbox'), // Фильтруем все комбобоксы
    // первое item.name исключает undefined
  )('All checkboxes of main App are enabled', (element) => {
    const realElement = screen.getByRole('checkbox', { name: element.name });
    expect(realElement).toBeEnabled;
    expect(realElement).toBeVisible;
  });

  // проверка отображения всех кнопок
  test.each(
    Object.values(mainApp).filter((item) => item.name && item.type == 'button'), // Фильтруем все комбобоксы
    // первое item.name исключает undefined
  )('All buttons of main App are enabled', (element) => {
    const realElement = getButtonByName(element.name);
    expect(realElement).toBeEnabled;
    expect(realElement).toBeVisible;
  });
});

describe('Main app functional tests', async () => {
  //проверка того, что неправильные почты не сработают и не покажут результирующую таблицу
  test.each(wrongEmails)('Email textbox limitations', async (wrongEmail) => {
    const user = userEvent.setup();
    const emailTextbox = screen.getByRole('textbox', { name: mainApp.emailTextbox.name });
    const registerButton = getButtonByName(mainApp.registerButton.name);
    await act(async () => user.clear(emailTextbox));
    await act(async () => user.type(emailTextbox, wrongEmail));
    await act(async () => user.click(registerButton));
    expect(emailTextbox).toBeEnabled();
    expect(emailTextbox).toBeVisible();
    expect(registerButton).toBeEnabled();
    expect(registerButton).toBeVisible();
  });
});
