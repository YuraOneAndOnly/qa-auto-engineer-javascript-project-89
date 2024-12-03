import { test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ChatBot from '@hexlet/chatbot-v2';
import steps from '../__fixtures__/example-steps.js'; // мои кастомные шаги
import fixtureAvatar from '../__fixtures__/converted-avatar.js'; // фикстура аватарки
import {
  ChatPluginStartButton,
  ChatPluginWelcomeScreen,
  ChatPluginLvl1Screen,
  sortHTMLElementsByTextContent,
} from './src/app-integration-tests/chat-plugin-tests.js';
import { chatFixtures } from '../__fixtures__/chat-fixtures.js';
import { act } from 'react';

window.HTMLElement.prototype.scrollIntoView = function () {}; // mock функции current.scrollIntoView , так как она отсутствует в jsdom

beforeEach(async () => {
  await render(ChatBot(steps));
  const user = userEvent.setup();
  const chatPluginStartButton = new ChatPluginStartButton(screen, user);
  await act(async () => user.click(chatPluginStartButton.startChatButton));
  const chatPluginWelcomeScreen = new ChatPluginWelcomeScreen(screen, user);
  await act(async () => user.click(chatPluginWelcomeScreen.chatWelcomeButton));
});

// проверка того, что на 1 уровне чата корректная структура
test('chat dialog next level structure is correct', () => {
  const chatPluginLvl1Screen = new ChatPluginLvl1Screen(screen);
  //проверка, что окно диалога открывается
  expect(chatPluginLvl1Screen.dialog).toBeVisible();

  // проверка, что у модального окна правильное имя
  expect(chatPluginLvl1Screen.dialogBoxName).toContain(chatFixtures.dialogBoxName);

  // проверка, что есть закрывающая кнопка
  expect(chatPluginLvl1Screen.closeButton).toBeVisible();
  expect(chatPluginLvl1Screen.closeButton).toBeEnabled();

  // проверка, что везде используется корректный аватар
  chatPluginLvl1Screen.avatarImages.forEach((realAvatar) =>
    expect(realAvatar.src).toEqual(fixtureAvatar.src),
  );

  // проверка, что кнопка welcome превращается в сообщение
  expect(chatPluginLvl1Screen.welcomeButtonAsMessage).toBeVisible();
  expect(chatPluginLvl1Screen.welcomeButtonAsMessage).toBeEnabled();
  expect(chatPluginLvl1Screen.welcomeButtonAsMessage).toHaveTextContent(
    chatFixtures.fixtureWelcomeButtonText,
  );

  // проверка, что после нажатия приветственной кнопки
  // появляются новые кнопки со следующего уровня
  const sortedRealButtons = sortHTMLElementsByTextContent(chatPluginLvl1Screen.chatLvl1Buttons); // сортировка HTML элементов
  // для того, чтобы корректно было сравнивать элементы с фикстурой ниже в forEach
  expect(...chatPluginLvl1Screen.chatLvl1Buttons).toBeVisible();
  expect(...chatPluginLvl1Screen.chatLvl1Buttons).toBeEnabled();
  expect(chatPluginLvl1Screen.chatLvl1Buttons).toHaveLength(
    chatFixtures.fixtureLvl1ButtonsText.length,
  );
  sortedRealButtons.forEach((button, index) =>
    expect(button).toHaveTextContent(chatFixtures.fixtureLvl1ButtonsText[index]),
  );

  // проверка того, что на уровне lvl1 все сообщения корректные
  const fixtureLvl1ChatMessages = [
    //формируем массив сообщений из фикстуры
    chatFixtures.fixtureWelcomeMessage, // первое всегда идет приветственно сообщение
    chatFixtures.fixtureWelcomeButtonText, // затем сообщение, в которое превратилась приветственная кнопка
    ...chatFixtures.fixtureLvl1MessagesText, // затем текст все остальных сообщений
  ];
  chatPluginLvl1Screen.chatLvl1Messages.forEach((message, index) => {
    expect(message).toBeVisible();
    expect(message).toHaveTextContent(fixtureLvl1ChatMessages[index]);
  });
});

// проверка того, что закрывающая кнопка работает, модальное окно закрывается
// и появляется кнопка открыть чат
test('close button closing chat window', async () => {
  const user = userEvent.setup();
  const chatPluginLvl1Screen = new ChatPluginLvl1Screen(screen, user);
  await act(async () => chatPluginLvl1Screen.clickCloseButton()); // жмем кнопку закрыть
  await waitForElementToBeRemoved(chatPluginLvl1Screen.dialog); // и ждем, пока окно чата закроется
  const chatPluginStartButton = new ChatPluginStartButton(screen, user);
  expect(chatPluginLvl1Screen.dialog).not.toBeVisible();
  expect(chatPluginStartButton.startChatButton).toBeVisible();
  expect(chatPluginStartButton.startChatButton).toBeEnabled();
});

// проверка того, что при нажатии кнопок происходит скролл
test('chat is scrolling after button click', async () => {
  const user = userEvent.setup();
  const scrollToSpy = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollToSpy;
  const chatPluginLvl1Screen = new ChatPluginLvl1Screen(screen, user);
  await act(async () => chatPluginLvl1Screen.clickLvl1ChatButton()); // жмем кнопку
  expect(scrollToSpy).toHaveBeenCalledOnce(); // и проверяем, что мокнутая функция вызывалась 1 раз
  const chatPluginWelcomeScreen = new ChatPluginWelcomeScreen(screen, user);
  await act(async () => chatPluginWelcomeScreen.clickChatWelcomeButton()); // жмем кнопку Welcome,
  // так как после любой кнопки 1 уровня открывается снова приветственный чат
  expect(scrollToSpy).toHaveBeenCalledTimes(2); // и проверяем, что мокнутая функция теперь вызывалась 2 раза
});
