import { mainAppElements } from '../../../../__fixtures__/main-app-elements.js';

export class MainAppResultScreen {
  constructor(screen, user) {
    this.screen = screen;
    this.user = user;
    this.resultTable = this.screen.getByRole('table', {
      name: mainAppElements.resultScreen.resultTable.name,
    });
    this.backButton = this.screen.getByRole('button', {
      name: mainAppElements.resultScreen.backButton.name,
    });
  }

  async backToRegisterScreen() {
    await this.user.click(this.backButton);
  }
}
