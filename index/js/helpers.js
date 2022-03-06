/**
 * Navigate to a specific hash on the current page.
 * If the hash is empty, then remove the `#` sign in the URL.
 *
 * @param { string } hash the hash location to navigate to.
 * @param { boolean } replace if `true`, then replace the current
 *   entry in browser history, instead of appending to it.
 *   (Default is `false`)
 */
export const navigateToHash = (hash = '', replace = false) => {
  if (replace) {
    window.location.replace(`#${hash}`);
  } else {
    window.location.hash = hash;
  }

  if (hash === '') {
    // remove the `#` sign in the URL
    window.history.replaceState(null, document.title,
        document.location.pathname);
  }
};
