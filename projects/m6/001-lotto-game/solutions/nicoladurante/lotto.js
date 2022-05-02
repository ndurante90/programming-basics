import { View } from "./view.js";
import { getFieldsValues, getNumbers } from "./utils.js";
import { Ticket } from "./model/ticket.js";

let lotto;
let view = new View();

document.addEventListener("DOMContentLoaded", start);

export class Lotto {
  ticketsNumber;
  currentStep;
  tickets;

  constructor() {}

  /**
   * Init variables and display the first step
   * of the game
   */
  loadGame() {
    this.ticketsNumber = 0;
    this.currentStep = 1;
    this.tickets = [];
    this.updateUI(this.setTicketsNumber);
  }

  /**
   * Update the UI by rendering new template
   * and handle the next action.
   * If execAction is true executes the action immediately after template rendering
   * otherwise assign action to "Next Step" button.
   * @param {function} action
   * @param {data} data
   */
  updateUI(action, data = null, execAction = false) {
    view.renderView(this.currentStep, data);

    //handle action
    if (execAction && action) {
      action();
    } else {
      view.assignActionToButton("action-btn", action);
    }
  }

  /**
   * Render errors on the view
   * @param {any} errors
   */
  handleErrors(errors) {
    view.renderErrors(errors);
  }

  /**
   * Read number from input value and check if is a valid number
   * If not valid call handleErrors, otherwise updates UI
   */
  setTicketsNumber = () => {
    let number = Number(document.getElementById("ticketsNumber").value);
    let error;

    if (isNaN(number) || !Number.isInteger(number)) {
      error = new Error("The value must be an integer number");
    }

    if (Number.isInteger(number)) {
      if (number < 1 || number > 5) {
        error = new Error("Number must be in the range 1 - 5");
      } else {
        this.ticketsNumber = number;
        this.currentStep++;
      }
    }

    if (error) {
      this.handleErrors(error);
    } else {
      this.updateUI(this.askBetTypeAndAmount, this.ticketsNumber);
    }
  };

  /**
   * Read field values from DOM and try to construct a ticket.
   * If construction failed call handleErrors else updateUI
   */
  askBetTypeAndAmount = () => {
    let errors = [];
    for (let index = 1; index <= this.ticketsNumber; index++) {
      let [amount, betValue, wheel] = getFieldsValues([
        `#bill-${index}-amount`,
        `#bill-${index}-type`,
        `#wheel-${index}`,
      ]);

      try {
        let ticket = Ticket.constructTicket(amount, betValue, wheel);
        this.tickets.push(ticket);
      } catch (err) {
        this.tickets = [];
        errors = [...errors, err];
      }
    }

    if (errors.length == 0) {
      this.currentStep++;
      this.updateUI(this.generateNumbers, null, true);
    } else {
      this.handleErrors(errors);
    }
  };

  /**
   * Generate numbers for a ticket and updateUI after 3000 milliseconds
   */
  generateNumbers = () => {
    this.tickets.forEach((ticket) => {
      let range = getNumbers(1, 90);

      for (let i = 1; i <= ticket.amountOfNumbers; i++) {
        let index = Math.floor(Math.random() * range.length);
        ticket.addNumber(range[index]);
        range.splice(index, 1);
      }
    });

    this.currentStep++;

    setTimeout(() => {
      this.updateUI(null, this.tickets, true);
    }, 3000);
  };
}

function start() {
  lotto = new Lotto();
  lotto.loadGame();
}
