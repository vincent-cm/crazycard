export class Util {
  public static capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  public static isValidDate(arg) {
    const minDate = new Date('1900-01-01 00:00:01');
    const maxDate = new Date('2099-12-31 00:00:01');
    const date = new Date(arg);
    return date > minDate && date < maxDate;
  }
}
