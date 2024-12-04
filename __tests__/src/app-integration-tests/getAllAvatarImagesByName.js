export default function getAllAvatarImagesByName(screen, avatarImageName) {
  return screen.getAllByRole('img', { name: avatarImageName });
}
