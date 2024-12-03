import { chatFixtures } from '../../../__fixtures__/chat-fixtures.js';

const getChatDialogByName = (screen, dialogBoxName) => {
  return screen.getByRole('dialog', { name: dialogBoxName });
};

const getChatDialogBoxName = (dialog) => {
  return dialog.querySelector('.modal-header').textContent;
};

const getCloseButtonByName = (screen, closeButtonName = 'Close') => {
  return screen.getByRole('button', {
    name: closeButtonName,
  });
};

const getAllAvatarImagesByName = (screen, avatarImageName) => {
  return screen.getAllByRole('img', { name: avatarImageName });
};

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
    this.dialog = getChatDialogByName(this.screen, chatFixtures.dialogBoxName);
    this.dialogBoxName = getChatDialogBoxName(this.dialog);
    this.closeButton = getCloseButtonByName(this.screen, chatFixtures.closeButtonName);
    this.avatarImages = getAllAvatarImagesByName(screen, chatFixtures.avatarImageName);
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
    this.dialog = getChatDialogByName(this.screen, chatFixtures.dialogBoxName);
    this.dialogBoxName = getChatDialogBoxName(this.dialog);
    this.closeButton = getCloseButtonByName(this.screen, chatFixtures.closeButtonName);
    this.avatarImages = getAllAvatarImagesByName(screen, chatFixtures.avatarImageName);
    this.welcomeButtonAsMessage = this.dialog.querySelector('.message.message-right>.message-body');
    this.chatLvl1Buttons = chatFixtures.fixtureLvl1ButtonsText.map((buttonText) =>
      this.screen.getByRole('button', {
        name: buttonText,
      }),
    );
    this.chatLvl1Messages = this.dialog.querySelectorAll('.message-body>.mb-0');
  }
  async clickCloseButton() {
    await this.user.click(this.closeButton);
  }
  async clickLvl1ChatButton() {
    await this.user.click(this.chatLvl1Buttons[1]);
  }
}

export const sortHTMLElementsByTextContent = (HTMLElements) => {
  return HTMLElements.toSorted((a, b) => {
    if (a.textContent > b.textContent) {
      return 1;
    }
    if (a.textContent < b.textContent) {
      return -1;
    }
    return 0;
  });
};
