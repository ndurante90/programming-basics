import { cities } from "./model/wheel.js";
import { Winning } from "./model/winnings.js";
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
   * @param {number} numberOfTickets
   * @returns {string} - template for second step
   */
  askBetTypeAndAmountTemplate(numberOfTickets) {
    let template = "";

    for (let i = 1; i <= numberOfTickets; i++) {
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
           <br>
           <div>
              <label>Amount of money: </label>
              <input id="bill-${i}-moneyAmt" class="bills-money-amount" type="text">
              &euro;
           </div>
      `;
    }

    template += "<br>" + this.buttonTemplate();
    return template;
  }

  /**
   * Returns template for generation phase
   * @returns {string} - template for tickets generation phase
   */
  generatingTicketTemplate() {
    return "<div>Generating tickets....</div>";
  }

  /**
   * Returns the template for the generated tickets phase
   * @param {Array<Ticket>} tickets
   * @returns {string} - generatedTicketsTemplate
   */

  generatedTicketsTemplate(tickets) {
    let template = "";
    template += this.ticketsTemplate(tickets);
    template += `<br>${this.buttonTemplate()}`;
    return template;
  }

  /**
   * Returns template for extraction in progress phase
   * @returns {string} - template for extraction in progress phase
   */
  extractionInProgressTemplate() {
    return "<div>Processing lotto extraction....</div>";
  }

  /**
   *
   * @param {Array<Ticket>} tickets
   * @param {Extraction} extraction
   * @returns {string} - template for extraction phase
   */

  extractionTemplate(tickets, extraction) {
    let extractionsHtml = "";
    extractionsHtml = this.extractionsOnWheelsTemplate(extraction);
    const ticketsHtml = this.ticketsTemplate(tickets);

    return `
       <div class="lotto-extraction-phase">
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
           ${ticketsHtml}
    `;
  }

  /**
   * Returns tickets templates
   * @param {Array<Ticket>} tickets
   * @returns {string} - template for tickets
   */
  ticketsTemplate(tickets) {
    let template = "";
    let ticketsHtml = "";

    tickets.forEach((ticket, index) => {
      const winningsHtml = this.winningsTemplate(ticket.winnings);
      ticketsHtml += `
        <div class="ticket">
           <div class="main-content">
              <div class="header">
                 ${printSpaces(32)} Ticket-${index + 1} ${printSpaces(32)}
              </div>
              <div class="body">
                 &nbsp;<strong>Numbers:</strong> ${ticket.numbers.join(" ")}
                 <br>
                 &nbsp;<strong>Wheel:</strong> ${ticket.wheel.city}
                 <br>
                 &nbsp;<strong>Bet: </strong> ${ticket.bet.type}
              </div>
           </div>
           
           ${winningsHtml}
      </div>
      
      
      `;
    });

    template += `
       <div class="tickets-container">
          ${ticketsHtml}
       </div>
    `;

    return template;
  }

  /**
   * Returns template for WheelExtraction object list
   * @param {Extraction} extraction
   * @returns {string} - template that represent list of WheelExtraction objects
   */
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

  winningsTemplate(winnings) {
    let winningsHtml = "";

    winnings.forEach((winning) => {
      winningsHtml += `<div class="winning">
       Wheel: ${winning.wheel}
       <br>
       GrossPrize: ${winning.grossPrize}
       <br>
       NetPrize: ${winning.netPrize}
      
      </div>`;
    });

    return `
    <div class="winnings-container">
       ${winningsHtml}
       ${this.totalWinningsTemplate(winnings)}
    </div>`;
  }

  totalWinningsTemplate(winnings) {
    if (winnings.length == 0) return "";
    let totalWinning = winnings.reduce((total, current) => {
      total.wheel.push(current.wheel);
      total.grossPrize += current.grossPrize;
      total.netPrize += current.netPrize;
      return total;
    }, new Winning([], 0));

    totalWinning.grossPrize = parseFloat(totalWinning.grossPrize.toFixed(2));
    totalWinning.netPrize = parseFloat(totalWinning.netPrize.toFixed(2));

    return `
    <div class="total-winnings">
       <strong>Total Winnings: </strong>
       <br>
       GrossPrize: ${totalWinning.grossPrize}
       <br>
       NetPrize: ${totalWinning.netPrize}
    </div>`;
  }

  /**
   * Return a template representing a html button
   * @returns {string} button template
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
}
