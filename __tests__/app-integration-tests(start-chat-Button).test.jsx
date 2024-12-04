import { test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App.jsx';
import ChatPluginStartButton from './src/app-integration-tests/page-object-classes/ChatPluginStartButtonPO.js';
import { chatFixtures } from '../__fixtures__/chat-fixtures.js';

window.HTMLElement.prototype.scrollIntoView = function () {}; // mock функции current.scrollIntoView , так как она отсутствует в jsdom

beforeEach(async () => {
  await render(<App />);
});

test('button is correct', async () => {
  const chatPlugin = new ChatPluginStartButton(screen);
  expect(chatPlugin.startChatButton).toBeVisible();
  expect(chatPlugin.startChatButton).toHaveStyle(chatFixtures.defaultChatStyle);
});
