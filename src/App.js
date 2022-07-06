import './App.css';
import { useState } from 'react'
import { evaluate } from 'mathjs'


function App() {

  return (
    <div className="App" >
      <Calculator />
    </div>
  );
}

// Main React component

function Calculator(props) {


  // *** STATE CONSTANTS ***
  const [bottomDisplay, setBottomDisplay] = useState("0")
  const [topDisplay, setTopDisplay] = useState("")
  
  // *** REGEX CONSTANTS ***

  // Test for operator anywhere in string
  const REGEX_OPERATOR_PRESENT = /[+\-x/]/
  
  // *** EVENT HANDLERS ***

  // Handle decimal click
  const onDecClick = () => {
    if (bottomDisplay.indexOf(".") === -1 && !REGEX_OPERATOR_PRESENT.test(bottomDisplay)) {
      setBottomDisplay(bottomDisplay + ".")
      setTopDisplay(topDisplay + ".")
    }
  }


  // Handle all clear click
  const onClearClick = () => {
    setBottomDisplay("0")
    setTopDisplay("")
  }
    
  // Handle equals click
  const onEqualsClick = () => {
    if (!isNaN(bottomDisplay)) {
      const solution = evaluate(topDisplay)
      
      setBottomDisplay(solution)
      setTopDisplay(topDisplay + " = " + solution)
    }
  }

  return (
    <div className="calculator">

      {/* Display component at top of calculator */}
      <Display topDisplay={topDisplay} bottomDisplay={bottomDisplay} />
      
      {/* All clear button - only one so not rendered as component */}
      <button id="clear" className="clear button" onClick={()=>onClearClick()}>AC</button>
      
      {/* Division button */}
      <Operator id="divide" text="/" operator="/" topDisplay={topDisplay} bottomDisplay={bottomDisplay} setTopDisplay={setTopDisplay} setBottomDisplay={setBottomDisplay} />

      {/* Multiplication button */}
      <Operator id="multiply" text="x" operator="x" topDisplay={topDisplay} bottomDisplay={bottomDisplay} setTopDisplay={setTopDisplay} setBottomDisplay={setBottomDisplay} />

      {/* Seven button */}
      <NumButton id="seven" text="7" topDisplay={topDisplay} bottomDisplay={bottomDisplay} setTopDisplay={setTopDisplay} setBottomDisplay={setBottomDisplay} />

      {/* Eight button */}
      <NumButton id="eight" text="8" topDisplay={topDisplay} bottomDisplay={bottomDisplay} setTopDisplay={setTopDisplay} setBottomDisplay={setBottomDisplay} />

      {/* Nine button */}
      <NumButton id="nine" text="9" topDisplay={topDisplay} bottomDisplay={bottomDisplay} setTopDisplay={setTopDisplay} setBottomDisplay={setBottomDisplay} />

      {/* Subtraction button */}
      <Operator id="subtract" text="&minus;" operator="-" topDisplay={topDisplay} bottomDisplay={bottomDisplay} setTopDisplay={setTopDisplay} setBottomDisplay={setBottomDisplay} />

      {/* Four button */}
      <NumButton id="four" text="4" topDisplay={topDisplay} bottomDisplay={bottomDisplay} setTopDisplay={setTopDisplay} setBottomDisplay={setBottomDisplay} />

      {/* Five button */}
      <NumButton id="five" text="5" topDisplay={topDisplay} bottomDisplay={bottomDisplay} setTopDisplay={setTopDisplay} setBottomDisplay={setBottomDisplay} />

      {/* Six button */}
      <NumButton id="six" text="6" topDisplay={topDisplay} bottomDisplay={bottomDisplay} setTopDisplay={setTopDisplay} setBottomDisplay={setBottomDisplay} />

      {/* Addition button */}
      <Operator id="add" text="+" operator="+" topDisplay={topDisplay} bottomDisplay={bottomDisplay} setTopDisplay={setTopDisplay} setBottomDisplay={setBottomDisplay} />

      {/* One button */}
      <NumButton id="one" text="1" topDisplay={topDisplay} bottomDisplay={bottomDisplay} setTopDisplay={setTopDisplay} setBottomDisplay={setBottomDisplay} />

      {/* Two button */}
      <NumButton id="two" text="2" topDisplay={topDisplay} bottomDisplay={bottomDisplay} setTopDisplay={setTopDisplay} setBottomDisplay={setBottomDisplay} />

      {/* Three button */}
      <NumButton id="three" text="3" topDisplay={topDisplay} bottomDisplay={bottomDisplay} setTopDisplay={setTopDisplay} setBottomDisplay={setBottomDisplay} />

      {/* Equals button - not a component because only one */}
      <button id="equals" className="equals button" onClick={()=>onEqualsClick()}>=</button>

      {/* Zero button */}
      <NumButton id="zero" text="0" topDisplay={topDisplay} bottomDisplay={bottomDisplay} setTopDisplay={setTopDisplay} setBottomDisplay={setBottomDisplay} />

      {/* Equals button */}
      <button id="decimal" className="number button" onClick={()=>onDecClick()}>.</button>
    </div>
  )
}

function Display(props) {
  
  /***** Divided display into two parts. Top display
 * shows the current formula being constructed. Bottom display shows only the number or the operator being used.
 * 
 */
  
  return (
    <div id="main-display" className="display">
      <div id="top-display" className="top-display">{props.topDisplay}</div>
      <div id="display" className="bottom-display">{props.bottomDisplay}</div>
    </div>
  )
}

function NumButton(props) {
  
  // save props as constants for easier reference
  const bottomDisplay = props.bottomDisplay
  const topDisplay = props.topDisplay
  const setBottomDisplay = props.setBottomDisplay
  const setTopDisplay = props.setTopDisplay

  // Regex tests

  // Test for any operator at the end of string
  const REGEX_ANY_OPERATOR_AT_END = /[+\-x/]$/
  // Test for operator followed by a negative symbol
  const REGEX_OPERATOR_THEN_NEGATIVE = /([+\-*/] -)$/

  // Handle number clicks. Takes in the current digit being passed as a string.
  const onNumClick = (digit) => {
    
    // If the bottom display is 0, then no matter what number is entered, we want both the bottom and top display to display only that digit.

    // If the top display contains an equals sign, that means a solution has been calculated, and if a user enters a digit, then we want to clear the previous equation and start building a new equation. In that case, we also only want to display the digit in the top and bottom displays.

    if (bottomDisplay === "0" || topDisplay.indexOf("=") !== -1) {
      setTopDisplay(digit)
      setBottomDisplay(digit)
      return
    }

    // If the top display ends with an operator, a space, and the subtract operator, and then the user enters a number, the calculator assumes the user is trying to enter a negative number. The digit will be concatenated to the subtract operator to turn it into a negative number symbol.

    if (REGEX_OPERATOR_THEN_NEGATIVE.test(topDisplay)) {
      setBottomDisplay(bottomDisplay + digit)
      setTopDisplay(topDisplay + digit)
      return
    }
    
    // If the user is entering a digit after a single operator, then bottom display will clear the operator and start building the new number. The top display will append the digit to the expression already there.
    if (REGEX_ANY_OPERATOR_AT_END.test(bottomDisplay)) {
      setBottomDisplay(digit)
      setTopDisplay(topDisplay + digit)
      return
    }

    // The only other situation is a that a user is appending a digit to a number, in which case we simply concatenate the digit.
    setBottomDisplay(bottomDisplay + digit)
    setTopDisplay(topDisplay + digit)
  }

  return (
      <button id={props.id} className={"number button " + props.id} onClick={()=>onNumClick(props.text)}>{props.text}</button>
  )
}

function Operator(props) {

  // save props as constants for easier reference
  const bottomDisplay = props.bottomDisplay
  const topDisplay = props.topDisplay
  const setBottomDisplay = props.setBottomDisplay
  const setTopDisplay = props.setTopDisplay

  // Regex constants
  const REGEX_TOP_DISPLAY_OPERATOR = /([+\-*/] )$/
  const REGEX_OPERATOR_THEN_NEGATIVE = /([+\-*/] -)$/
  const REGEX_DIGIT_AT_END = /([0-9]$)/

  const checkOperatorForMultiply = (operator) => {
    if (operator === "x") {
      return "*"
    }
    return operator
  }

  const onOperatorClick = (operator) => {
  
    // First condition to test is whether the top display already ends with an operator and a white space.
    if (REGEX_TOP_DISPLAY_OPERATOR.test(topDisplay)) {
      setBottomDisplay(operator)
      // If operator is multiply, it needs to be converted to an asterisk for the top display.
      operator = checkOperatorForMultiply(operator)

      // If the user types the subtract operator followed by an operator, the calculator will treat it as the start of a negative number.
      if (operator === "-") {
        setTopDisplay(topDisplay + operator)
        return
      }

      // If the user types in any other operator, the calculator will replace the previous operator.

      setTopDisplay(topDisplay.replace(REGEX_TOP_DISPLAY_OPERATOR, operator + " "))
      return
    }
    
    // Last special case to check for is if the user types an operator when the top display is [operator], space, [negative symbol]. In this case, we want to replace that ending with the inputted operator.

    if (REGEX_OPERATOR_THEN_NEGATIVE.test(topDisplay)) {
      setBottomDisplay(operator)
      operator = checkOperatorForMultiply(operator)
      setTopDisplay(topDisplay.replace(REGEX_OPERATOR_THEN_NEGATIVE, operator + " "))
      return
    }

    // This test determines if an operator is entered with a valid number in the bottom display.

    if (REGEX_DIGIT_AT_END.test(bottomDisplay)) {
      setBottomDisplay(operator)
      operator = checkOperatorForMultiply(operator)
      
      // If a solution was just calculated, set the top display to include the solution from the bottom display.
      if (topDisplay.indexOf("=") !== -1) {
        setTopDisplay(bottomDisplay + " " + operator + " ")
        return
      }

      // Otherwise, concatenate the operator to the current top display.
      setTopDisplay(topDisplay + " " + operator + " ")
      return
    }
    }

    return(
      <button id={props.id} className="operator button" onClick={()=>onOperatorClick(props.operator)}>{props.text}</button>
    )

}

export default App;
