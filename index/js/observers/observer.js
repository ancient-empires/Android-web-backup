/** @interface */
export default class Observer {
  /** Receive a value and let the observer react to this value.
   * @param { any } _value value to react to.
   */
  receive(_value) {
  }

  /**
   * Publish a value for all observers in the specified array or set
   * to receive.
   * @param { Observer[] | Set<Observer> } observers
   *   the collection of observers to receive the value.
   * @param { any } value the value to receive.
   */
  static publishTo(observers, value) {
    observers.forEach((observer) => observer.receive(value));
  }
}
