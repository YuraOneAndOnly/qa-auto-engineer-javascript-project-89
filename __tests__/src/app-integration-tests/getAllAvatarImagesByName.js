export const getAllAvatarImagesByName = (screen, avatarImageName) => {
  return screen.getAllByRole('img', { name: avatarImageName });
};
