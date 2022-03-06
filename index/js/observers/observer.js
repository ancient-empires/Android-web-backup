/** @interface */
export default class Observer {
  /** Receive a value and let the observer react to this value.
   * @param { any } value value to react to.
   */
  receive(value) {
  }
}
