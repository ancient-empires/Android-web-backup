/**
 * Normalize a hash.
 * For `undefined`, `null`, `''`, or `#`:
 * - If @param keepHashOnEmpty is true, then return `#`.
 * - Otherwise return empty string.
 *
 * Otherwise, for a normal @param hash:
 * - If hash starts with `#`, return original hash.
 * - Otherwise, add `#` at the beginning.
 *
 * @param { ?string | undefined } hash the hash to normalize.
 * @param { boolean } keepHashOnEmpty whether to keep `#`
 *   for empty hash. (Default is `false`)
 * @return { string } normalized hash.
 */
export const normalizeHash = (hash = '', keepHashOnEmpty = false) => {
  switch (hash) {
    case undefined:
    case null:
    case '':
    case '#':
      return keepHashOnEmpty ? '#' : '';
    default:
      return hash.startsWith('#') ? hash : `#${hash}`;
  }
};

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
  hash = normalizeHash(hash, true);

  if (replace) {
    window.location.replace(hash);
  } else {
    window.location.hash = hash;
  }

  if (window.location.hash === '') {
    // remove the `#` sign in the URL
    window.history.replaceState(null, document.title,
        window.location.pathname);
  }
};

/**
 * Navigate to top hash.
 * @param { boolean } replace if `true`, then replace the current
 *   entry in browser history, instead of appending to it.
 *   (Default is `false`)
*/
export const navigateToTopHash = (replace = false) => {
  navigateToHash('', replace);
};

/**
 * Add provided elements to a set.
 * @param { Set } set The set to add elements to.
 * @param { ...any } elements Elements to add.
*/
export const addToSet = (set, ...elements) => {
  elements.forEach((element) => set.add(element));
};

/**
 * Remove provided elements from a set.
 * Hint: Use removeFromSet(set, ...set) to remove all elements.
 *
 * @param { Set } set The set to remove elements from.
 * @param { ...any } elements Elements to remove.
 */
export const removeFromSet = (set, ...elements) => {
  elements.forEach((element) => set.delete(element));
};
