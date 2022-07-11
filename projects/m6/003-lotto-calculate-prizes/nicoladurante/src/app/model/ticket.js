import { Bet } from "./bet.js";
import { Wheel } from "./wheel.js";

export class Ticket {
  amountOfNumbers;
  bet;
  wheel;
  numbers;
  winnings;
  amountOfMoney;

  constructor(amount, betType, wheelCity, amountOfMoney) {
    this.amountOfNumbers = +amount;
    this.bet = new Bet(betType);
    this.wheel = new Wheel(wheelCity);
    this.numbers = [];
    this.winnings = [];
    this.amountOfMoney = +amountOfMoney;
  }

  getWheel() {
    return this.wheel;
  }

  getNumbers() {
    return this.numbers;
  }

  getBet() {
    return this.bet;
  }

  /**
   * Add a new number to ticket
   * @param {number} value
   */
  addNumber(value) {
    this.numbers.push(value);
  }

  /** Returns a new ticket object. If there are
   *  validation errors throw an error
   * @param {any} amount
   * @param {any} betType
   * @param {any} wheelCity
   * @returns {Ticket} - a new Ticket object
   */
  static constructTicket(amount, betType, wheelCity, amountOfMoney) {
    let errors = [
      ...Ticket.validate(amount),
      ...Bet.validate(betType),
      ...Wheel.validate(wheelCity),
      ...Ticket.validateAmountOfMoney(amountOfMoney),
    ];

    if (errors.length > 0) {
      throw new Error("Errors in ticket creation phase: " + errors.join(","));
    }

    return new Ticket(amount, betType, wheelCity, amountOfMoney);
  }

  /**
   * Validate ticket checking amount
   * @param {any} amount
   * @returns {Array<string>} - an array of validation errors
   */
  static validate(amount) {
    const errors = [];
    const convertedAmount = Number(amount);

    if (isNaN(convertedAmount) || !Number.isInteger(convertedAmount)) {
      errors.push("Amount is not an integer number");
    }

    if (convertedAmount < 1 || convertedAmount > 10) {
      errors.push("Amount must be in the range 1 to 10");
    }

    return errors;
  }

  static validateAmountOfMoney(amountOfMoney) {
    const errors = [];
    //unary plus operator that converts string represented number to number represention
    const amount = +amountOfMoney;

    if (!amount) {
      errors.push("Amount of money needs to be a number greater than 0");
    }

    return errors;
  }
}
