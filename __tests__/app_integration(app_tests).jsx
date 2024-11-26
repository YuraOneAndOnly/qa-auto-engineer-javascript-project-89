import { test, expect, beforeEach, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import App from '../src/App.jsx';

window.HTMLElement.prototype.scrollIntoView = function () {}; // mock функции current.scrollIntoView , так как она отсутствует в jsdom

const mainApp = {
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

const mainAppFixture = {
  fixtureEmail: 'testEmail@testDomain.com',
  fixturePassword: 'testPassword',
  fixtureAddress: 'testAddress',
  fixtureCity: 'testCity',
  fixtureComboboxOptionIndex: 1,
  fixtureInnerHTML:
    '<table class="table"><tbody><tr><td>Принять правила</td><td>true</td></tr><tr><td>Адрес</td><td>testAddress</td></tr><tr><td>Город</td><td>testCity</td></tr><tr><td>Страна</td><td>Аргентина</td></tr><tr><td>Email</td><td>testEmail@testDomain.com</td></tr><tr><td>Пароль</td><td>testPassword</td></tr></tbody></table>',
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
    Object.values(mainApp.inputScreen).filter(
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
    Object.values(mainApp.inputScreen).filter((item) => item.name && item.type == 'combobox'), // Фильтруем все комбобоксы
    // первое item.name исключает undefined
  )('All comboboxes of main App are enabled', (element) => {
    const realElement = screen.getByRole('combobox', { name: element.name });
    expect(realElement).toBeEnabled;
    expect(realElement).toBeVisible;
  });

  // проверка отображения всех опций комбобоксов
  test.each(
    Object.values(mainApp.inputScreen)
      .filter((item) => item.options && item.type == 'combobox') // Фильтруем объекты, где есть options и тип combobox
      .flatMap((item) => item.options), // Извлекаем options и объединяем в один массив
  )('All combobox options of main App are visible and enabled', (element) => {
    const realElement = screen.getByRole('option', { name: element });
    expect(realElement).toBeEnabled;
    expect(realElement).toBeVisible;
  });

  // проверка отображения всех текстбоксов паролей
  test.each(
    Object.values(mainApp.inputScreen).filter(
      (item) => item.name && item.type == 'passwordTextbox',
    ), // Фильтруем все комбобоксы
    // первое item.name исключает undefined
  )('All password textboxes of main App are enabled', (element) => {
    const realElement = screen.getByLabelText(element.name);
    expect(realElement).toBeEnabled;
    expect(realElement).toBeVisible;
  });

  // проверка отображения всех чекбоксов
  test.each(
    Object.values(mainApp.inputScreen).filter((item) => item.name && item.type == 'checkbox'), // Фильтруем все комбобоксы
    // первое item.name исключает undefined
  )('All checkboxes of main App are enabled', (element) => {
    const realElement = screen.getByRole('checkbox', { name: element.name });
    expect(realElement).toBeEnabled;
    expect(realElement).toBeVisible;
  });

  // проверка отображения всех кнопок
  test.each(
    Object.values(mainApp.inputScreen).filter((item) => item.name && item.type == 'button'), // Фильтруем все комбобоксы
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
    const emailTextbox = screen.getByRole('textbox', {
      name: mainApp.inputScreen.emailTextbox.name,
    });
    const registerButton = getButtonByName(mainApp.inputScreen.registerButton.name);
    await act(async () => user.clear(emailTextbox));
    await act(async () => user.type(emailTextbox, wrongEmail));
    await act(async () => user.click(registerButton));
    expect(emailTextbox).toBeEnabled();
    expect(emailTextbox).toBeVisible();
    expect(registerButton).toBeEnabled();
    expect(registerButton).toBeVisible();
  });

  test('Main app positive scenario', async () => {
    const user = userEvent.setup();

    // получаем все активные элементы приложения
    const realEmailTextbox = screen.getByRole('textbox', {
      name: mainApp.inputScreen.emailTextbox.name,
    });
    const readAddressTextbox = screen.getByRole('textbox', {
      name: mainApp.inputScreen.addressTextbox.name,
    });
    const realCityTextbox = screen.getByRole('textbox', {
      name: mainApp.inputScreen.cityTextbox.name,
    });
    const realPasswordTextbox = screen.getByLabelText(mainApp.inputScreen.passwordTextbox.name);
    const realCountryCombobox = screen.getByRole('combobox', {
      name: mainApp.inputScreen.countryCombobox.name,
    });
    const realRulesCheckbox = screen.getByRole('checkbox', {
      name: mainApp.inputScreen.rulesCheckbox.name,
    });
    const registerButton = getButtonByName(mainApp.inputScreen.registerButton.name);

    // заполняем все активные элементы приложения
    await act(async () => user.type(realEmailTextbox, mainAppFixture.fixtureEmail));
    await act(async () => user.type(realPasswordTextbox, mainAppFixture.fixturePassword));
    await act(async () => user.type(readAddressTextbox, mainAppFixture.fixtureAddress));
    await act(async () => user.type(realCityTextbox, mainAppFixture.fixtureCity));
    await act(async () =>
      user.selectOptions(
        realCountryCombobox,
        mainApp.inputScreen.countryCombobox.options[mainAppFixture.fixtureComboboxOptionIndex],
      ),
    );
    await act(async () => user.click(realRulesCheckbox));

    // нажимаем кнопку регистрации
    await act(async () => user.click(registerButton));

    // проверяем, что результирующая таблица появилась и соответствует фикстуре
    const resultTable = screen.getByRole('table', { name: '' });
    expect(resultTable).toBeVisible;
    expect(resultTable).toContainHTML(mainAppFixture.fixtureInnerHTML);

    // проверяем, что появилась кнопка Назад
    const backButton = getButtonByName(mainApp.resultScreen.backButton.name);
    expect(backButton).toBeVisible;
    expect(backButton).toBeEnabled;
  });

  test('Main app back to input screen', async () => {
    const user = userEvent.setup();
    // получаем все активные элементы приложения
    const realEmailTextbox = screen.getByRole('textbox', {
      name: mainApp.inputScreen.emailTextbox.name,
    });
    const readAddressTextbox = screen.getByRole('textbox', {
      name: mainApp.inputScreen.addressTextbox.name,
    });
    const realCityTextbox = screen.getByRole('textbox', {
      name: mainApp.inputScreen.cityTextbox.name,
    });
    const realPasswordTextbox = screen.getByLabelText(mainApp.inputScreen.passwordTextbox.name);
    const realCountryCombobox = screen.getByRole('combobox', {
      name: mainApp.inputScreen.countryCombobox.name,
    });
    const realRulesCheckbox = screen.getByRole('checkbox', {
      name: mainApp.inputScreen.rulesCheckbox.name,
    });
    const registerButton = getButtonByName(mainApp.inputScreen.registerButton.name);

    // заполняем все активные элементы приложения
    await act(async () => user.type(realEmailTextbox, mainAppFixture.fixtureEmail));
    await act(async () => user.type(realPasswordTextbox, mainAppFixture.fixturePassword));
    await act(async () => user.type(readAddressTextbox, mainAppFixture.fixtureAddress));
    await act(async () => user.type(realCityTextbox, mainAppFixture.fixtureCity));
    await act(async () =>
      user.selectOptions(
        realCountryCombobox,
        mainApp.inputScreen.countryCombobox.options[mainAppFixture.fixtureComboboxOptionIndex],
      ),
    );
    await act(async () => user.click(realRulesCheckbox));

    // нажимаем кнопку регистрации
    await act(async () => user.click(registerButton));

    // нажимаем кнопку Назад
    const backButton = getButtonByName(mainApp.resultScreen.backButton.name);
    await act(async () => user.click(backButton));

    // при помощи getByRole проверяем, что все элементы экрана ввода появились снова
    const realEmailTextboxAfterBack = screen.getByRole('textbox', {
      name: mainApp.inputScreen.emailTextbox.name,
    });
    const readAddressTextboxAfterBack = screen.getByRole('textbox', {
      name: mainApp.inputScreen.addressTextbox.name,
    });
    const realCityTextboxAfterBack = screen.getByRole('textbox', {
      name: mainApp.inputScreen.cityTextbox.name,
    });
    const realPasswordTextboxAfterBack = screen.getByLabelText(
      mainApp.inputScreen.passwordTextbox.name,
    );
    const realCountryComboboxAfterBack = screen.getByRole('combobox', {
      name: mainApp.inputScreen.countryCombobox.name,
    });
    const realRulesCheckboxAfterBack = screen.getByRole('checkbox', {
      name: mainApp.inputScreen.rulesCheckbox.name,
    });
    const registerButtonAfterBack = getButtonByName(mainApp.inputScreen.registerButton.name);

    // проверяем, что элементы экрана ввода видны и их значение не изменилось (соответсвует фикстуре)
    expect(realEmailTextboxAfterBack).toBeVisible;
    expect(realEmailTextboxAfterBack).toBeEnabled;
    expect(realEmailTextboxAfterBack).toHaveValue(mainAppFixture.fixtureEmail);

    expect(realPasswordTextboxAfterBack).toBeVisible;
    expect(realPasswordTextboxAfterBack).toBeEnabled;
    expect(realPasswordTextboxAfterBack).toHaveValue(mainAppFixture.fixturePassword);

    expect(readAddressTextboxAfterBack).toBeVisible;
    expect(readAddressTextboxAfterBack).toBeEnabled;
    expect(readAddressTextboxAfterBack).toHaveValue(mainAppFixture.fixtureAddress);

    expect(realCityTextboxAfterBack).toBeVisible;
    expect(realCityTextboxAfterBack).toBeEnabled;
    expect(realCityTextboxAfterBack).toHaveValue(mainAppFixture.fixtureCity);

    expect(realCountryComboboxAfterBack).toBeVisible;
    expect(realCountryComboboxAfterBack).toBeEnabled;
    expect(realCountryComboboxAfterBack.options.selectedIndex).toEqual(
      mainAppFixture.fixtureComboboxOptionIndex,
    );

    expect(realRulesCheckboxAfterBack).toBeVisible;
    expect(realRulesCheckboxAfterBack).toBeEnabled;
    expect(realRulesCheckboxAfterBack).toBeChecked;

    expect(registerButtonAfterBack).toBeVisible;
    expect(registerButtonAfterBack).toBeEnabled;
  });

  test('Main app empty textboxes test', async () => {
    const user = userEvent.setup();

    // нажимаем кнопку регистрации
    const registerButton = getButtonByName(mainApp.inputScreen.registerButton.name);
    await act(async () => user.click(registerButton));

    // проверяем, что результирующая таблица появилась и соответствует фикстуре
    const resultTable = screen.getByRole('table', { name: '' });
    expect(resultTable).toBeVisible;

    // проверяем, что чекбокс правил остался false
    const rulesResultTableRow = screen.getByRole('row', {
      name: 'Принять правила false',
    });
    expect(rulesResultTableRow).toBeVisible;
    expect(rulesResultTableRow).toBeEnabled;

    // проверка того, что все остальные поля пустые
    Array.from(resultTable.rows)
      .filter((row) => row.cells[0].textContent !== 'Принять правила')
      .forEach((row) => {
        expect(row.cells[1]).toBeEmptyDOMElement();
      });
  });
});
