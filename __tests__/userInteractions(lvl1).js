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
  const realWelcomeButton = getButtonByName(fixtureWelcomeButtonText);
  await act(async () => user.click(realWelcomeButton));
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
  })
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
  const realCloseButton= getButtonByName('Close');
  expect(realCloseButton).toBeVisible()
  expect(realCloseButton).toBeEnabled(); // проверка, что есть закрывающая кнопка
});

test('lvl1 messages have avatar', () => {
  const realAvatars = screen.getAllByRole('img', { name: avatarImageName });
  realAvatars.forEach((realAvatar) => expect(realAvatar.src).toEqual(fixtureAvatar.src));
  // проверка, что везде используется корректный аватар
}); 

test('next level buttons appear after pressing welcome button', async () => {
  const realButtons = fixtureLvl1ButtonsText.map((buttonText) => getButtonByName(buttonText));
  const sortedRealButtons = sortHTMLElementsByTextContent(realButtons); // сортировка HTML элементов
  // для того, чтобы корректно было сравнивать элементы с фикстурой ниже в forEach
  expect(...realButtons).toBeVisible(); // проверка, что после нажатия приветственной кнопки 
  expect(...realButtons).toBeEnabled(); // появляются новые кнопки со следующего уровня
  expect(realButtons).toHaveLength(fixtureLvl1ButtonsText.length);
  sortedRealButtons.forEach((button, index) => expect(button).toHaveTextContent(fixtureLvl1ButtonsText[index]));
});
