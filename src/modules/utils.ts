export class Utils {

  constructor() { }

  /** Vrátí zda není null nebo prázdný
   * @param vyraz Zkoumaný výraz
   */
  public notEmpty(vyraz: string): boolean {
    if (vyraz !== undefined) {
      return vyraz.length > 0;
    }
    return false;
  }
}
