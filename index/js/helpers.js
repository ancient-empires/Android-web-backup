/**
 * Navigate to a specific hash on the current page.
 * If the hash is empty, then remove the `#` in the URL.
 *
 * @param { string } hash
 */
export const navigateToHash = (hash = '') => {
  window.location.hash = hash;
  if (hash.length === 0) {
    window.history.replaceState(null, document.title,
        document.location.pathname);
  }
};
