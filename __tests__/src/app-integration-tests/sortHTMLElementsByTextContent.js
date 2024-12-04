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
