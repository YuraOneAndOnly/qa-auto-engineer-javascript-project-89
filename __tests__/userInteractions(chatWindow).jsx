import { test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ChatBot from '@hexlet/chatbot-v2';
import steps from '../__fixtures__/exampleSteps.jsx'; // мои кастомные шаги
import fixtureAvatar from '../__fixtures__/convertedAvatar.jsx'; // фикстура аватарки
import { act } from 'react';

window.HTMLElement.prototype.scrollIntoView = function () {}; // mock функции current.scrollIntoView , так как она отсутствует в jsdom

const startChatButtonName = 'Открыть Чат';
const dialogBoxName = 'Виртуальный помощник';
const avatarImageName = 'tota';
const fixtureWelcomeMessage = steps[0].messages[0];
const fixtureWelcomeButtonText = steps[0].buttons[0].text;
const fixtureLvl1ButtonsText = steps[1].buttons.map((button) => button.text);
const fixtureLvl1MessagesText = steps[1].messages;

beforeEach(async () => {
  await render(ChatBot(steps));
  const user = userEvent.setup();
  const startButton = await getButtonByName(startChatButtonName);
  await act(async () => user.click(startButton));
  const realWelcomeButton = getButtonByName(fixtureWelcomeButtonText);
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

test('chat dialog opens on start button', () => {
  const dialog = screen.getByRole('dialog', { name: dialogBoxName });
  expect(dialog).toBeVisible();
});

test('chat dialog next level structure is correct', () => {
  const dialog = screen.getByRole('dialog', { name: dialogBoxName });

  // проверка, что у модального окна правильное имя
  const realDialogName = dialog.querySelector('.modal-header').textContent;
  expect(realDialogName).toContain(dialogBoxName);

  // проверка, что есть закрывающая кнопка
  const realCloseButton = getButtonByName('Close');
  expect(realCloseButton).toBeVisible();
  expect(realCloseButton).toBeEnabled();

  // проверка, что везде используется корректный аватар
  const realAvatars = screen.getAllByRole('img', { name: avatarImageName });
  realAvatars.forEach((realAvatar) => expect(realAvatar.src).toEqual(fixtureAvatar.src));

  // проверка, что кнопка welcome превращается в сообщение
  const welcomeButtonMessage = dialog.querySelector('.message.message-right>.message-body');
  expect(welcomeButtonMessage).toBeVisible();
  expect(welcomeButtonMessage).toBeEnabled();
  expect(welcomeButtonMessage).toHaveTextContent(fixtureWelcomeButtonText);

  // проверка, что после нажатия приветственной кнопки
  // появляются новые кнопки со следующего уровня
  const realButtons = fixtureLvl1ButtonsText.map((buttonText) => getButtonByName(buttonText));
  const sortedRealButtons = sortHTMLElementsByTextContent(realButtons); // сортировка HTML элементов
  // для того, чтобы корректно было сравнивать элементы с фикстурой ниже в forEach
  expect(...realButtons).toBeVisible();
  expect(...realButtons).toBeEnabled();
  expect(realButtons).toHaveLength(fixtureLvl1ButtonsText.length);
  sortedRealButtons.forEach((button, index) =>
    expect(button).toHaveTextContent(fixtureLvl1ButtonsText[index]),
  );

  // проверка того, что на уровне lvl1 все сообщения корректные
  const realChatMessages = dialog.querySelectorAll('.message-body>.mb-0');
  const fixtureLvl1ChatMessages = [
    fixtureWelcomeMessage,
    fixtureWelcomeButtonText,
    ...fixtureLvl1MessagesText,
  ];
  realChatMessages.forEach((message, index) => {
    expect(message).toBeVisible();
    expect(message).toHaveTextContent(fixtureLvl1ChatMessages[index]);
  });
});

test('close button closing chat window', async () => {
  const user = userEvent.setup();
  const realCloseButton = getButtonByName('Close');
  const dialog = screen.getByRole('dialog', { name: dialogBoxName });
  await act(async () => user.click(realCloseButton));
  await waitForElementToBeRemoved(dialog);
  const realOpenButton = getButtonByName(startChatButtonName);
  expect(dialog).not.toBeVisible();
  expect(realOpenButton).toBeVisible();
  expect(realOpenButton).toBeEnabled();
  // проверка того, что закрывающая кнопка работает, модальное окно закрывается
  // и появляется кнопка открыть чат
});

test('scrolled after button click', async () => {
  const user = userEvent.setup();
  const scrollToSpy = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollToSpy;
  const anyChatButton = getButtonByName(fixtureLvl1ButtonsText[0]);
  await act(async () => user.click(anyChatButton));
  expect(scrollToSpy).toHaveBeenCalledOnce();
  // проверка того, что при нажатии кнопки происходит скролл
});

/*

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

test('close button closing chat window', async () => {
  const user = userEvent.setup();
  const realCloseButton = getButtonByName('Close');
  const dialog = screen.getByRole('dialog', { name: dialogBoxName });
  await act(async () => user.click(realCloseButton));
  await waitForElementToBeRemoved(dialog);
  const realOpenButton = getButtonByName(startChatButtonName);
  expect(dialog).not.toBeVisible();
  expect(realOpenButton).toBeVisible();
  expect(realOpenButton).toBeEnabled();
  // проверка того, что закрывающая кнопка работает, модальное окно закрывается
  // и появляется кнопка открыть чат
});

test('lvl1 messages have avatar', () => {
  const realAvatars = screen.getAllByRole('img', { name: avatarImageName });
  realAvatars.forEach((realAvatar) => expect(realAvatar.src).toEqual(fixtureAvatar.src));
  // проверка, что везде используется корректный аватар
});

test('welcome button turns into message after click', () => {
  const dialog = screen.getByRole('dialog', { name: dialogBoxName });
  const welcomeButtonMessage = dialog.querySelector('.message.message-right>.message-body');
  expect(welcomeButtonMessage).toBeVisible();
  expect(welcomeButtonMessage).toBeEnabled();
  expect(welcomeButtonMessage).toHaveTextContent(fixtureWelcomeButtonText);
  // проверка, что кнопка welcome превращается в сообщение
});

test('next level buttons appear after pressing welcome button', async () => {
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

test('correct lvl1 messages', async () => {
  const dialog = screen.getByRole('dialog', { name: dialogBoxName });
  const realChatMessages = dialog.querySelectorAll('.message-body>.mb-0');
  const fixtureLvl1ChatMessages = [
    fixtureWelcomeMessage,
    fixtureWelcomeButtonText,
    ...fixtureLvl1MessagesText,
  ];
  realChatMessages.forEach((message, index) => {
    expect(message).toBeVisible();
    expect(message).toHaveTextContent(fixtureLvl1ChatMessages[index]);
  }); // проверка того, что на уровне lvl1 все сообщения корректные
});

test('scrolled after button click', async () => {
  const user = userEvent.setup();
  const scrollToSpy = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollToSpy;
  const anyChatButton = getButtonByName(fixtureLvl1ButtonsText[0]);
  await act(async () => user.click(anyChatButton));
  expect(scrollToSpy).toHaveBeenCalledOnce();
  // проверка того, что при нажатии кнопки происходит скролл
});

*/
