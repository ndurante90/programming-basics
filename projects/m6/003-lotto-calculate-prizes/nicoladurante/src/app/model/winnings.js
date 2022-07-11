//withHoldingTax percentage for calculating netPrize
const withHoldingTax = 8;

export class Winning {
  wheel;
  grossPrize;
  netPrize;

  constructor(wheel, grossPrize) {
    this.wheel = wheel;
    this.grossPrize = grossPrize;
    if (grossPrize <= 0) {
      this.grossPrize = 0;
      this.netPrize = 0;
    } else {
      let grossPrizeMinusPerc = (grossPrize / 100) * withHoldingTax;
      this.netPrize = parseFloat((grossPrize - grossPrizeMinusPerc).toFixed(2));
    }
  }
}
