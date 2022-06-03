import { cities } from "./model/wheel.js";
import { printSpaces } from "./utils.js";

export class Templates {
  constructor() {}

  /**
   * Create and returns new error wrapper
   * @returns HtmlElement
   */

  getErrorsWrapper() {
    let wrapper = document.createElement("div");
    wrapper.id = "errors";
    wrapper.style.color = "red";
    return wrapper;
  }

  /**
   * Returns a template representing the errors list
   * @param {Array<Error>} errors
   * @returns {HtmlElement} - errorTemplate container element
   */
  errorTemplate(errors) {
    let template = document.getElementById("errors") ?? this.getErrorsWrapper();

    template.innerHTML = null;

    errors.forEach((err) => {
      let el = document.createElement("div");
      el.textContent = err.message;
      template.append(el);
    });

    return template;
  }

  /**
   * Return a template representing a html button
   * @returns {HtmlElement} btnElement
   */

  buttonTemplate() {
    return `<button id="action-btn" type="button">Next step</button>`;
  }

  /**
   * Render options for html select type
   * @returns {string} options
   */
  renderSelectOptions() {
    let options = "";
    cities.forEach((city) => {
      options += `<option value="${city}">${city}</option>`;
    });
    return options;
  }

  /**
   * Returns template for first step
   * @returns {string} - template for first step
   */
  setTicketsNumberTemplate() {
    return `
       <form>
          <div>
             <label>How many tickets do you want to generate? (min 1 - max 5)&nbsp;</label>
             <input id="ticketsNumber" type="text">
          </div>
          <br>
          ${this.buttonTemplate()}
        </form>`;
  }

  /**
   * Returns template for second step
   * @param {number} numberOfBills
   * @returns {string} - template for second step
   */
  askBetTypeAndAmountTemplate(numberOfBills) {
    let template = "<form>";

    for (let i = 1; i <= numberOfBills; i++) {
      template += `
         <h2>Bill ${i}</h2>
           <div>
              <label>Type of bill (ambata - ambo - terno - quaterna - cinquina):</label>
              <input id="bill-${i}-type" class="bills-types" type="text">
           </div>
           <br>
           <div>
              <label>Amount of numbers: </label>
              <input id="bill-${i}-amount" class="bills-number-amounts" type="text">
           </div>
           <br>
           <div>
              <label>Select the wheel: </label>
              <select id="wheel-${i}">
                 ${this.renderSelectOptions()}
              </select>
           </div>
      `;
    }

    template += "<br>" + this.buttonTemplate();
    return template;
  }

  /**
   * Template for generation phase
   * @returns {string} - template for generation ticket
   */
  generatingTicketTemplate() {
    return "<div>Generating tickets....</div>";
  }

  /**
   * Returns the final tickets template
   * @param {any} data
   * @returns {string} - template for tickets
   */
  ticketsTemplate(data) {
    let template = '<div class="tickets-container" style="display: flex">';

    data.forEach((bill, index) => {
      let ticket =
        "<div class='header' style='padding-top: 10px;padding-bottom: 10px;border-bottom: 2px solid black; border-bottom-style: dashed'>";
      let number = index + 1;
      ticket += `${printSpaces(32)} Ticket-${number} ${printSpaces(32)}`;
      ticket += "</div>";
      ticket += "<div class='body' style='padding: 10px;'>";
      ticket += `&nbsp;<strong>Numbers:</strong> ${bill.numbers.join(" ")}`;
      ticket += "<br>";
      ticket += `&nbsp;<strong>Wheel:</strong> ${bill.wheel.city}`;
      ticket += "<br>";
      ticket += `&nbsp;<strong>Bet: </strong> ${bill.bet.type}`;
      ticket += "</div>";
      template +=
        "<div style='margin-right: 10px; border: 4px solid black; border-style: dashed'>" +
        ticket +
        "</div>";
    });

    template += "</div>";
    template += `<br>${this.buttonTemplate()}`;

    return template;
  }

  /**
   * Template for extraction phase
   * @returns {string} - template for lotto extraction phase
   */
  extractionInProgressTemplate() {
    return "<div>Processing lotto extraction....</div>";
  }

  extractionTemplate(tickets, extraction) {
    let extractionsHtml = "";
    let ticketsHtml = "";

    tickets.forEach((ticket, index) => {
      if (ticket.winnings.length > 0) {
        ticketsHtml += `
        <div style="margin-right: 10px; border: 4px solid black; border-style: dashed">
           <div class='header' style='padding-top: 10px;padding-bottom: 10px;border-bottom: 2px solid black; border-bottom-style: dashed'>
              ${printSpaces(32)} Ticket-${index + 1} ${printSpaces(32)}
           </div>
           <div class='body' style='padding: 10px;'>
              &nbsp;<strong>Numbers:</strong> ${ticket.numbers.join(" ")}
              <br>
              &nbsp;<strong>Wheel:</strong> ${ticket.wheel.city}
              <br>
              &nbsp;<strong>Bet: </strong> ${ticket.bet.type}
           </div>
      </div>`;
      }
    });

    extractionsHtml = this.extractionsOnWheelsTemplate(extraction);

    return `<div class="lotto-extraction-phase">
               <div class="extraction-date">
                  Estrazione del ${extraction.extractionDate}
               </div>
               <br>
               <div class="extractionsOnWheels">
                  ${extractionsHtml}
               </div>
            </div>
            <br>
            Ticket vincenti:
            <div class="winnerTickets" style="display: flex">
               ${ticketsHtml}
            </div>
          `;
  }

  extractionsOnWheelsTemplate(extraction) {
    let extractionsHtml = "";
    const extractionsOnWheels = extraction.extractionsOnWheels;
    extractionsOnWheels.forEach((extraction) => {
      let numbers = extraction.numbers.join(" ");
      extractionsHtml += `
         <div class="extraction">
             ${extraction.wheel.toUpperCase()}${printSpaces(10)}${numbers}
         </div>`;
    });

    return extractionsHtml;
  }
}
