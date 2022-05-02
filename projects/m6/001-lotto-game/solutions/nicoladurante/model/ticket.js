import { Bet } from "./bet.js";
import { Wheel } from "./wheel.js";

export class Ticket {
  amountOfNumbers;
  bet;
  wheel;
  timestamp;
  numbers;

  constructor(amount, betType, wheelCity) {
    this.amountOfNumbers = amount;
    this.bet = new Bet(betType);
    this.wheel = new Wheel(wheelCity);
    this.timestamp = Date.now();
    this.numbers = [];
  }

  addNumber(value) {
    this.numbers.push(value);
  }

  static constructTicket(amount, betType, wheelCity) {
    let errors = [
      ...Ticket.validate(amount),
      ...Bet.validate(betType),
      ...Wheel.validate(wheelCity),
    ];

    if (errors.length > 0) {
      throw new Error("Errors in ticket creation phase: " + errors.join(","));
    }

    return new Ticket(amount, betType, wheelCity);
  }

  static validate(amount) {
    let errors = [];
    let convertedAmount = Number(amount);

    if (isNaN(convertedAmount) || !Number.isInteger(convertedAmount)) {
      errors.push("Amount is not an integer number");
    }

    if (convertedAmount < 1 || convertedAmount > 10) {
      errors.push("Amount must be in the range 1 to 10");
    }

    return errors;
  }
}
