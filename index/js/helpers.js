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
