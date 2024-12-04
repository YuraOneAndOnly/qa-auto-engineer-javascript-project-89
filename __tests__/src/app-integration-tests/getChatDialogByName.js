export default function getChatDialogByName(screen, dialogBoxName) {
  return screen.getByRole('dialog', { name: dialogBoxName });
}
