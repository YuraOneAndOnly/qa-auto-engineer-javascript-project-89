import { test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ChatBot from '@hexlet/chatbot-v2';
import steps from '../__fixtures__/example-steps.js'; // мои кастомные шаги
import fixtureAvatar from '../__fixtures__/converted-avatar.js'; // фикстура аватарки
import {
  ChatPluginStartButton,
  ChatPluginWelcomeScreen,
  ChatPluginLvl1Screen,
} from './src/app-integration-tests/chat-plugin-tests.js';
import { chatFixtures } from '../__fixtures__/chat-fixtures.js';
import { act } from 'react';

window.HTMLElement.prototype.scrollIntoView = function () {}; // mock функции current.scrollIntoView , так как она отсутствует в jsdom

beforeEach(async () => {
  await render(ChatBot(steps));
  const user = userEvent.setup();
  const chatPluginStartButton = new ChatPluginStartButton(screen, user);
  await act(async () => user.click(chatPluginStartButton.startChatButton));
});

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
  const chatPluginWelcomeScreen = new ChatPluginWelcomeScreen(screen);
  expect(chatPluginWelcomeScreen.dialog).toBeVisible();
});

test('chat dialog structure is correct', () => {
  const chatPluginWelcomeScreen = new ChatPluginWelcomeScreen(screen);

  const realDialogName = chatPluginWelcomeScreen.dialog.querySelector('.modal-header').textContent;
  expect(realDialogName).toContain(chatFixtures.dialogBoxName); // проверка, что у модального окна правильное имя

  expect(chatPluginWelcomeScreen.closeButton).toBeVisible();
  expect(chatPluginWelcomeScreen.closeButton).toBeEnabled(); // проверка, что есть закрывающая кнопка

  expect(chatPluginWelcomeScreen.avatarImage.src).toEqual(fixtureAvatar.src); // проверка, что используется корректный аватар

  expect(chatPluginWelcomeScreen.chatMessagesBodies.length).toEqual(1); // проверка, что сообщение одно
  expect(chatPluginWelcomeScreen.chatMessagesBodies.item(0).textContent).toEqual(
    chatFixtures.fixtureWelcomeMessage,
  ); // проверка, что сообщение соответствует фикстуре

  expect(chatPluginWelcomeScreen.chatWelcomeButton).toBeVisible();
  expect(chatPluginWelcomeScreen.chatWelcomeButton).toBeEnabled(); // проверка, что приветственная кнопка чата присутсвует
  expect(chatPluginWelcomeScreen.chatWelcomeButton).toHaveTextContent(
    chatFixtures.fixtureWelcomeButtonText,
  ); // а её имя соответствует фикстуре
});

test('next level buttons appear after pressing welcome button', async () => {
  const user = userEvent.setup();

  const chatPluginWelcomeScreen = new ChatPluginWelcomeScreen(screen, user);
  await act(async () => chatPluginWelcomeScreen.clickChatWelcomeButton());

  const chatPluginLvl1Screen = new ChatPluginLvl1Screen(screen, user);
  const sortedRealButtons = sortHTMLElementsByTextContent(chatPluginLvl1Screen.chatLvl1Buttons); // сортировка HTML элементов
  // для того, чтобы корректно было сравнивать элементы с фикстурой ниже в forEach
  expect(...chatPluginLvl1Screen.chatLvl1Buttons).toBeVisible(); // проверка, что после нажатия приветственной кнопки
  expect(...chatPluginLvl1Screen.chatLvl1Buttons).toBeEnabled(); // появляются новые кнопки со следующего уровня
  expect(chatPluginLvl1Screen.chatLvl1Buttons).toHaveLength(
    chatFixtures.fixtureLvl1ButtonsText.length,
  );
  sortedRealButtons.forEach((button, index) =>
    expect(button).toHaveTextContent(chatFixtures.fixtureLvl1ButtonsText[index]),
  );
});
