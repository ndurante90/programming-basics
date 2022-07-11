import { keyValues } from "../utils.js";

const possibleValues = [
  { ambata: 11.23 },
  { ambo: 250 },
  { terno: 4500 },
  { quaterna: 120000 },
  { cinquina: 6000000 },
];

export class Bet {
  type;
  value;

  constructor(type) {
    this.type = type;
    this.value = this.getFullGrossValue(type);
  }

  /**
   * Return the numbers of values to be checked
   * to determine if a specific bet is a winning or not.
   * @returns {number} - number of values to be checked
   */
  getNumbersToChecked() {
    return keyValues(possibleValues).indexOf(this.type) + 1;
  }

  /**
   * Return the maximum gross value for bet with key value equals to type
   * or 0 if type is not a valid value
   * @param {string} type
   * @returns - a value that represent the maximum gross value for bet with key value equals to type
   */
  getFullGrossValue(type) {
    const values = Object.values(possibleValues);
    const value = values.find((value) => Object.keys(value)[0] === type);
    return value ? Object.values(value)[0] : 0;
  }

  /**
   * Validate bet checking the type
   * @param {any} betType
   * @returns {Array<string>} - an array of validation errors
   */
  static validate(betType) {
    let errors = [];
    betType = betType.toLowerCase();

    if (!keyValues(possibleValues).find((value) => value === betType)) {
      errors.push(
        "TypeOfBill should be one of (ambata, ambo, terno, quaterna, cinquina)"
      );
    }

    return errors;
  }
}
