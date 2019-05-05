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

  /** Vypíše do konzole zprávu.
   * @param msg Obsah logu
   * @param type Typ logu
   * @param important Zvíraznění logu (error je vždy zvírazněn)
   */
  public log(msg: string, type?: 'info' | 'database' | 'warning' | 'error', important?: boolean) {
    const info = 'color: blue;';
    const database = 'color: green;';
    const warning = 'text-decoration: underline;';
    const error = 'background: red; text-decoration: underline;';
    const dulezite = ' font-weight: bold;';
    const impMsg = important || type === 'error' ? '>>> ' : '';
    let style: string;
    switch (type) {
      case 'info':
        style = info;
        break;
      case 'database':
        style = database;
        break;
      case 'warning':
        style = warning;
        break;
      case 'error':
        style = error;
        break;
      default:
        style = info;
        break;
    }
    if (important || type === 'error') {
      style += dulezite;
    }
    console.log(impMsg + '%c' + msg + '\n', style);
  }
}
