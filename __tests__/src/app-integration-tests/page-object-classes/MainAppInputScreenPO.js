import { mainAppElements } from '../../../../__fixtures__/main-app-elements.js';

export default class MainAppInputScreen {
  constructor(screen, user) {
    this.screen = screen;
    this.user = user;
    this.emailTextbox = this.screen.getByRole('textbox', {
      name: mainAppElements.inputScreen.emailTextbox.name,
    });
    this.passwordTextbox = this.screen.getByLabelText(
      mainAppElements.inputScreen.passwordTextbox.name,
    );
    this.addressTextbox = this.screen.getByRole('textbox', {
      name: mainAppElements.inputScreen.addressTextbox.name,
    });
    this.cityTextbox = this.screen.getByRole('textbox', {
      name: mainAppElements.inputScreen.cityTextbox.name,
    });
    this.countryCombobox = this.screen.getByRole('combobox', {
      name: mainAppElements.inputScreen.countryCombobox.name,
    });
    this.rulesCheckbox = this.screen.getByRole('checkbox', {
      name: mainAppElements.inputScreen.rulesCheckbox.name,
    });
    this.registerButton = this.screen.getByRole('button', {
      name: mainAppElements.inputScreen.registerButton.name,
    });
  }

  async register(email, password, address, city, countryOptionIndex = 0, rulesAccepted = false) {
    await this.user.type(this.emailTextbox, email);
    await this.user.type(this.passwordTextbox, password);
    await this.user.type(this.addressTextbox, address);
    await this.user.type(this.cityTextbox, city);
    await this.user.selectOptions(
      this.countryCombobox,
      mainAppElements.inputScreen.countryCombobox.options[countryOptionIndex],
    );
    if (rulesAccepted) await this.user.click(this.rulesCheckbox);
    await this.user.click(this.registerButton);
  }

  async clickRegisterButton() {
    await this.user.click(this.registerButton);
  }
}
