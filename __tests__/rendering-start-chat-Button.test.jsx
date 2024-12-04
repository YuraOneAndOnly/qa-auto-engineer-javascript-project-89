import { test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatBot from '@hexlet/chatbot-v2';
import steps from '../__fixtures__/example-steps.js'; // мои кастомные шаги
import ChatPluginStartButton from './src/app-integration-tests/page-object-classes/ChatPluginStartButtonPO.js';
import { chatFixtures } from '../__fixtures__/chat-fixtures.js';

window.HTMLElement.prototype.scrollIntoView = function () {}; // mock функции current.scrollIntoView , так как она отсутствует в jsdom

beforeEach(async () => {
  await render(ChatBot(steps));
});

test('button is correct', async () => {
  const chatPlugin = new ChatPluginStartButton(screen);
  expect(chatPlugin.startChatButton).toBeVisible();
  expect(chatPlugin.startChatButton).toHaveStyle(chatFixtures.defaultChatStyle);
});
