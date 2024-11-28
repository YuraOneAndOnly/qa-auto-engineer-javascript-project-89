export const mainAppFixture = {
  fixtureEmail: 'testEmail@testDomain.com',
  fixturePassword: 'testPassword',
  fixtureAddress: 'testAddress',
  fixtureCity: 'testCity',
  fixtureComboboxOptionIndex: 1,
  fixtureInnerHTML:
    '<table class="table"><tbody><tr><td>Принять правила</td><td>true</td></tr><tr><td>Адрес</td><td>testAddress</td></tr><tr><td>Город</td><td>testCity</td></tr><tr><td>Страна</td><td>Аргентина</td></tr><tr><td>Email</td><td>testEmail@testDomain.com</td></tr><tr><td>Пароль</td><td>testPassword</td></tr></tbody></table>',
};

export const wrongEmails = ['test', 'test@', '@test', '@', '@@', 'test@@test'];