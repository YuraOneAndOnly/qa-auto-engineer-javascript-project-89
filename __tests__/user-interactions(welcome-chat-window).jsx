import { test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ChatBot from '@hexlet/chatbot-v2';
import steps from '../__fixtures__/example-steps.js'; // мои кастомные шаги
import fixtureAvatar from '../__fixtures__/converted-avatar.js'; // фикстура аватарки
import { chatFixtures } from '../__fixtures__/chat-fixtures.js';
import { act } from 'react';

window.HTMLElement.prototype.scrollIntoView = function () {}; // mock функции current.scrollIntoView , так как она отсутствует в jsdom

beforeEach(async () => {
  await render(ChatBot(steps));
  const user = userEvent.setup();
  const startButton = await getButtonByName(chatFixtures.startChatButtonName);
  await act(async () => user.click(startButton));
});

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
  const dialog = screen.getByRole('dialog', { name: chatFixtures.dialogBoxName });
  expect(dialog).toBeVisible();
});

test('chat dialog structure is correct', () => {
  const dialog = screen.getByRole('dialog', { name: chatFixtures.dialogBoxName });
  const realDialogName = dialog.querySelector('.modal-header').textContent;
  expect(realDialogName).toContain(chatFixtures.dialogBoxName); // проверка, что у модального окна правильное имя

  const realCloseButton = getButtonByName('Close');
  expect(realCloseButton).toBeVisible();
  expect(realCloseButton).toBeEnabled(); // проверка, что есть закрывающая кнопка

  const realAvatar = screen.getByRole('img', { name: chatFixtures.avatarImageName });
  expect(realAvatar.src).toEqual(fixtureAvatar.src); // проверка, что используется корректный аватар

  const realMessageBody = dialog.querySelectorAll('.message-body');
  expect(realMessageBody.length).toEqual(1); // проверка, что сообщение одно
  expect(realMessageBody.item(0).textContent).toEqual(chatFixtures.fixtureWelcomeMessage); // проверка, что сообщение соответствует фикстуре

  const realWelcomeButton = getButtonByName(chatFixtures.fixtureWelcomeButtonText);
  const realWelcomeButtonText = realWelcomeButton.textContent;
  expect(realWelcomeButton).toBeVisible();
  expect(realWelcomeButton).toBeEnabled(); // проверка, что приветственная кнопка чата присутсвует
  expect(realWelcomeButtonText).toEqual(chatFixtures.fixtureWelcomeButtonText); // а её имя соответствует фикстуре
});

test('next level buttons appear after pressing welcome button', async () => {
  const user = userEvent.setup();
  const realWelcomeButton = getButtonByName(chatFixtures.fixtureWelcomeButtonText);
  await act(async () => user.click(realWelcomeButton));
  const realButtons = chatFixtures.fixtureLvl1ButtonsText.map((buttonText) =>
    getButtonByName(buttonText),
  );
  const sortedRealButtons = sortHTMLElementsByTextContent(realButtons); // сортировка HTML элементов
  // для того, чтобы корректно было сравнивать элементы с фикстурой ниже в forEach
  expect(...realButtons).toBeVisible(); // проверка, что после нажатия приветственной кнопки
  expect(...realButtons).toBeEnabled(); // появляются новые кнопки со следующего уровня
  expect(realButtons).toHaveLength(chatFixtures.fixtureLvl1ButtonsText.length);
  sortedRealButtons.forEach((button, index) =>
    expect(button).toHaveTextContent(chatFixtures.fixtureLvl1ButtonsText[index]),
  );
});
