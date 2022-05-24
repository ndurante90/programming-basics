import { WheelExtraction, Extraction } from "../app/model/extraction.js";

import { cities } from "../app/model/wheel.js";

describe("WheelExtraction", () => {
  test("should instantiate a new WheelExtraction object with wheel equals to empty string and numbers to empty array", () => {
    let extraction = new WheelExtraction();
    expect(extraction.wheel).toBe("");
    expect(extraction.numbers).toHaveLength(0);
  });
});

describe("Extraction", () => {
  test("should instantiate a new Extraction object with extractionDate equals to the current date and extractionsOnWheels equals to empty array", () => {
    let currentDate = new Date();
    let extraction = new Extraction();
    expect(extraction.extractionDate).toEqual(
      currentDate.getDate() +
        "/" +
        (currentDate.getMonth() + 1) +
        "/" +
        currentDate.getFullYear()
    );

    expect(extraction.extractionsOnWheels).toHaveLength(0);
  });

  test("for each city of cities array, generateExtractionsOnWheels should generate a WheelExtraction object with wheel param and an array of 5 numbers. Each number occurs only one times", () => {
    let extraction = new Extraction();
    extraction.generateExtractionsOnWheels();

    expect(extraction.extractionsOnWheels).toHaveLength(cities.length);

    extraction.extractionsOnWheels.forEach((wheelExtraction) => {
      //check that is a valid city value
      expect(cities).toContain(wheelExtraction.wheel);
      //check if the generated numbers array has length 5
      expect(wheelExtraction.numbers).toHaveLength(5);

      let baseIndex = 0;

      wheelExtraction.numbers.forEach((num, index) => {
        //check if each number is in the range 1 - 90
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(90);

        //check that each number occurs exactly one time
        if (index === baseIndex) {
          expect(num).toBe(wheelExtraction.numbers[baseIndex]);
        }

        if (index > baseIndex) {
          for (let i = index - 1; i >= baseIndex; i--) {
            expect(num).not.toBe(wheelExtraction.numbers[i]);
          }
        }
      });
    });
  });
});
