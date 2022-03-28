const coinValues = [25, 10, 5, 1];

function combineWithRepetitions(comboOptions, comboLength) {
  // If the length of the combination is 1 then each element of the original array
  // is a combination itself.
  if (comboLength === 1) {
    return comboOptions.map((comboOption) => [comboOption]);
  } else if (comboLength === 0) {
    return [];
  }

  // Init combinations array.
  const combos = [];

  // Remember characters one by one and concatenate them to combinations of smaller lengths.
  // We don't extract elements here because the repetitions are allowed.
  comboOptions.forEach((currentOption, optionIndex) => {
    // Generate combinations of smaller size.
    const smallerCombos = combineWithRepetitions(
      comboOptions.slice(optionIndex),
      comboLength - 1
    );

    // Concatenate currentOption with all combinations of smaller size.
    smallerCombos.forEach((smallerCombo) => {
      combos.push([currentOption].concat(smallerCombo));
    });
  });

  return combos;
}

// Function to get the sum of all numbers contained in an array
// Set initial value equal to zero to handle empty arrays
function possibleAmount(arr) {
  return arr.reduce((total, num) => {
    return total + num;
  }, 0);
} // end function

function possibleChange(amount, coins, combos) {
  // Base Case
  if (possibleAmount(combos) === 0) {
    return false;
    // Recursive Case
  } else {
    if (possibleAmount(combos[0]) === amount) {
      return true;
    } else {
      return possibleChange(amount, coins, combos.splice(1));
    }
  }
} // end function

function main() {
  let amount = prompt("Insert an amount($): ");
  let numberOfCoins = prompt("Insert a number of coins: ");

  const combos = combineWithRepetitions(coinValues, parseInt(numberOfCoins));
  let change = possibleChange(amount * 100, parseInt(numberOfCoins), combos);
  let message = change
    ? `The $${amount} amount can be formed using ${numberOfCoins} coins.`
    : `Sorry. The $${amount} amount cannot be formed using ${numberOfCoins} coins.`;
  alert(message);
}

main();
