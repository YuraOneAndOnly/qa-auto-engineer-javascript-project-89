import { test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ChatBot from '@hexlet/chatbot-v2';
import steps from '../__fixtures__/exampleSteps.jsx'; // мои кастомные шаги
import { act } from 'react';

window.HTMLElement.prototype.scrollIntoView = function () {}; // mock функции current.scrollIntoView , так как она отсутствует в jsdom

const defaultStyle = 'position: absolute; bottom: 20px; right: 20px;';

beforeEach(async () => {
  await render(ChatBot(steps));
});

const getChatButton = async () => {
  return screen.getByRole('button', { name: 'Открыть Чат' });
};

test('button visible', async () => {
  const chatButton = await getChatButton();
  expect(chatButton).toBeVisible();
});

test('correct button css style', async () => {
  const chatButton = await getChatButton();
  expect(chatButton).toHaveStyle(defaultStyle);
});
/*
test('background faded after click', async () => {
  const user = userEvent.setup();
  const chatButton = await getChatButton();
  await act(async () => user.click(chatButton));
  screen.debug();
  screen.getByLabelText
  // expect(chatButton).toHaveStyle(defaultStyle);
  });
*/
