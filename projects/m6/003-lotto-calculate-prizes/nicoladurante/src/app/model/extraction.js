import { cities } from "./wheel.js";
import { getNumbers } from "../utils.js";
import { Winning } from "./winnings.js";
import { Ticket } from "./ticket.js";

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

  /**
   * Function that check if a ticket is a winner ticket for the current
   * WheelExtraction
   * @param {Ticket} ticket
   * @returns {boolean} - a boolean that represent if a ticket is winner or not
   */
  isWinnerTicket(ticket) {
    //Check if the parameter is not null and is a valid instance of Ticket class
    if (ticket && ticket instanceof Ticket) {
      const ticketWheelCity = ticket.getWheel().getCity();
      const ticketNumbers = ticket.getNumbers();
      const totalOfNumbersToBeChecked = ticket.getBet().getNumbersToChecked();

      let counter = 0;

      //Check that ticket wheel has value "Tutte" or equals to current wheelExtraction wheel
      //If not the ticket is a "loser ticket" for sure and returns false
      if (ticketWheelCity === "Tutte" || ticketWheelCity === this.wheel) {
        for (let number of ticketNumbers) {
          if (this.numbers.includes(number)) {
            counter++;
          }

          if (counter === totalOfNumbersToBeChecked) {
            return true;
          }
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

  constructor() {
    this.extractionDate = new Date().toLocaleDateString("it-IT");
    this.extractionsOnWheels = [];
  }

  /**
   * Generate a combination of 5 numbers from 1 to 90 for each wheel
   * and fill extractionsOnWheels array
   */
  generateExtractionsOnWheels = () => {
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
  };

  /**
   * Calculate and push winnings for a particular ticket
   * @param {Ticket} ticket
   */
  calculateWinnings(ticket) {
    this.extractionsOnWheels.forEach((wheelExtraction) => {
      if (wheelExtraction.isWinnerTicket(ticket)) {
        const amountOfNumbers = ticket.amountOfNumbers;
        const amountOfMoney = ticket.amountOfMoney;
        const betValue = ticket.getBet().value;
        const grossValue = parseFloat(
          (amountOfMoney * (betValue / amountOfNumbers)).toFixed(2)
        );
        const winning = new Winning(wheelExtraction.wheel, grossValue);
        ticket.winnings.push(winning);
      }
    });
  }
}
