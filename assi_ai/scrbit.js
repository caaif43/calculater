
const currentDisplay = document.getElementById("current");
const previousDisplay = document.getElementById("previous");

let currentNumber = "0";
let previousNumber = "";
let operation = null;
let resetScreen = false;

function updateDisplay() {
  currentDisplay.innerText = currentNumber;

  previousDisplay.innerText = previousNumber
    ? previousNumber + " " + operationSymbol(operation)
    : "";
}

function appendNumber(number) {
  if (currentNumber === "Error" ||
      currentNumber === "Cannot divide by zero") {
    currentNumber = "0";
    resetScreen = false;
  }

  if (number === "." && currentNumber.includes(".")) return;

  if (resetScreen) {
    currentNumber = number === "." ? "0." : number;
    resetScreen = false;
  } else {
    currentNumber =
      currentNumber === "0" && number !== "."
        ? number
        : currentNumber + number;
  }

  updateDisplay();
}

function operationSymbol(op) {
  const symbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷"
  };

  return symbols[op] || "";
}

function chooseOperation(op) {
  if (currentNumber === "Error" ||
      currentNumber === "Cannot divide by zero") return;

  if (operation !== null && !resetScreen) {
    calculate();
  }

  previousNumber = currentNumber;
  operation = op;
  resetScreen = true;

  updateDisplay();
}

function calculate() {
  if (operation === null || resetScreen) return;

  const prev = parseFloat(previousNumber);
  const current = parseFloat(currentNumber);

  let result;

  switch (operation) {
    case "+":
      result = prev + current;
      break;

    case "-":
      result = prev - current;
      break;

    case "*":
      result = prev * current;
      break;

    case "/":
      if (current === 0) {
        currentNumber = "Cannot divide by zero";
        previousNumber = "";
        operation = null;
        resetScreen = true;
        updateDisplay();
        return;
      }

      result = prev / current;
      break;
  }

  if (!Number.isFinite(result)) {
    currentNumber = "Error";
  } else {
    currentNumber = String(
      Number(result.toPrecision(10))
    );
  }

  previousDisplay.innerText =
    `${previousNumber} ${operationSymbol(operation)} ${current}`;

  previousNumber = "";
  operation = null;
  resetScreen = true;

  updateDisplay();
}

function clearDisplay() {
  currentNumber = "0";
  previousNumber = "";
  operation = null;
  resetScreen = false;

  updateDisplay();
}

function deleteNumber() {
  if (resetScreen ||
      currentNumber === "Error" ||
      currentNumber === "Cannot divide by zero") {
    currentNumber = "0";
    resetScreen = false;
  } else {
    currentNumber = currentNumber.slice(0, -1) || "0";
  }

  updateDisplay();
}

// Keyboard support
document.addEventListener("keydown", (event) => {
  if (/^[0-9.]$/.test(event.key)) {
    appendNumber(event.key);
  }

  if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperation(event.key);
  }

  if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  }

  if (event.key === "Backspace") {
    deleteNumber();
  }

  if (event.key === "Escape") {
    clearDisplay();
  }
});

updateDisplay();
