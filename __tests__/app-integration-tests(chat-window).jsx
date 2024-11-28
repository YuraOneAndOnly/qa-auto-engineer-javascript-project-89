import { test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import fixtureAvatar from '../__fixtures__/converted-avatar.js'; // фикстура аватарки
import { chatFixtures } from '../__fixtures__/chat-fixtures.js';
import { act } from 'react';
import App from '../src/App.jsx';

window.HTMLElement.prototype.scrollIntoView = function () {}; // mock функции current.scrollIntoView , так как она отсутствует в jsdom

beforeEach(async () => {
  await render(<App />);
  const user = userEvent.setup();
  const startButton = await getButtonByName(chatFixtures.startChatButtonName);
  await act(async () => user.click(startButton));
  const realWelcomeButton = getButtonByName(chatFixtures.fixtureWelcomeButtonText);
  await act(async () => user.click(realWelcomeButton));
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

test('chat dialog next level structure is correct', () => {
  const dialog = screen.getByRole('dialog', { name: chatFixtures.dialogBoxName });

  //проверка, что окно диалога открывается
  expect(dialog).toBeVisible();

  // проверка, что у модального окна правильное имя
  const realDialogName = dialog.querySelector('.modal-header').textContent;
  expect(realDialogName).toContain(chatFixtures.dialogBoxName);

  // проверка, что есть закрывающая кнопка
  const realCloseButton = getButtonByName('Close');
  expect(realCloseButton).toBeVisible();
  expect(realCloseButton).toBeEnabled();

  // проверка, что везде используется корректный аватар
  const realAvatars = screen.getAllByRole('img', { name: chatFixtures.avatarImageName });
  realAvatars.forEach((realAvatar) => expect(realAvatar.src).toEqual(fixtureAvatar.src));

  // проверка, что кнопка welcome превращается в сообщение
  const welcomeButtonMessage = dialog.querySelector('.message.message-right>.message-body');
  expect(welcomeButtonMessage).toBeVisible();
  expect(welcomeButtonMessage).toBeEnabled();
  expect(welcomeButtonMessage).toHaveTextContent(chatFixtures.fixtureWelcomeButtonText);

  // проверка, что после нажатия приветственной кнопки
  // появляются новые кнопки со следующего уровня
  const realButtons = chatFixtures.fixtureLvl1ButtonsText.map((buttonText) =>
    getButtonByName(buttonText),
  );
  const sortedRealButtons = sortHTMLElementsByTextContent(realButtons); // сортировка HTML элементов
  // для того, чтобы корректно было сравнивать элементы с фикстурой ниже в forEach
  expect(...realButtons).toBeVisible();
  expect(...realButtons).toBeEnabled();
  expect(realButtons).toHaveLength(chatFixtures.fixtureLvl1ButtonsText.length);
  sortedRealButtons.forEach((button, index) =>
    expect(button).toHaveTextContent(chatFixtures.fixtureLvl1ButtonsText[index]),
  );

  // проверка того, что на уровне lvl1 все сообщения корректные
  const realChatMessages = dialog.querySelectorAll('.message-body>.mb-0');
  const fixtureLvl1ChatMessages = [
    chatFixtures.fixtureWelcomeMessage,
    chatFixtures.fixtureWelcomeButtonText,
    ...chatFixtures.fixtureLvl1MessagesText,
  ];
  realChatMessages.forEach((message, index) => {
    expect(message).toBeVisible();
    expect(message).toHaveTextContent(fixtureLvl1ChatMessages[index]);
  });
});

test('close button closing chat window', async () => {
  const user = userEvent.setup();
  const realCloseButton = getButtonByName('Close');
  const dialog = screen.getByRole('dialog', { name: chatFixtures.dialogBoxName });
  await act(async () => user.click(realCloseButton));
  await waitForElementToBeRemoved(dialog);
  const realOpenButton = getButtonByName(chatFixtures.startChatButtonName);
  expect(dialog).not.toBeVisible();
  expect(realOpenButton).toBeVisible();
  expect(realOpenButton).toBeEnabled();
  // проверка того, что закрывающая кнопка работает, модальное окно закрывается
  // и появляется кнопка открыть чат
});

test('chat is scrolling after button click', async () => {
  const user = userEvent.setup();
  const scrollToSpy = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollToSpy;
  const anyChatButton = getButtonByName(chatFixtures.fixtureLvl1ButtonsText[0]);
  await act(async () => user.click(anyChatButton));
  expect(scrollToSpy).toHaveBeenCalledOnce();
  // проверка того, что при нажатии кнопки происходит скролл
});
