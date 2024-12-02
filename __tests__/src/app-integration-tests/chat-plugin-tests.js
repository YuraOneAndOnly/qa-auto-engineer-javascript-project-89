import { chatFixtures } from '../../../__fixtures__/chat-fixtures.js';

export class ChatPluginStartButton {
  constructor(screen, user = null) {
    this.screen = screen;
    this.user = user;
    this.startChatButton = this.screen.getByRole('button', {
      name: chatFixtures.startChatButtonName,
    });
  }
  async clickStartChatButton() {
    await this.user.click(this.startChatButton);
  }
}

export class ChatPluginWelcomeScreen {
  constructor(screen, user) {
    this.screen = screen;
    this.user = user;
    this.dialog = this.screen.getByRole('dialog', { name: chatFixtures.dialogBoxName });
    this.closeButton = this.screen.getByRole('button', {
      name: 'Close',
    });
    this.avatarImage = this.screen.getByRole('img', { name: chatFixtures.avatarImageName });
    this.chatMessagesBodies = this.dialog.querySelectorAll('.message-body');
    this.chatWelcomeButton = this.screen.getByRole('button', {
      name: chatFixtures.fixtureWelcomeButtonText,
    });
  }
  async clickChatWelcomeButton() {
    await this.user.click(this.chatWelcomeButton);
  }
}

export class ChatPluginLvl1Screen {
  constructor(screen, user) {
    this.screen = screen;
    this.user = user;
    this.chatLvl1Buttons = chatFixtures.fixtureLvl1ButtonsText.map((buttonText) =>
      this.screen.getByRole('button', {
        name: buttonText,
      }),
    );
  }
}
