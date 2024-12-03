import steps from './example-steps.js'; // мои кастомные шаги

export const chatFixtures = {
  startChatButtonName: 'Открыть Чат',
  dialogBoxName: 'Виртуальный помощник',
  closeButtonName: 'Close',
  avatarImageName: 'tota',
  fixtureWelcomeMessage: steps[0].messages[0],
  fixtureWelcomeButtonText: steps[0].buttons[0].text,
  fixtureLvl1ButtonsText: steps[1].buttons.map((button) => button.text),
  fixtureLvl1MessagesText: steps[1].messages,
  defaultChatStyle: 'position: absolute; bottom: 20px; right: 20px;',
};
