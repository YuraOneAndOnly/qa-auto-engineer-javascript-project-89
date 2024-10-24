import { test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatBot from '@hexlet/chatbot-v2';
import steps from '../__fixtures__/exampleSteps.jsx'; // мои кастомные шаги

window.HTMLElement.prototype.scrollIntoView = function () {}; // mock функции current.scrollIntoView , так как она отсутствует в jsdom

const startChatButtonName = 'Открыть Чат';
const defaultStyle = 'position: absolute; bottom: 20px; right: 20px;';

beforeEach(async () => {
  await render(ChatBot(steps));
});

const getStartButton = async () => {
  return screen.getByRole('button', { name: startChatButtonName });
};

test('button visible', async () => {
  const startButton = await getStartButton();
  expect(startButton).toBeVisible();
});

test('correct button css style', async () => {
  const startButton = await getStartButton();
  expect(startButton).toHaveStyle(defaultStyle);
});
