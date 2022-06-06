import { Lotto } from "../app/lotto";
import { View } from "../app/view";
import { Ticket } from "../app/model/ticket";
import { Bet } from "../app/model/bet";
import { Wheel } from "../app/model/wheel";
import { Extraction } from "../app/model/extraction";
import Utils from "adm-zip/util/utils";

let lotto, view;
let updateUI, renderViewSpy, renderErrorsSpy, assignActionToButton;

describe("lotto tests", () => {
  beforeAll(() => {
    lotto = new Lotto();

    //init spies
    renderViewSpy = jest
      .spyOn(View.prototype, "renderView")
      .mockImplementation(() => {});

    renderErrorsSpy = jest
      .spyOn(View.prototype, "renderErrors")
      .mockImplementation(() => {});

    assignActionToButton = jest
      .spyOn(View.prototype, "assignActionToButton")
      .mockImplementation(() => {});

    updateUI = jest.spyOn(lotto, "updateUI");
  });

  afterEach(jest.clearAllMocks);

  test("constructor should istantiate variables", () => {
    expect(lotto.ticketsNumber).toBe(0);
    expect(lotto.currentStep).toBe(1);
    expect(lotto.tickets).toBeInstanceOf(Array);
    expect(lotto.tickets).toHaveLength(0);

    expect(lotto.errors).toBe(null);
    expect(lotto.extraction).toBe(null);
    expect(lotto.view).toBeDefined();
  });

  test("loadGame should call updateUI method passing setTicketsNumber function", () => {
    const setTicketsSpy = jest.spyOn(lotto, "setTicketsNumber");

    lotto.loadGame();

    expect(updateUI).toHaveBeenCalledWith(setTicketsSpy);
  });

  describe("UpdateUI", () => {
    test("should call renderView with currentStep and data parameters and, if execAction is true and action is a valid function , executes the action", () => {
      const mockFunction = jest.fn(() => {
        console.log("Action has been executed!");
      });

      const data = "custom data";
      lotto.updateUI(mockFunction, true, data);

      expect(renderViewSpy).toHaveBeenCalledWith(lotto.currentStep, [data]);
      expect(mockFunction).toHaveBeenCalled();
    });

    test("should call renderView with currentStep and data parameters and, if execAction is false , call assignActionToButton", () => {
      const mockFunction = jest.fn(() => {
        console.log("Action assigned to a button!");
      });

      const data = "custom data";

      lotto.updateUI(mockFunction, false, data);

      expect(renderViewSpy).toHaveBeenCalledWith(lotto.currentStep, [data]);

      expect(assignActionToButton).toHaveBeenCalledWith(
        "action-btn",
        mockFunction
      );
    });

    test("should call renderErrors with lotto.errors parameter, if lotto.errors is not undefined", () => {
      const mockFunction = jest.fn(() => {
        console.log("Action has been executed!");
      });

      const data = "custom data";

      lotto.errors = [];

      lotto.errors.push(new Error("Error!"));

      lotto.updateUI(mockFunction, false, data);

      expect(renderErrorsSpy).toHaveBeenCalledWith(lotto.errors);
      expect(renderViewSpy).not.toHaveBeenCalled();
      expect(assignActionToButton).not.toHaveBeenCalled();
    });
  });

  describe("The setTicketsNumber method", () => {
    describe("After a click on 'Next Step' button", () => {
      let askBetTypeAndAmountSpy;
      beforeEach(() => {
        askBetTypeAndAmountSpy = jest.spyOn(lotto, "askBetTypeAndAmount");

        lotto.currentStep = 1;

        lotto.ticketsNumber = 0;

        document.body.innerHTML = `<form>
        <label>How many tickets do you want to generate? (min 1 - max 5)</label>
        <input id="ticketsNumber" type="text"><button type="button">OK</button>
        <button type="button">OK</button>
     </form>`;
      });

      test("If the input value is between 1 and 5, should set the ticketsNumber variable, increment the currentStep and call updateUI method passing askBetTypeAndAmount, false and ticketsNumber", () => {
        //ARRANGE
        document.getElementById("ticketsNumber").value = 3;

        //ACT
        lotto.setTicketsNumber();

        //ASSERT
        expect(lotto.ticketsNumber).toBe(3);
        expect(lotto.currentStep).toBe(2);
        expect(updateUI).toHaveBeenCalledWith(
          askBetTypeAndAmountSpy,
          false,
          lotto.ticketsNumber
        );
      });

      test("If input value is not a number should assign to lotto.errors an error with message 'The value must be an integer number' and call updateUI method passing askBetTypeAndAmount, false and ticketsNumber'", () => {
        document.getElementById("ticketsNumber").value = "not-a-number";

        lotto.setTicketsNumber();

        expect(lotto.ticketsNumber).toBe(0);
        expect(lotto.currentStep).toBe(1);
        expect(lotto.errors).toEqual([
          new Error("The value must be an integer number"),
        ]);
        expect(updateUI).toHaveBeenCalledWith(
          askBetTypeAndAmountSpy,
          false,
          lotto.ticketsNumber
        );
      });

      test("If input value is a not integer number should assign to lotto.errors an error with message 'The value must be an integer number' and call updateUI method passing askBetTypeAndAmount, false and ticketsNumber", () => {
        document.getElementById("ticketsNumber").value = 2.56;

        lotto.setTicketsNumber();

        expect(lotto.ticketsNumber).toBe(0);
        expect(lotto.currentStep).toBe(1);
        expect(lotto.errors).toEqual([
          new Error("The value must be an integer number"),
        ]);
        expect(updateUI).toHaveBeenCalledWith(
          askBetTypeAndAmountSpy,
          false,
          lotto.ticketsNumber
        );
      });

      test("If input value is of integer type and it is not between 1 to 5, should assign to lotto.errors an error with message 'Number must be in the range 1 - 5' and call updateUI method passing askBetTypeAndAmount, false and ticketsNumber", () => {
        document.getElementById("ticketsNumber").value = 6;

        lotto.setTicketsNumber();

        expect(lotto.ticketsNumber).toBe(0);
        expect(lotto.currentStep).toBe(1);
        expect(lotto.errors).toEqual([
          new Error("Number must be in the range 1 - 5"),
        ]);
        expect(updateUI).toHaveBeenCalledWith(
          askBetTypeAndAmountSpy,
          false,
          lotto.ticketsNumber
        );
      });
    });
  });

  describe("askBetTypeAndAmount", () => {
    let getTicketsSpy, generateTicketsNumbersSpy;

    beforeEach(function () {
      getTicketsSpy = jest.spyOn(lotto, "getTickets");

      generateTicketsNumbersSpy = jest.spyOn(lotto, "generateTicketsNumbers");

      lotto.currentStep = 2;

      lotto.errors = null;
    });

    test("should call getTickets for a number of times equals to lotto.ticketsNumber, increment currentStep and call updateUI", () => {
      lotto.ticketsNumber = 5;

      lotto.askBetTypeAndAmount();

      expect(getTicketsSpy).toHaveBeenCalledTimes(lotto.ticketsNumber);
      expect(updateUI).toHaveBeenCalledWith(
        generateTicketsNumbersSpy,
        true,
        null
      );
    });

    test("should call getTickets for a number of times equals to lotto.ticketsNumber and get empty tickets array, if there are one or more validation errors", () => {
      lotto.ticketsNumber = 5;
      lotto.errors = [new Error("Error!")];

      lotto.askBetTypeAndAmount();

      expect(getTicketsSpy).toHaveBeenCalledTimes(lotto.ticketsNumber);
      expect(lotto.tickets).toEqual([]);
      expect(updateUI).toHaveBeenCalledWith(
        generateTicketsNumbersSpy,
        true,
        null
      );
    });
  });

  test("generateTicketsNumbers should call generateNumbers for a number of times equals to tickets array length, increment step and call updateUI", () => {
    jest.useFakeTimers();
    const createFakeExtractionSpy = jest.spyOn(lotto, "createFakeExtraction");
    lotto.tickets.push(
      new Ticket(2, "ambo", "tutte"),
      new Ticket(3, "terno", "venezia")
    );

    lotto.currentStep = 3;

    lotto.generateTicketsNumbers();

    jest.runAllTimers();

    expect(lotto.currentStep).toBe(4);
    expect(updateUI).toHaveBeenCalledWith(
      createFakeExtractionSpy,
      false,
      lotto.tickets
    );
  });

  test("createFakeExtraction should istantiate a new Extraction object, increment step and call updateUI. After 3 seconds should call printWinnerTickets", () => {
    jest.useFakeTimers();

    const printWinnerTicketsSpy = jest
      .spyOn(lotto, "printWinnerTickets")
      .mockImplementation(() => {});
    lotto.currentStep = 4;
    lotto.createFakeExtraction();
    jest.runAllTimers();
    expect(lotto.extraction).toBeDefined();
    expect(lotto.currentStep).toBe(5);
    expect(printWinnerTicketsSpy).toHaveBeenCalled();
  });
});
