import { test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ChatBot from '@hexlet/chatbot-v2';
import steps from '../__fixtures__/exampleSteps.jsx'; // мои кастомные шаги
import fixtureAvatar from '../__fixtures__/convertedAvatar.jsx'; // мои кастомные шаги
import { act } from 'react';

window.HTMLElement.prototype.scrollIntoView = function () {}; // mock функции current.scrollIntoView , так как она отсутствует в jsdom

const startChatButtonName = 'Открыть Чат';
const dialogBoxName = 'Виртуальный помощник';
const avatarImageName = 'tota';
const fixtureWelcomeMessage = steps[0].messages[0];
const fixtureWelcomeButtonText = steps[0].buttons[0].text;
const fixtureLvl1ButtonsText = steps[1].buttons.map((button) => button.text);

beforeEach(async () => {
  await render(ChatBot(steps));
  const user = userEvent.setup();
  const startButton = await getStartButton();
  await act(async () => user.click(startButton));
});

const getStartButton = () => {
  return screen.getByRole('button', { name: startChatButtonName });
};

const getButtonByName = (buttonName) => {
  return screen.getByRole('button', { name: buttonName });
};

const sortHTMLElementsByTextContent = (HTMLElements) => {
  return HTMLElements.toSorted((a, b) => {
    if (a.textContent > b.textContent) {
      return 1;
    }
    if (a.textContent < b.textContent) {
      return -1;
    }
    return 0;
  });
};

test('chat dialog opens on start button', () => {
  const dialog = screen.getByRole('dialog', { name: dialogBoxName });
  expect(dialog).toBeVisible();
});

test('chat dialog have name', () => {
  const dialog = screen.getByRole('dialog', { name: dialogBoxName });
  const realDialogName = dialog.querySelector('.modal-header').textContent;
  expect(realDialogName).toContain(dialogBoxName); // проверка, что у модального окна правильное имя
});

test('chat dialog have close button', () => {
  const realCloseButton = getButtonByName('Close');
  expect(realCloseButton).toBeVisible();
  expect(realCloseButton).toBeEnabled(); // проверка, что есть закрывающая кнопка
});

test('welcome message have avatar', () => {
  const realAvatar = screen.getByRole('img', { name: avatarImageName });
  expect(realAvatar.src).toEqual(fixtureAvatar.src); // проверка, что используется корректный аватар
});

test('welcome message have correct text', () => {
  const dialog = screen.getByRole('dialog', { name: dialogBoxName });
  const realMessageBody = dialog.querySelectorAll('.message-body');
  expect(realMessageBody.length).toEqual(1); // проверка, что сообщение одно
  expect(realMessageBody.item(0).textContent).toEqual(fixtureWelcomeMessage); // проверка, что сообщение соответствует фикстуре
});

test('welcome button have correct text', () => {
  const realWelcomeButton = getButtonByName(fixtureWelcomeButtonText);
  const realWelcomeButtonText = realWelcomeButton.textContent;
  expect(realWelcomeButton).toBeVisible();
  expect(realWelcomeButton).toBeEnabled(); // проверка, что приветственная кнопка чата присутсвует
  expect(realWelcomeButtonText).toEqual(fixtureWelcomeButtonText); // а её имя соответствует фикстуре
});

test('next level buttons appear after pressing welcome button', async () => {
  const user = userEvent.setup();
  const realWelcomeButton = getButtonByName(fixtureWelcomeButtonText);
  await act(async () => user.click(realWelcomeButton));
  const realButtons = fixtureLvl1ButtonsText.map((buttonText) => getButtonByName(buttonText));
  const sortedRealButtons = sortHTMLElementsByTextContent(realButtons); // сортировка HTML элементов
  // для того, чтобы корректно было сравнивать элементы с фикстурой ниже в forEach
  expect(...realButtons).toBeVisible(); // проверка, что после нажатия приветственной кнопки
  expect(...realButtons).toBeEnabled(); // появляются новые кнопки со следующего уровня
  expect(realButtons).toHaveLength(fixtureLvl1ButtonsText.length);
  sortedRealButtons.forEach((button, index) =>
    expect(button).toHaveTextContent(fixtureLvl1ButtonsText[index]),
  );
});
