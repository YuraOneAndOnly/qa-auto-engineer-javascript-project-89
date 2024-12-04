import { chatFixtures } from '../../../../__fixtures__/chat-fixtures.js';
import { getChatDialogByName } from '../getChatDialogByName.js';
import { getChatDialogBoxName } from '../getChatDialogBoxName.js';
import { getButtonByName } from '../getButtonByName.js';
import { getAllAvatarImagesByName } from '../getAllAvatarImagesByName.js';

export class ChatPluginWelcomeScreen {
  constructor(screen, user) {
    this.screen = screen;
    this.user = user;
    this.dialog = getChatDialogByName(this.screen, chatFixtures.dialogBoxName);
    this.dialogBoxName = getChatDialogBoxName(this.dialog);
    this.closeButton = getButtonByName(this.screen, chatFixtures.closeButtonName);
    this.avatarImages = getAllAvatarImagesByName(screen, chatFixtures.avatarImageName);
    this.chatMessagesBodies = this.dialog.querySelectorAll('.message-body');
    this.chatWelcomeButton = getButtonByName(this.screen, chatFixtures.fixtureWelcomeButtonText);
  }
  async clickChatWelcomeButton() {
    await this.user.click(this.chatWelcomeButton);
  }
}
