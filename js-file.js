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
  if(operator === '÷' && secondNumber === 0) {return "(ง'̀-'́)ง";}
  if(operator === '÷') {return divide(firstNumber, secondNumber);}
};

const allButtons = document.querySelectorAll('button');
const clearButtons = document.querySelectorAll('.clear');
const operatorButtons = document.querySelectorAll('.operator');
const numberButtons = document.querySelectorAll('.number');
const decimalButton = document.getElementById('decimal');
const equalButton = document.getElementById('equal');
const displayTop = document.getElementById('display-top');
const displayBottom = document.getElementById('display-bottom');

//styles when mouseover/clicked etc.
allButtons.forEach(button => {
  button.addEventListener('mouseover', () => {
    button.classList.add('mouseover-blue');
  });
  button.addEventListener('mouseout', () => {
    button.classList.remove('mouseover-blue');
  });
  button.addEventListener('click', () => {
    button.classList.add('click');
    setTimeout(() => {
      button.classList.remove('click')
    }, 70);
  });
});
clearButtons.forEach(button => {
  button.addEventListener('mouseover', () => {
    button.classList.add('mouseover-red');
  });
  button.addEventListener('mouseout', () => {
    button.classList.remove('mouseover-red');
  });
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
operatorButtons.forEach(button => {
  button.addEventListener('mouseover', () => {
    button.classList.add('mouseover-operator');
  });
  button.addEventListener('mouseout', () => {
    button.classList.remove('mouseover-operator');
  });
  button.addEventListener('click', () => {
    const text = button.textContent;
    if (displayBottom.textContent.length > 0 && typeof parseFloat(displayBottom.textContent) === 'number') { 
      displayTop.textContent = displayBottom.textContent;
      displayBottom.textContent = "";
    }
    displayTop.textContent += text;
  });
});
equalButton.addEventListener('mouseover', () => {
  equalButton.classList.add('mouseover-equal');
});
equalButton.addEventListener('mouseout', () => {
  equalButton.classList.remove('mouseover-equal');
});
//calculates the equation when clicked/called
equalButton.addEventListener('click', calculateResult);

// this is our big boy - calculates total
function calculateResult() {
  let equation = displayTop.textContent;
  let symbol = /[+\-÷x]/g;
  let operator = equation.match(symbol);
  let [firstNumber, secondNumber] = equation.split(operator[0]).map(parseFloat);
  let result = operate(firstNumber, operator[0], secondNumber);
  //eliminates unnecessary zeroes after the decimal
  result = result.toFixed(3).replace(/\.?0+$/, ''); 
  displayBottom.textContent += result;
};

//keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
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
      if (displayBottom.textContent.length > 0 && typeof parseFloat(displayBottom.textContent) === 'number') { 
        displayTop.textContent = displayBottom.textContent;
        displayBottom.textContent = "";
      }
      displayTop.textContent += key;
    }
    if (key === '*') {
      if (displayBottom.textContent.length > 0 && typeof parseFloat(displayBottom.textContent) === 'number') { 
        displayTop.textContent = displayBottom.textContent;
        displayBottom.textContent = "";
      }
      displayTop.textContent += 'x';
    }
    if (key === '/') {
      if (displayBottom.textContent.length > 0 && typeof parseFloat(displayBottom.textContent) === 'number') { 
        displayTop.textContent = displayBottom.textContent;
        displayBottom.textContent = "";
      }
      displayTop.textContent += '÷';
    }
    if (key === '.') {displayTop.textContent += key;}
    //calculate total
    if (key === 'Enter') {calculateResult();} 
    //backspace
    if (key === 'Backspace') {displayTop.textContent = displayTop.textContent.slice(0, -1);} 
    //clear all
    if (key === 'Delete') {displayTop.textContent = ""; displayBottom.textContent = "";} 
  });