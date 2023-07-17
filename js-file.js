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