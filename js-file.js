//our operations
const add = (x, y) => x + y;
const subtract = (x, y) => x - y;
const multiply = (x, y) => x * y;
const divide = (x, y) => x / y;

//undeclared variables to use later in calculation function
let firstNumber;
let operator;
let secondNumber;
//flag to track if a decimal has been used in the current operand - to avoid unlimited decimals
let decimalUsed = false;
//flag to track if an equation has an operator in it, so the calculator will not evaluate more than a pair of numbers at a time, 
//for example 9+9+.. becomes 18+.. in the display to avoid long and complicated equations
let shouldCalculate = false;

//operation function - to be called through calculation function and perform outputs
const operate = (firstNumber, operator, secondNumber) => {
  if(operator === '+') {return add(firstNumber, secondNumber);}
  if(operator === '-') {return subtract(firstNumber, secondNumber);}
  if(operator === '*') {return multiply(firstNumber, secondNumber);}
  if(operator === '/' && secondNumber === 0) {return "error";}
  if(operator === '/') {return divide(firstNumber, secondNumber);}
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
    // does not reset decimal and calculate flag if display already has a decimal or operator present
    if (displayTop.textContent.includes('.')) { // 
      decimalUsed = true;
    } 
    if (displayTop.textContent.includes('+') || 
        displayTop.textContent.includes("-") ||  
        displayTop.textContent.includes("*") || 
        displayTop.textContent.includes("/")) {
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
    if (lastChar === "+" || lastChar === "-" || lastChar === "*" || lastChar === "/") {
      shouldCalculate = false;
      const updatedDisplay = displayTop.textContent.slice(0, -1) //**************** bug is here somewhere
      displayTop.textContent = updatedDisplay + text; //replaces operator with new one
      shouldCalculate = true; // reset calculate flag
    }    

    // calculates the equation if there is one operator and two operands
    if (shouldCalculate && displayBottom.textContent !== "error") {
      const result = calculateResult();
      displayTop.textContent = result;
      displayBottom.textContent = "";
      shouldCalculate = false;
    }
    
    if (!shouldCalculate) {
      shouldCalculate = true;
    } 

    // puts solution as a number of a new equation and avoids including 'error' in the equation
    if (displayBottom.textContent.length > 0 && displayBottom.textContent !== "error") {
      displayTop.textContent = displayBottom.textContent;
      displayBottom.textContent = "";
      // displayTop.textContent += text; 
    }

    //to avoid an operator before a number
    if (displayTop.textContent === "" && displayBottom.textContent === "" || displayBottom.textContent === "error") {
      displayTop.textContent = "";
      displayBottom.textContent = "";
      shouldCalculate = false;
    }

    else {
      // Add the new operator to the display
      displayTop.textContent += text;
    }

    decimalUsed = false; //reset decimal status flag
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
  let symbol = /[+\-*/]/g; // set operators under symbol var
  let operator = equation.match(symbol); // matches the symbol and stores as operator
  let [firstNumber, secondNumber] = equation.split(operator[0]).map(parseFloat); // splits equation on either side of the operator, converts to a number and stores as first and second numbers of equation
  let result = operate(firstNumber, operator[0], secondNumber); //triggers the equation and stores the result
  
  // Handle division by zero or other invalid operations
  if (isNaN(result) || !isFinite(result)) {
    displayTop.textContent = "";
    displayBottom.textContent = "";
    result = "error"; 
  } else {
    //eliminates unnecessary zeros after the decimal - max 3 decimal places
    result = result.toFixed(3).replace(/\.?0+$/, ''); 
  }
  if (displayBottom.textContent > 0) {
    displayBottom.textContent = ""; 
  }
  displayBottom.textContent += result; // puts answer in display
  return result; // returns answer to be called in other functions
}

//keyboard support for same operations as above
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
  if (/^[+\-*/]$/.test(key)) {
    if (shouldCalculate) {
      const result = calculateResult();
      displayTop.textContent = result;
      displayBottom.textContent = "";
      shouldCalculate = false;
    } 
    
    if (!shouldCalculate) { 
      shouldCalculate = true;
    }
    
    if (displayBottom.textContent.length > 0 && displayBottom.textContent !== "error") { 
      displayTop.textContent = displayBottom.textContent;
      displayBottom.textContent = "";
    } 
    if (lastChar === "+" || lastChar === "-" || lastChar === "*" || lastChar === "/") {
      displayTop.textContent = displayTop.textContent.slice(0, -1) + key;
    } else if (displayTop.textContent === "" && displayBottom.textContent === "") {
      displayTop.textContent = ""; //to stop putting an operator before a number
    } else {
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
  } 
  //backspace
  if (key === 'Backspace') {
    displayBottom.textContent = "";
    displayTop.textContent = displayTop.textContent.slice(0, -1);
  } 
  //clear all with delete key
  if (key === 'Delete') {
    displayTop.textContent = ""; 
    displayBottom.textContent = "";
  } 
});