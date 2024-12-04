export default function getButtonByName(screen, buttonName) {
  return screen.getByRole('button', {
    name: buttonName,
  });
}
