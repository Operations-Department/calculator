//undeclared variables to use later in calculation function
let firstNumber;
let operator;
let secondNumber;
//flag to track if a decimal has been used in the current operand - to avoid unlimited decimals
let decimalUsed = false;
//flag to track if an equation has an operator in it, so the calculator will not evaluate more than a pair of numbers at a time, for example 9+9+.. becomes 18+.. in the display to avoid long and complicated equations
let shouldCalculate = false;

//const MAX_DISPLAY_TOP_LENGTH = 15;
//const MAX_DISPLAY_BOTTOM_LENGTH = 11; //display character limit

function truncateToMaxLength(str) { //corresponding helper function with character limit variable
  return str.length > MAX_DISPLAY_BOTTOM_LENGTH ? str.slice(0, MAX_DISPLAY_BOTTOM_LENGTH) : str;
}

//operation function - to be called through calculation function and perform outputs
const operate = (firstNumber, operator, secondNumber) => {
  if (operator === '+') return firstNumber + secondNumber;
  if (operator === '-') return firstNumber - secondNumber;
  if (operator === '*') return firstNumber * secondNumber;
  if (operator === '/') {
    if (secondNumber === 0) return "Error";
    return firstNumber / secondNumber;
  }
  if (operator === '%') return (firstNumber / 100) * secondNumber;
  return null;
};

//connects js to html elements
const allButtons = document.querySelectorAll('button');
const clearButtons = document.querySelectorAll('.clear');
const operatorButtons = document.querySelectorAll('.operator');
const numberButtons = document.querySelectorAll('.number');
const decimalButton = document.getElementById('decimal');
const equalButton = document.getElementById('equal');
const displayTop = document.getElementById('display-top');
const displayBottom = document.getElementById('display-bottom');

//mouseover/click/mouseout styles
allButtons.forEach(button => {
  button.addEventListener('mouseover', () => {
    button.classList.add('mouseover-blue');
  });
  button.addEventListener('mouseout', () => {
    button.classList.remove('mouseover-blue');
  });
});
clearButtons.forEach(button => {
  button.addEventListener('mouseover', () => {
    button.classList.add('mouseover-red');
  });
  button.addEventListener('mouseout', () => {
    button.classList.remove('mouseover-red');
  });
  });
operatorButtons.forEach(button => {
  button.addEventListener('mouseover', () => {
    button.classList.add('mouseover-operator');
  });
  button.addEventListener('mouseout', () => {
    button.classList.remove('mouseover-operator');
  });
});  
equalButton.addEventListener('mouseover', () => {
  equalButton.classList.add('mouseover-equal');
});
equalButton.addEventListener('mouseout', () => {
  equalButton.classList.remove('mouseover-equal');
});
allButtons.forEach(button => {
  button.addEventListener('click', () => {
    button.classList.add('click');
    setTimeout(() => {
      button.classList.remove('click')
    }, 70);
  });
});

//clears display
clearButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.id === "ac") { 
      displayTop.textContent = ""; // clears display 
      displayBottom.textContent = "";  
      decimalUsed = false; // resets decimal and calculate flags
      shouldCalculate = false;
    } else {  
      displayBottom.textContent = "";
      displayTop.textContent = displayTop.textContent.slice(0, -1); //deletes one character at a time
      decimalUsed = false; // resets decimal and calculate flags 
      shouldCalculate = false;
    }
    if (displayTop.textContent.includes('+') || 
        displayTop.textContent.includes("-") ||  
        displayTop.textContent.includes("*") || 
        displayTop.textContent.includes("/") ||
        displayTop.textContent.includes("%")) {
        shouldCalculate = true;
        } 
  });
});

//add number to display when clicked
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    const text = button.textContent;
    if (displayBottom.textContent.length > 0) { //resets display for a new equation
      displayBottom.textContent = "";
      displayTop.textContent = "";
      displayTop.textContent += text;
    } else {
      displayTop.textContent += text;
    }
  });
});

//limits numbers to only one decimal each
decimalButton.addEventListener('click', () => {
  if (!decimalUsed) {
    displayTop.textContent += '.';
    decimalUsed = true;
  }
}); 

//adds operator to display
operatorButtons.forEach(button => {
  button.addEventListener('click', () => {
    const text = button.textContent;
    const lastChar = displayTop.textContent.slice(-1);

    //to stop stacking operators
    if (lastChar === "+" || lastChar === "-" || lastChar === "*" || lastChar === "/" || lastChar === "%") {
      shouldCalculate = false; // prevent premature calculation
      displayTop.textContent = displayTop.textContent.slice(0, -1) + text; //replaces old operator with new one
      shouldCalculate = true; //reset flag
      return; // prevents other code within the event listener from executing, causing an error  
    }

    // calculates the equation if there is one operator and two operands
    if (shouldCalculate && displayBottom.textContent !== "Error") {
      const result = calculateResult();
      displayTop.textContent = result;
      displayBottom.textContent = "";
      shouldCalculate = false;
    }
    
    if (!shouldCalculate) {
      shouldCalculate = true; // to allow an operator between two numbers and execute the equation when the second operator button is pressed 
    } 

    // puts solution as a number of a new equation and avoids including 'Error' in the equation
    if (displayBottom.textContent.length > 0 && displayBottom.textContent !== "Error") {
      displayTop.textContent = displayBottom.textContent;
      displayBottom.textContent = "";
      // displayTop.textContent += text; 
    }

    //can't put an operator in the display first
    if (displayTop.textContent === "" && displayBottom.textContent === "" || displayBottom.textContent === "Error") {
      displayTop.textContent = "";
      displayBottom.textContent = "";
      shouldCalculate = false;
    }

    else {
      displayTop.textContent += text; //adds the new operator to the display
    }

    decimalUsed = false; //reset decimal status flag, allow the second number in equation to have a decimal
  });
});

//calculates the equation - click 'equals'
equalButton.addEventListener('click', () => {
  calculateResult();
  decimalUsed = false; // resets flags for next equation
  shouldCalculate = false; 
});

// this is our big boy - calculates total
function calculateResult() {
  let equation = displayTop.textContent; //sets the display in equation var
  let symbol = /[+\-*/%]/g; // set operators under symbol variable
  let operator = equation.match(symbol); // matches the symbol and stores as operator
  let numbers = equation.split(symbol);
  
  let firstNumber = parseFloat(numbers[0]); 
  let secondNumber = parseFloat(numbers[1]);
  
  // Handle negative numbers for the first number
  if (equation.startsWith('-') && numbers.length > 2) { //*****************bug is here somewhere
    firstNumber = -firstNumber;
  }

  // Handle negative numbers for the second number
  if (numbers.length > 2 && numbers[1].startsWith('-')) {
    secondNumber = -secondNumber;
  }
  
  let result = operate(firstNumber, operator[0], secondNumber); //triggers the equation and stores the result
  
  // handle division by zero and other invalid operations
  if (isNaN(result) || !isFinite(result) || result === null) {
    displayTop.textContent = "";
    displayBottom.textContent = "Error";
    firstNumber = null;
    operator = null;
    secondNumber = null;    
    return "Error";
  } else {
    //eliminates unnecessary zeros after the decimal - max 3 decimal places
    result = result.toFixed(3).replace(/\.?0+$/, ''); 
    //result = truncateToMaxLength(result, MAX_DISPLAY_BOTTOM_LENGTH); //cuts off at 11 character limit
  }
  if (displayBottom.textContent > 0) {
    displayBottom.textContent = ""; 
  }
  displayBottom.textContent += result; // puts answer in display
  return result; // returns answer to be called in other functions
}

//KEYBOARD SUPPORT for same operations as above
document.addEventListener('keydown', (e) => {
  const key = e.key;
  const lastChar = displayTop.textContent.slice(-1);

  //type number keys into calc
  if (/^\d$/.test(key)) {
    if(displayBottom.textContent.length > 0) {
      displayBottom.textContent = "";
      displayTop.textContent = "";
    }
    displayTop.textContent += key;
  }

  //type operators into calc
  if (/^[+\-*/%]$/.test(key)) {
    if (lastChar === "+" || lastChar === "-" || lastChar === "*" || lastChar === "/" || lastChar === "%") {
      shouldCalculate = false;
      displayTop.textContent = displayTop.textContent.slice(0, -1) + key;
      shouldCalculate = true;
      return;
    }
    
    if (shouldCalculate) {
      const result = calculateResult();
      displayTop.textContent = result;
      displayBottom.textContent = "";
      shouldCalculate = false;
    } 
    
    if (!shouldCalculate) { 
      shouldCalculate = true;
    }
    
    if (displayBottom.textContent.length > 0 && displayBottom.textContent !== "Error") { 
      displayTop.textContent = displayBottom.textContent;
      displayBottom.textContent = "";
    } 

    if (displayTop.textContent === "" && displayBottom.textContent === "") {
      displayTop.textContent = ""; //to stop putting an operator before a number
    } 
    
    else {
      displayTop.textContent += key;
    }
    decimalUsed = false;
  }

  if (key === '.') {
    if (!decimalUsed) {
      displayTop.textContent += key;
      decimalUsed = true;
    }
  }
  
  //calculate total with enter key
  if (key === 'Enter') {
    calculateResult();
    decimalUsed = false;
    shouldCalculate = false;
  } 
  
  //backspace
  if (key === 'Backspace') {  
      displayBottom.textContent = "";
      displayTop.textContent = displayTop.textContent.slice(0, -1); //deletes one character at a time
      decimalUsed = false; // resets decimal and calculate flags 
      shouldCalculate = false;
    }

    if (displayTop.textContent.includes('+') || 
        displayTop.textContent.includes("-") ||  
        displayTop.textContent.includes("*") || 
        displayTop.textContent.includes("/") ||
        displayTop.textContent.includes("%")) {
        shouldCalculate = true;
        } 
  //clear all with delete key
  if (key === 'Delete') {
    displayTop.textContent = ""; 
    displayBottom.textContent = "";
    shouldCalculate = false;
    decimalUsed = false;
  } 
});