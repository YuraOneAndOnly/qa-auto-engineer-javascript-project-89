import { test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App.jsx';
import { chatFixtures } from '../__fixtures__/chat-fixtures.js';

window.HTMLElement.prototype.scrollIntoView = function () {}; // mock функции current.scrollIntoView , так как она отсутствует в jsdom

beforeEach(async () => {
  await render(<App />);
});

const getButtonByName = (buttonName) => {
  return screen.getByRole('button', { name: buttonName });
};

test('button is correct', async () => {
  const startButton = await getButtonByName(chatFixtures.startChatButtonName);
  expect(startButton).toBeVisible();
  expect(startButton).toHaveStyle(chatFixtures.defaultChatStyle);
});
