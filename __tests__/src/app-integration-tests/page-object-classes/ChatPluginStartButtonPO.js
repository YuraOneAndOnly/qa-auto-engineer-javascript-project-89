import { chatFixtures } from '../../../../__fixtures__/chat-fixtures.js';
import getButtonByName from '../getButtonByName.js';

export default class ChatPluginStartButton {
  constructor(screen, user = null) {
    this.screen = screen;
    this.user = user;
    this.startChatButton = getButtonByName(this.screen, chatFixtures.startChatButtonName);
  }

  async clickStartChatButton() {
    await this.user.click(this.startChatButton);
  }
}
