export class Loger {
  
  constructor() { }

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