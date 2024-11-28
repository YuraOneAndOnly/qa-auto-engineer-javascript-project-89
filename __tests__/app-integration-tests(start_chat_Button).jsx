import { test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App.jsx';

window.HTMLElement.prototype.scrollIntoView = function () {}; // mock функции current.scrollIntoView , так как она отсутствует в jsdom

const startChatButtonName = 'Открыть Чат';
const defaultStyle = 'position: absolute; bottom: 20px; right: 20px;';

beforeEach(async () => {
  await render(<App />);
});

const getButtonByName = (buttonName) => {
  return screen.getByRole('button', { name: buttonName });
};

test('button is correct', async () => {
  const startButton = await getButtonByName(startChatButtonName);
  expect(startButton).toBeVisible();
  expect(startButton).toHaveStyle(defaultStyle);
});
