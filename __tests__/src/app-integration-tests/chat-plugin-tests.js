import { chatFixtures } from '../../../__fixtures__/chat-fixtures.js';

const getChatDialogByName = (screen, dialogBoxName) => {
  return screen.getByRole('dialog', { name: dialogBoxName });
};

const getChatDialogBoxName = (dialog) => {
  return dialog.querySelector('.modal-header').textContent;
};

const getButtonByName = (screen, buttonName) => {
  return screen.getByRole('button', {
    name: buttonName,
  });
};

const getAllAvatarImagesByName = (screen, avatarImageName) => {
  return screen.getAllByRole('img', { name: avatarImageName });
};

export class ChatPluginStartButton {
  constructor(screen, user = null) {
    this.screen = screen;
    this.user = user;
    this.startChatButton = getButtonByName(this.screen, chatFixtures.startChatButtonName);
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
    this.closeButton = getButtonByName(this.screen, chatFixtures.closeButtonName);
    this.avatarImages = getAllAvatarImagesByName(screen, chatFixtures.avatarImageName);
    this.chatMessagesBodies = this.dialog.querySelectorAll('.message-body');
    this.chatWelcomeButton = getButtonByName(this.screen, chatFixtures.fixtureWelcomeButtonText);
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
    this.closeButton = getButtonByName(this.screen, chatFixtures.closeButtonName);
    this.avatarImages = getAllAvatarImagesByName(screen, chatFixtures.avatarImageName);
    this.welcomeButtonAsMessage = this.dialog.querySelector('.message.message-right>.message-body');
    this.chatLvl1Buttons = chatFixtures.fixtureLvl1ButtonsText.map((buttonText) =>
      getButtonByName(this.screen, buttonText),
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
