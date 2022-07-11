import { Ticket } from "../app/model/ticket";

test("addNumber should add a number to numbers array", () => {
  const ticket = new Ticket(1, "ambo", "Tutte");
  ticket.addNumber(2);
  expect(ticket.numbers).toHaveLength(1);
  expect(ticket.numbers).toEqual([2]);
});

test("constructTicket should return a new Ticket instance if errors array is empty", () => {
  const ticket = Ticket.constructTicket(5, "terno", "Venezia", 4);
  expect(ticket).toBeTruthy();
  expect(ticket.amountOfNumbers).toBe(5);
  expect(ticket.bet.type).toBe("terno");
  expect(ticket.wheel.city).toBe("Venezia");
  expect(ticket.amountOfMoney).toBe(4);
});

test("constructTicket launch error and return undefined, if there is at least one error", () => {
  expect(() => {
    Ticket.constructTicket(11, "terno", "Venezia", null);
  }).toThrow(
    "Errors in ticket creation phase: Amount must be in the range 1 to 10"
  );
});

test("validate should return empty errors array if amount is valid", () => {
  const errors = Ticket.validate("10");
  expect(errors).toHaveLength(0);
});

test("validate should return errors array with error 'Amount is not an integer number' if is not a number", () => {
  const errors = Ticket.validate("ten");
  expect(errors).toHaveLength(1);
  expect(errors[0]).toBe("Amount is not an integer number");
});

test("validate should return errors array with error 'Amount is not an integer number' if is not an integer", () => {
  const errors = Ticket.validate("0.5");
  expect(errors).toHaveLength(2);
  expect(errors[0]).toBe("Amount is not an integer number");
});

test("validate should return errors array with error 'Amount must be in the range 1 to 10' if is not in the range", () => {
  const errors = Ticket.validate("11");
  expect(errors).toHaveLength(1);
  expect(errors[0]).toBe("Amount must be in the range 1 to 10");
});

test("validateAmountOfMoney should return errors array with error 'Amount of money needs to be a number greater than 0' if string conversion gets NaN value", () => {
  const errors = Ticket.validateAmountOfMoney("some value");
  expect(errors).toEqual([
    "Amount of money needs to be a number greater than 0",
  ]);
});

test("validateAmountOfMoney should return empty errors array, if amount is valid", () => {
  const errors = Ticket.validateAmountOfMoney(1.25);
  expect(errors).toEqual([]);
});
