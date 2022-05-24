import { cities } from "./wheel.js";
import { getNumbers } from "../utils.js";

/**
 * A class that describes an extraction on a single wheel
 */
export class WheelExtraction {
  wheel;
  numbers;

  constructor() {
    this.wheel = "";
    this.numbers = [];
  }

  isWinnerTicket(ticket) {
    let wheel = ticket.wheel.city;
    let ticketNumbers = ticket.numbers;
    let numbersToBeChecked = ticket.bet.getNumbersToChecked();
    let counter = 0;

    if (wheel === "Tutte" || this.wheel === wheel) {
      for (let number of ticketNumbers) {
        if (this.numbers.includes(number)) {
          counter++;
        }

        if (counter === numbersToBeChecked) {
          return true;
        }
      }
    }

    return false;
  }
}

/**
 * A class that describes a lotto extraction
 */
export class Extraction {
  extractionDate;
  extractionsOnWheels;
  winnerTickets;

  constructor() {
    this.extractionDate = new Date().toLocaleDateString("it-IT");
    this.extractionsOnWheels = [];
    this.winnerTickets = [];
  }

  /**
   * Generate a combination of 5 numbers from 1 to 90 for each wheel
   * and fill extractionsOnWheels array
   */
  generateExtractionsOnWheels() {
    let wheels = cities.filter((value) => value !== "Tutte");

    wheels.forEach((city) => {
      let wheelExtraction = new WheelExtraction();
      wheelExtraction.wheel = city;

      let range = getNumbers(1, 90);

      for (let i = 1; i <= 5; i++) {
        let index = Math.floor(Math.random() * range.length);
        wheelExtraction.numbers = [...wheelExtraction.numbers, range[index]];
        range.splice(index, 1);
      }

      this.extractionsOnWheels = [...this.extractionsOnWheels, wheelExtraction];
    });
  }
}
