const MissionUtils = require("@woowacourse/mission-utils");
const {
  NOTTHING,
  STRIKE,
  BALL,
  GAME_END,
  REQUIRE_NUMBER,
  RETRY_OR_END,
  RETRY_VALUE,
  END_VALUE,
  START_NUMBER,
  END_NUMBER,
} = require("./Constants.js");
const { NUMBER_ONE_TO_NINE } = require("./RegExpress.js");

const createComputerNumber = (start, end) => {
  const computer = [];
  while (computer.length < 3) {
    const number = pickNumberBetweenRange(start, end);
    const isSelected = isSelectedNumber(number, computer);
  }
  return computer;
};

const pickNumberBetweenRange = (start, end) => {
  const number = MissionUtils.Random.pickNumberInRange(start, end);
  return number;
};

const isSelectedNumber = (number, computer) => {
  if (!computer.includes(number)) {
    computer.push(number);
  }
};

const getUserNumber = (computer, question) => {
  MissionUtils.Console.readLine(question, (userInput) => {
    validateUserNumber(userInput);
    gamePlay(computer, userInput);
  });
};

const validateUserNumber = (userInput) => {
  const isBetweenOneToNine = validateOneToNine(userInput);
  const isCorrectLength = validateLength(userInput, 3);
  const isNotOverlapped = validateOverlapped(userInput);

  if (isBetweenOneToNine && isCorrectLength && isNotOverlapped) {
    return true;
  } else {
    throw new Error("에러 발생 후 종료");
  }
};

const validateLength = (target, setLength) => {
  let validLength = target.length === setLength;
  return validLength;
};

const validateOverlapped = (target) => {
  const setTarget = new Set(target);
  let validOverlapped = target.length === setTarget.size;
  return validOverlapped;
};

const validateOneToNine = (target) => {
  return NUMBER_ONE_TO_NINE.test(target);
};

const makeNumberToArray = (target) => {
  const arrayTarget = target.split("").map((item) => Number(item));
  return arrayTarget;
};

const gamePlay = (computers, user) => {
  const users = makeNumberToArray(user);

  let countStrike = 0;
  let countBall = 0;

  users.forEach((number, index) => {
    countStrike = isStrike(number, index, computers, countStrike);
    countBall = isBall(number, index, computers, countBall);
  });
  printGameResult(countStrike, countBall, computers);
};

const isStrike = (number, index, computers, countStrike) => {
  if (number === computers[index]) {
    countStrike += 1;
  }
  return countStrike;
};
const isBall = (number, index, computers, countBall) => {
  if (number !== computers[index] && computers.includes(number)) {
    countBall += 1;
  }
  return countBall;
};

const printMessage = (message) => {
  MissionUtils.Console.print(message);
};

const printGameResult = (countStrike, countBall, computers) => {
  if (countStrike === 0 && countBall === 0) {
    printMessage(NOTTHING);
    getUserNumber(computers, REQUIRE_NUMBER);
  } else if (3 > countStrike > 0 && countBall === 0) {
    printMessage(countStrike + STRIKE);
    getUserNumber(computers, REQUIRE_NUMBER);
  } else if (countStrike === 0 && countBall > 0) {
    printMessage(countBall + BALL);
    getUserNumber(computers, REQUIRE_NUMBER);
  } else if (3 > countStrike > 0 && countBall > 0) {
    printMessage(`${countBall + BALL} ${countStrike + STRIKE}`);
    getUserNumber(computers, REQUIRE_NUMBER);
  } else if (countStrike === 3) {
    printMessage(countStrike + STRIKE);
    printMessage(GAME_END);
    printMessage(RETRY_OR_END);
    retryOrEnd();
  }
};

const playAgain = () => {
  const computerNumbers = createComputerNumber(START_NUMBER, END_NUMBER);
  getUserNumber(computerNumbers, REQUIRE_NUMBER);
};

const retryOrEnd = () => {
  MissionUtils.Console.readLine("", (userInput) => {
    if (userInput === RETRY_VALUE) {
      playAgain();
    } else if (userInput === END_VALUE) {
      MissionUtils.Console.close();
    } else {
      throw new Error("게임 종료");
    }
  });
};

module.exports = { createComputerNumber, getUserNumber };
