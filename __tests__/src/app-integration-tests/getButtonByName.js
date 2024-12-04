export const getButtonByName = (screen, buttonName) => {
  return screen.getByRole('button', {
    name: buttonName,
  });
};
