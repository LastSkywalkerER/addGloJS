'use strict';

function getRandomInt(max) {
  return Math.round(Math.random() * max);
}

function generateOddNumber(fromNumber, toNumber) {
  if (fromNumber > toNumber) {
    fromNumber += toNumber;
    toNumber = fromNumber - toNumber;
    fromNumber -= toNumber;
  }

  if (Math.abs(fromNumber % 2) === 0) {
    fromNumber++;
  }

  if (Math.abs(toNumber % 2) === 0) {
    toNumber--;
  }

  return getRandomInt((toNumber - fromNumber) / 2) * 2 + fromNumber;

}

console.log(generateOddNumber(1, 100));
console.log(generateOddNumber(0, -10));
console.log(generateOddNumber(-7, -3));
console.log(generateOddNumber(-100, 100));
console.log(generateOddNumber(1, -1));