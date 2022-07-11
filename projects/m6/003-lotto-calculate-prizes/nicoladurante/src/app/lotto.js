import { View } from "./view.js";
import { getFieldsValues, generateNumbers } from "./utils.js";
import { Ticket } from "./model/ticket.js";
import { Extraction } from "./model/extraction.js";

document.addEventListener("DOMContentLoaded", start);

export class Lotto {
  ticketsNumber;
  currentStep;
  tickets;
  errors;
  extraction;
  view;

  constructor() {
    this.ticketsNumber = 0;
    this.currentStep = 1;
    this.tickets = [];
    this.errors = null;
    this.extraction = null;
    this.view = new View();
  }

  /**
   * Display the first step
   * of the game
   */
  loadGame() {
    this.updateUI(this.setTicketsNumber);
  }

  /**
   * Update the UI by rendering a new template if no errors have been detected
   * otherwise display a list of errors at the top of template.
   * If execAction is true executes the action immediately after template rendering
   * otherwise assign action to "Next Step" button.
   * @param {function} action
   * @param {boolean} execAction
   * @param {any} data
   */
  updateUI(action, execAction = false, ...data) {
    //If there are errors, call view.renderErrors to display them
    if (this.errors) {
      this.view.renderErrors(this.errors);
      return;
    }

    this.view.renderView(this.currentStep, data);

    /*After new UI rendering, assign a new action to the button
    or executes immediately*/
    if (!execAction) {
      this.view.assignActionToButton("action-btn", action);
    } else {
      if (action) action();
    }
  }

  /**
   * Read a value from input field and check if it is a valid number
   * Updates UI
   */
  setTicketsNumber = () => {
    const value = Number(document.getElementById("ticketsNumber").value);

    /*If the value is not a number or is not an integer, creates a new Error object
      and assign it to error variable
    */
    if (isNaN(value) || !Number.isInteger(value)) {
      this.errors = [new Error("The value must be an integer number")];
    }

    /*If the value is an integer between 1 to 5 assign it to ticketsNumber variable
      and increment currentStep variable, otherwise creates a new Error object
      and assign it to error variable */
    if (Number.isInteger(value)) {
      if (value < 1 || value > 5) {
        this.errors = [new Error("Number must be in the range 1 - 5")];
      } else {
        this.errors = null;
        this.ticketsNumber = value;
        this.currentStep++;
      }
    }

    //Refresh UI
    this.updateUI(this.askBetTypeAndAmount, false, this.ticketsNumber);
  };

  /**
   * Call getTickets function for a number of times equals to ticketsNumber variable
   * At the end of operation if no errors have been detected, increment application step by 1
   * and updates with new template, otherwise display errors in the current template
   */
  askBetTypeAndAmount = () => {
    this.errors = null;

    //create an array of [0, 1, ...this.ticketsNumbers] keys
    const array = Array.from(Array(this.ticketsNumber).keys());

    this.tickets = array.reduce((acc, i) => this.getTickets(acc, i), []);

    //If no errors increment the application step
    if (!this.errors) {
      this.currentStep++;
    }
    //Refresh the UI
    this.updateUI(this.generateTicketsNumbers, true, null);
  };

  /**
   * Generate numbers for each ticket, increment step
   * and updates UI after 3 seconds.
   */
  generateTicketsNumbers = () => {
    this.tickets.forEach(generateNumbers);

    this.currentStep++;

    setTimeout(() => {
      this.updateUI(this.createFakeExtraction, false, this.tickets);
    }, 3000);
  };

  /**
   * Create a new extraction, increment step and updates UI.
   * After 3 seconds call printWinnerTickets to display the winner tickets
   */
  createFakeExtraction = () => {
    this.extraction = new Extraction();
    this.currentStep++;

    this.updateUI(this.extraction.generateExtractionsOnWheels, true, null);

    setTimeout(this.printWinnerTickets, 3000);
  };

  /**
   * Calculate winnings for each ticket, increment step
   * and updates UI
   */
  printWinnerTickets = () => {
    /*calculate winnings for each ticket and filter tickets 
      with at least one winning */

    this.tickets.forEach((ticket) => this.extraction.calculateWinnings(ticket));
    let winnerTickets = this.tickets.filter(
      (ticket) => ticket.winnings.length > 0
    );
    this.currentStep++;

    //updates ui with the winnerTickets
    this.updateUI(null, false, winnerTickets, this.extraction);
  };

  /**
   * Function that read values from DOM fields and tries to
   * create a new Ticket: if ticket creation is successful
   * push new element in tickets array and returns the updated
   * array, otherwise append a new error on Errors array
   * and clear tickets array
   * @param {Array<Ticket>} tickets
   * @param {number} ticketIndex
   * @returns {Array<Ticket>} tickets
   */
  getTickets(tickets, ticketIndex) {
    //Call getFieldsValues to read values from DOM input field
    let [amount, betValue, wheel, moneyAmt] = getFieldsValues([
      `#bill-${ticketIndex + 1}-amount`,
      `#bill-${ticketIndex + 1}-type`,
      `#wheel-${ticketIndex + 1}`,
      `#bill-${ticketIndex + 1}-moneyAmt`,
    ]);

    /* Try to construct new Tickets object. If there is at least one error
       clean tickets array and push errors in errors array */
    try {
      const ticket = Ticket.constructTicket(amount, betValue, wheel, moneyAmt);
      tickets = [...tickets, ticket];
    } catch (err) {
      tickets = [];
      this.errors = this.errors ?? [];
      this.errors = [...this.errors, err];
    }

    return tickets;
  }
}

function start() {
  const lotto = new Lotto();
  lotto.loadGame();
}
