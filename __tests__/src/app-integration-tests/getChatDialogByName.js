export const getChatDialogByName = (screen, dialogBoxName) => {
  return screen.getByRole('dialog', { name: dialogBoxName });
};
