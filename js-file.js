//our operations
const add = (x, y) => x + y;
const subtract = (x, y) => x - y;
const multiply = (x, y) => x * y;
const divide = (x, y) => x / y;

//undeclared variables to use later in calculation function
let firstNumber
let operator
let secondNumber

//operation function - to be called through calculation function and perform outputs
const operate = (firstNumber, operator, secondNumber) => {
  if(operator === '+') {return add(firstNumber, secondNumber);}
  if(operator === '-') {return subtract(firstNumber, secondNumber);}
  if(operator === 'x') {return multiply(firstNumber, secondNumber);}
  if(operator === '÷' && secondNumber === 0) {return "error";}
  if(operator === '÷') {return divide(firstNumber, secondNumber);}
};

let decimalUsed = false; //our flag, used later to ensure only one decimal per operand

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
      displayTop.textContent = "";
      displayBottom.textContent = "";
    } else {
      displayBottom.textContent = "";
      displayTop.textContent = displayTop.textContent.slice(0, -1);
    }
  });
});


//add number to display when clicked
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    const text = button.textContent;
    if(displayBottom.textContent.length > 0) {
      displayBottom.textContent = "";
      displayTop.textContent = "";
    } 
    displayTop.textContent += text;
  });
});


decimalButton.addEventListener('click', () => {
  if (!decimalUsed) {
    displayTop.textContent += '.';
    decimalUsed = true; // Set the flag to true after adding the decimal
  }
});
 

//adds operator to display
operatorButtons.forEach(button => {
  button.addEventListener('click', () => {
    const text = button.textContent;
    const lastChar = displayTop.textContent.slice(-1);
    
    decimalUsed = false;

    if (displayBottom.textContent.length > 0 && displayBottom.textContent !== "error") {
      displayTop.textContent = displayBottom.textContent;
      displayBottom.textContent = "";
      displayTop.textContent += text;
    } else if (lastChar === "+" || lastChar === "-" || lastChar === "x" || lastChar === "÷") {
      displayTop.textContent = displayTop.textContent.slice(0, -1) + text; 
    } else if (displayTop.textContent === "" && displayBottom.textContent === "" || displayBottom.textContent === "error") { //to stop putting an operator before a number
      displayTop.textContent = "";
      displayBottom.textContent =""; 
    } else {
      displayTop.textContent += text;
    }
  });
});


//calculates the equation - click 'equals'
equalButton.addEventListener('click', calculateResult);

// this is our big boy - calculates total
function calculateResult() {
  let equation = displayTop.textContent;
  let symbol = /[+\-÷x]/g;
  let operator = equation.match(symbol);
  let [firstNumber, secondNumber] = equation.split(operator[0]).map(parseFloat);
  let result = operate(firstNumber, operator[0], secondNumber);
  
  // Handle division by zero or other invalid operations
  if (isNaN(result) || !isFinite(result)) {
    displayTop.textContent = "";
    displayBottom.textContent = "";
    result = "error"; 
  } else {
    //eliminates unnecessary zeroes after the decimal - max 3 decimal places
    result = result.toFixed(3).replace(/\.?0+$/, ''); 
  }
  if (displayBottom.textContent > 0) {
    displayBottom.textContent = "";
  }
  displayBottom.textContent += result;
};


//keyboard support - same syntax and operations as above
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
  if (/^[+\-]$/.test(key)) {
    if (displayBottom.textContent.length > 0) { 
      displayTop.textContent = displayBottom.textContent;
      displayBottom.textContent = "";
    } 
    if (lastChar === "+" || lastChar === "-" || lastChar === "x" || lastChar === "÷") {
      displayTop.textContent = displayTop.textContent.slice(0, -1) + key;
    } else if (displayTop.textContent === "" && displayBottom.textContent === "") {
      displayTop.textContent = ""; //to stop putting an operator before a number
    } else {
      displayTop.textContent += key;
    }
  }
  if (key === '*') {
    if (displayBottom.textContent.length > 0) { 
      displayTop.textContent = displayBottom.textContent;
      displayBottom.textContent = "";
    }
    if (lastChar === "+" || lastChar === "-" || lastChar === "x" || lastChar === "÷") {
      displayTop.textContent = displayTop.textContent.slice(0, -1) + 'x';
    } else if (displayTop.textContent === "" && displayBottom.textContent === "") {
      displayTop.textContent = ""; //to stop putting an operator before a number
    } else {
      displayTop.textContent += 'x';
    }
  }
  if (key === '/') {
    if (displayBottom.textContent.length > 0) { 
      displayTop.textContent = displayBottom.textContent;
      displayBottom.textContent = "";
    } 
    if (lastChar === "+" || lastChar === "-" || lastChar === "x" || lastChar === "÷") {
      displayTop.textContent = displayTop.textContent.slice(0, -1) + '÷';
    } else if (displayTop.textContent === "" && displayBottom.textContent === "") {
      displayTop.textContent = ""; //to stop putting an operator before a number
    } else {
      displayTop.textContent += '÷';
    }
  }
  if (key === '.') {displayTop.textContent += key;}
  //calculate total with enter key
  if (key === 'Enter') {calculateResult();} 
  //backspace
  if (key === 'Backspace') {displayTop.textContent = displayTop.textContent.slice(0, -1);} 
  //clear all with delete key
  if (key === 'Delete') {displayTop.textContent = ""; displayBottom.textContent = "";} 
});