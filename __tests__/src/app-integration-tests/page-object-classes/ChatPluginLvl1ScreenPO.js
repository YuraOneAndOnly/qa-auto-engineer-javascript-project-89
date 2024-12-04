import { chatFixtures } from '../../../../__fixtures__/chat-fixtures.js';
import getChatDialogByName from '../getChatDialogByName.js';
import getChatDialogBoxName from '../getChatDialogBoxName.js';
import getButtonByName from '../getButtonByName.js';
import getAllAvatarImagesByName from '../getAllAvatarImagesByName.js';

export default class ChatPluginLvl1Screen {
  constructor(screen, user) {
    this.screen = screen;
    this.user = user;
    this.dialog = getChatDialogByName(this.screen, chatFixtures.dialogBoxName);
    this.dialogBoxName = getChatDialogBoxName(this.dialog);
    this.closeButton = getButtonByName(this.screen, chatFixtures.closeButtonName);
    this.avatarImages = getAllAvatarImagesByName(screen, chatFixtures.avatarImageName);
    this.welcomeButtonAsMessage = this.dialog.querySelector('.message.message-right>.message-body');
    this.chatLvl1Buttons = chatFixtures.fixtureLvl1ButtonsText
      .map((buttonText) => getButtonByName(this.screen, buttonText));
    this.chatLvl1Messages = this.dialog.querySelectorAll('.message-body>.mb-0');
  }

  async clickCloseButton() {
    await this.user.click(this.closeButton);
  }

  async clickLvl1ChatButton() {
    await this.user.click(this.chatLvl1Buttons[1]);
  }
}
