/*--------------------------------*/
/* JavaScript Calculator          */
/*--------------------------------*/
/* by Stephen Bau                 */
/*--------------------------------*/

var display = document.getElementById("display");
var buttons = document.getElementsByClassName("button");

var mode = "";
var type = "";
var input = [];
var tape = [];
var expression = "";
var str = "";
var operand = null;
var x = null;
var y = null;
var operator = "";
var float = false;
var result = 0;

init();

function init() {
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    button.addEventListener("click", function( event ) {
      getInput(this);
    });
  }
  keyboard();
}

function getInput(button) {
  var id = button.id;
  var classes = button.classList;

  // Get input type
  if (id === "clear") {
    type = "clear";
  } else if (id === "equals") {
    type = "calculate";
  } else if (id === "decimal") {
    type = "decimal";
  } else if (classes.contains("digit")) {
    type = "digit";
  } else if (classes.contains("operator")) {
    type = "operator";
  }

  // Enter value
  enter(button.value);
}

function enter(value) {
  switch (type) {
    case "clear":
      clear();
      break;
    case "calculate":
      enterEquals(value);
      break;
    case "decimal":
      enterDecimal(value);
      break;
    case "digit":
      enterDigit(value);
      break;
    case "operator":
      enterOperator(value);
  }
}

function keyboard() {
  keyboardEvents("keydown");
  keyboardEvents("keyup");
}

function keyboardEvents(keyEvent) {
  document.addEventListener(keyEvent, function (event) {
    if (event.defaultPrevented) {
      return;
    }
    var key = event.key || event.keyCode;

    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      if (button.value == key || key == "Enter" && button.value == "=") {
        if (keyEvent == "keydown") {
          button.classList.add("select");
          getInput(button);
        }
        if (keyEvent == "keyup") {
          button.classList.remove("select");
        }
      }
    }
  });
}

function clear() {
  mode = "";
  type = "";
  input = [];
  tape = [];
  expression = "";
  str = "";
  operand = null;
  x = null;
  y = null;
  operator = "";
  float = false;
  result = 0;
  displayResult(result);
}

function enterDigit(value) {
  if (mode === "calculate") {
    clear();
  }
  input.push(value);
  str = input.join('');
  displayResult(str);
  mode = "input";
}

function enterDecimal(value) {
  if (mode === "calculate") {
    clear();
  }
  if (!float) {
    input.push(value);
    float = true;
    str = input.join('');
  }
  displayResult(str);
  mode = "input";
}

function enterOperator(value) {
  // If the previous mode was "input",
  // enter the current number and calculate
  if (mode === "input") {
    var num = enterNumber();
    if (x && !y) {
      result = num;
    }
    resetInput();
    calculateResult();
    displayResult(result);
    printTape();
    x = result;
  }

  // Then update the operator
  operator = value;
  if (mode === "operator") {
    tape.pop();
    tape.push(value);
  } else {
    tape.push(value);
  }
  mode = "operator";
}

function enterEquals(value) {
  enterNumber();
  resetInput();
  calculateResult();
  displayResult(result);
  printTape();
  x = result;
  mode = "calculate";
}

function enterNumber() {
  operand = Number(str);
  if (mode === "input") {
    tape.push(operand);
  }
  if (x === null) {
    x = operand;
  } else {
    y = operand;
  }
  return operand;
}

function calculateResult() {
  if (y) {
    if (operator) {
      result = calculate(x, y, operator);
    }
  }
  return result;
}

function calculate(x, y, operator) {
  var result = null;
  switch (operator) {
    case "+":
      result = x + y;
      break;
    case "-":
      result = x - y;
      break;
    case "*":
      result = x * y;
      break;
    case "/":
      result = x / y;
  }
  return displayResult(result);
}

function displayResult(result) {
  var resultStr = result.toString();

  if (resultStr.length > 13) {
    result = Number(resultStr.slice(0,13));
  }
  if (resultStr[0] == '0') {
    result = Number(resultStr).toString();
  }
  if (resultStr[0] == '.') {
    result = '0' + resultStr;
  }
  display.innerText = result;
  return result;
}

function resetInput() {
  input = [];
  float = false;
}

function printTape() {
  expression = tape.join(' ');
  expression = translate(expression);
  console.log(expression);
  console.log("= " + result);
  return expression;
}

function translate(str) {
  var regex = /\*/;
  str = str.replaceAll(regex,'×')
  regex = /\//;
  str = str.replaceAll(regex,'÷')
  return str;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function debugCalculator() {
  console.log("mode: " + mode);
  console.log("type: " + type);
  console.log("input: " + input);
  console.log("tape: " + tape);
  console.log("expression: " + expression);
  console.log("str: " + str);
  console.log("operand: " + operand);
  console.log("x: " + x);
  console.log("y: " + y);
  console.log("operator: " + operator);
  console.log("float: " + float);
  console.log("result: " + result);
}
