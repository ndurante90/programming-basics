const possibleValues = ["ambata", "ambo", "terno", "quaterna", "cinquina"];

export class Bet {
  type;

  constructor(type) {
    this.type = type;
  }

  getNumbersToChecked() {
    return possibleValues.indexOf(this.type) + 1;
  }

  /**
   * Validate bet checking the type
   * @param {any} betType
   * @returns {Array<string>} - an array of validation errors
   */
  static validate(betType) {
    let errors = [];

    if (
      !possibleValues.find((val) => val === betType.toString().toLowerCase())
    ) {
      errors.push(
        "TypeOfBill should be one of (ambata, ambo, terno, quaterna, cinquina)"
      );
    }

    return errors;
  }
}
