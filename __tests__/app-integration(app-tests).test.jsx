import { test, expect, beforeEach, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import App from '../src/App.jsx';
import MainAppInputScreen from './src/app-integration-tests/page-object-classes/MainAppInputScreenPO.js';
import MainAppResultScreen from './src/app-integration-tests/page-object-classes/MainAppResultScreenPO.js';
import { mainAppElements } from '../__fixtures__/main-app-elements.js';
import { mainAppFixture, wrongEmails } from '../__fixtures__/main-app-fixtures.js';

window.HTMLElement.prototype.scrollIntoView = function () {}; // mock функции current.scrollIntoView , так как она отсутствует в jsdom

beforeEach(async () => {
  await render(<App />);
});

const getButtonByName = (buttonName) => {
  return screen.getByRole('button', { name: buttonName });
};

describe('Main app rendering tests', () => {
  // проверка отображения всех текстбоксов
  test.each(
    Object.values(mainAppElements.inputScreen).filter(
      (item) =>
        item.name &&
        item.name !== mainAppElements.inputScreen.passwordTextbox.name &&
        item.type == 'textbox',
    ), // Фильтруем текстбоксы, исключая 'Пароль'
    // первое item.name исключает undefined
  )('All textboxes of main App are enabled', (element) => {
    const realElement = screen.getByRole('textbox', { name: element.name });
    expect(realElement).toBeEnabled;
    expect(realElement).toBeVisible;
  });
  // проверка отображения всех комбобоксов
  test.each(
    Object.values(mainAppElements.inputScreen).filter(
      (item) => item.name && item.type == 'combobox',
    ), // Фильтруем все комбобоксы
    // первое item.name исключает undefined
  )('All comboboxes of main App are enabled', (element) => {
    const realElement = screen.getByRole('combobox', { name: element.name });
    expect(realElement).toBeEnabled;
    expect(realElement).toBeVisible;
  });
  // проверка отображения всех опций комбобоксов
  test.each(
    Object.values(mainAppElements.inputScreen)
      .filter((item) => item.options && item.type == 'combobox') // Фильтруем объекты, где есть options и тип combobox
      .flatMap((item) => item.options), // Извлекаем options и объединяем в один массив
  )('All combobox options of main App are visible and enabled', (element) => {
    const realElement = screen.getByRole('option', { name: element });
    expect(realElement).toBeEnabled;
    expect(realElement).toBeVisible;
  });
  // проверка отображения всех текстбоксов паролей
  test.each(
    Object.values(mainAppElements.inputScreen).filter(
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
    Object.values(mainAppElements.inputScreen).filter(
      (item) => item.name && item.type == 'checkbox',
    ), // Фильтруем все комбобоксы
    // первое item.name исключает undefined
  )('All checkboxes of main App are enabled', (element) => {
    const realElement = screen.getByRole('checkbox', { name: element.name });
    expect(realElement).toBeEnabled;
    expect(realElement).toBeVisible;
  });
  // проверка отображения всех кнопок
  test.each(
    Object.values(mainAppElements.inputScreen).filter((item) => item.name && item.type == 'button'), // Фильтруем все комбобоксы
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
    const mainAppInputScreen = new MainAppInputScreen(screen, user);
    await act(async () => user.clear(mainAppInputScreen.emailTextbox));
    await act(async () => user.type(mainAppInputScreen.emailTextbox, wrongEmail));
    await act(async () => mainAppInputScreen.clickRegisterButton());
    expect(mainAppInputScreen.emailTextbox).toBeEnabled();
    expect(mainAppInputScreen.emailTextbox).toBeVisible();
    expect(mainAppInputScreen.registerButton).toBeEnabled();
    expect(mainAppInputScreen.registerButton).toBeVisible();
  });

  test('Main app positive scenario', async () => {
    const user = userEvent.setup();
    const mainAppInputScreen = new MainAppInputScreen(screen, user);
    // заполняем все поля и вызываем регистрацию при помощи PageObject класса
    await act(async () =>
      mainAppInputScreen.register(
        mainAppFixture.fixtureEmail,
        mainAppFixture.fixturePassword,
        mainAppFixture.fixtureAddress,
        mainAppFixture.fixtureCity,
        mainAppFixture.fixtureComboboxOptionIndex,
        true,
      ),
    );
    // проверяем, что результирующая таблица появилась и соответствует фикстуре
    const mainAppResultScreen = new MainAppResultScreen(screen, user);
    expect(mainAppResultScreen.resultTable).toBeVisible;
    expect(mainAppResultScreen.resultTable).toContainHTML(mainAppFixture.fixtureInnerHTML);
    // проверяем, что появилась кнопка Назад
    expect(mainAppResultScreen.backButton).toBeVisible;
    expect(mainAppResultScreen.backButton).toBeEnabled;
  });

  test('Main app back to input screen', async () => {
    const user = userEvent.setup();
    const mainAppInputScreen = new MainAppInputScreen(screen, user);
    // заполняем все поля и вызываем регистрацию при помощи PageObject класса
    await act(async () =>
      mainAppInputScreen.register(
        mainAppFixture.fixtureEmail,
        mainAppFixture.fixturePassword,
        mainAppFixture.fixtureAddress,
        mainAppFixture.fixtureCity,
        mainAppFixture.fixtureComboboxOptionIndex,
        true,
      ),
    );
    // нажимаем кнопку Назад
    const mainAppResultScreen = new MainAppResultScreen(screen, user);
    await act(async () => mainAppResultScreen.backToRegisterScreen());
    // при помощи повторного формирования класса конструктором, в котором выполняются заново getByRole
    // проверяем, что все элементы экрана ввода появились снова
    const mainAppInputScreenAfterBack = new MainAppInputScreen(screen, user);
    // проверяем, что элементы экрана ввода видны и их значение не изменилось (соответсвует фикстуре)
    expect(mainAppInputScreenAfterBack.emailTextbox).toBeVisible;
    expect(mainAppInputScreenAfterBack.emailTextbox).toBeEnabled;
    expect(mainAppInputScreenAfterBack.emailTextbox).toHaveValue(mainAppFixture.fixtureEmail);

    expect(mainAppInputScreenAfterBack.passwordTextbox).toBeVisible;
    expect(mainAppInputScreenAfterBack.passwordTextbox).toBeEnabled;
    expect(mainAppInputScreenAfterBack.passwordTextbox).toHaveValue(mainAppFixture.fixturePassword);

    expect(mainAppInputScreenAfterBack.addressTextbox).toBeVisible;
    expect(mainAppInputScreenAfterBack.addressTextbox).toBeEnabled;
    expect(mainAppInputScreenAfterBack.addressTextbox).toHaveValue(mainAppFixture.fixtureAddress);

    expect(mainAppInputScreenAfterBack.cityTextbox).toBeVisible;
    expect(mainAppInputScreenAfterBack.cityTextbox).toBeEnabled;
    expect(mainAppInputScreenAfterBack.cityTextbox).toHaveValue(mainAppFixture.fixtureCity);

    expect(mainAppInputScreenAfterBack.countryCombobox).toBeVisible;
    expect(mainAppInputScreenAfterBack.countryCombobox).toBeEnabled;
    expect(mainAppInputScreenAfterBack.countryCombobox.options.selectedIndex).toEqual(
      mainAppFixture.fixtureComboboxOptionIndex,
    );

    expect(mainAppInputScreenAfterBack.rulesCheckbox).toBeVisible;
    expect(mainAppInputScreenAfterBack.rulesCheckbox).toBeEnabled;
    expect(mainAppInputScreenAfterBack.rulesCheckbox).toBeChecked;

    expect(mainAppInputScreenAfterBack.registerButton).toBeVisible;
    expect(mainAppInputScreenAfterBack.registerButton).toBeEnabled;
  });

  test('Main app empty textboxes test', async () => {
    const user = userEvent.setup();
    const mainAppInputScreen = new MainAppInputScreen(screen, user);
    // нажимаем кнопку регистрации
    await act(async () => mainAppInputScreen.clickRegisterButton());
    // проверяем, что результирующая таблица появилась и соответствует фикстуре
    const mainAppResultScreen = new MainAppResultScreen(screen, user);
    expect(mainAppResultScreen.resultTable).toBeVisible;
    // проверяем, что чекбокс правил остался со значением по умолчанию (false) в появившейся таблице
    const rulesResultTableRow = screen.getByRole('row', {
      name: `${mainAppElements.inputScreen.rulesCheckbox.name} ${mainAppElements.inputScreen.rulesCheckbox.state}`,
    });
    expect(rulesResultTableRow).toBeVisible;
    expect(rulesResultTableRow).toBeEnabled;
    // проверка того, что все остальные поля пустые
    Array.from(mainAppResultScreen.resultTable.rows)
      .filter((row) => row.cells[0].textContent !== mainAppElements.inputScreen.rulesCheckbox.name)
      .forEach((row) => {
        expect(row.cells[1]).toBeEmptyDOMElement();
      });
  });
});
