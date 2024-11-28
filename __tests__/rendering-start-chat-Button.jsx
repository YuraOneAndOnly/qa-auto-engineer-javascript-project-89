import { test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatBot from '@hexlet/chatbot-v2';
import steps from '../__fixtures__/example-steps.js'; // мои кастомные шаги
import { chatFixtures } from '../__fixtures__/chat-fixtures.js';

window.HTMLElement.prototype.scrollIntoView = function () {}; // mock функции current.scrollIntoView , так как она отсутствует в jsdom

const defaultStyle = 'position: absolute; bottom: 20px; right: 20px;';

beforeEach(async () => {
  await render(ChatBot(steps));
});

const getButtonByName = (buttonName) => {
  return screen.getByRole('button', { name: buttonName });
};

test('button is correct', async () => {
  const startButton = await getButtonByName(chatFixtures.startChatButtonName);
  expect(startButton).toBeVisible();
  expect(startButton).toHaveStyle(defaultStyle);
});
