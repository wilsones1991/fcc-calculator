import './App.css';
import { useState, useEffect } from 'react'
import { evaluate } from 'mathjs'

function App() {

  return (
    <div className="App" >
      <Calculator />
    </div>
  );
}

// Main React component

function Calculator() {


  // *** STATE CONSTANTS ***

  const [display, setDisplay] = useState( { "bottomDisplay": "0", "topDisplay": "" } )

  useEffect(()=> {

  const handleKeyEvent = (key) => {
    // *** REGEX CONSTANTS ***

  // Test for operator anywhere in string
  const REGEX_OPERATOR_PRESENT = /[+\-x/]/
  // Test for any operator at the end of string
  const REGEX_ANY_OPERATOR_AT_END = /[+\-x/]$/
  // Test for operator followed by a negative symbol
  const REGEX_OPERATOR_THEN_NEGATIVE = /([+\-*/] -)$/
  
  const REGEX_TOP_DISPLAY_OPERATOR = /([+\-*/] )$/
  const REGEX_DIGIT_AT_END = /([0-9]$)/


  // *** HELPER FUNCTIONS ***

  const checkOperatorForMultiply = (operator) => {
    if (operator === "x") {
      return "*"
    }
    return operator
  }

  // *** EVENT HANDLERS ***

  // Handle all clear click
    const onClearClick = () => {
      setDisplay({"bottomDisplay": "0", "topDisplay": ""})
    }

  // Handle decimal click
  const onDecClick = () => {
    
    setDisplay(display => {
      if (display.bottomDisplay.indexOf(".") === -1 && !REGEX_OPERATOR_PRESENT.test(display.bottomDisplay)) {
        const updatedBottomDisplay = display.bottomDisplay += "."
        const updatedTopDisplay = display.topDisplay += "."
        return {"bottomDisplay": updatedBottomDisplay, "topDisplay": updatedTopDisplay}
      }
      return display
    })
  }

  // Handle equals click
  const onEqualsClick = () => {
    setDisplay(display => {
      if (!isNaN(display.bottomDisplay)) {
        const prevTopDisplay = display.topDisplay
        const solution = evaluate(prevTopDisplay)
        
        return {"bottomDisplay": solution, "topDisplay": prevTopDisplay + " = " + solution}
        }
      return display
    })
    }

   // Handle number clicks. Takes in the current digit being passed as a string.
   const onNumClick = (digit) => {

    let updatedBottomDisplay = null
    let updatedTopDisplay = null

    setDisplay(display => {
        
      // If the bottom display is 0, then no matter what number is entered, we want both the bottom and top display to display only that digit.

      // If the top display contains an equals sign, that means a solution has been calculated, and if a user enters a digit, then we want to clear the previous equation and start building a new equation. In that case, we also only want to display the digit in the top and bottom displays.

      if (display.bottomDisplay === "0" || display.topDisplay.indexOf("=") !== -1) {

        updatedBottomDisplay = digit
        updatedTopDisplay = digit

      // If the top display ends with an operator, a space, and the subtract operator, and then the user enters a number, the calculator assumes the user is trying to enter a negative number. The digit will be concatenated to the subtract operator to turn it into a negative number symbol.

      } else if (REGEX_OPERATOR_THEN_NEGATIVE.test(display.bottomDisplay)) {

        updatedBottomDisplay = display.bottomDisplay + digit
        updatedTopDisplay = display.topDisplay + digit

      // If the user is entering a digit after a single operator, then bottom display will clear the operator and start building the new number. The top display will append the digit to the expression already there.

      } else if (REGEX_ANY_OPERATOR_AT_END.test(display.bottomDisplay)) {
        updatedBottomDisplay = digit
        updatedTopDisplay = display.topDisplay + digit
      
      // The only other situation is a that a user is appending a digit to a number, in which case we simply concatenate the digit.
      
      } else {
        updatedBottomDisplay = display.bottomDisplay + digit
        updatedTopDisplay = display.topDisplay + digit
      }

    return {"bottomDisplay": updatedBottomDisplay, "topDisplay": updatedTopDisplay}
    })
  }

  const onOperatorClick = (operator) => {

    let updatedBottomDisplay = null
    let updatedTopDisplay = null

    setDisplay(display => {
      // First condition to test is whether the top display already ends with an operator and a white space.
    if (REGEX_TOP_DISPLAY_OPERATOR.test(display.topDisplay)) {
      updatedBottomDisplay = operator
      // If operator is multiply, it needs to be converted to an asterisk for the top display.
      operator = checkOperatorForMultiply(operator)
      
      // If the user types the subtract operator followed by an operator, the calculator will treat it as the start of a negative number.
      if (operator === "-") {
        updatedTopDisplay = display.topDisplay + operator
      
      // If the user types in any other operator, the calculator will replace the previous operator.
      } else {
        updatedTopDisplay = display.topDisplay.replace(REGEX_TOP_DISPLAY_OPERATOR, operator + " ")
      }
    // Last special case to check for is if the user types an operator when the top display is [operator], space, [negative symbol]. In this case, we want to replace that ending with the inputted operator.
    
    } else if (REGEX_OPERATOR_THEN_NEGATIVE.test(display.topDisplay)) {
      updatedBottomDisplay = operator
      operator = checkOperatorForMultiply(operator)
      updatedTopDisplay = display.topDisplay.replace(REGEX_OPERATOR_THEN_NEGATIVE, operator + " ")

      // This test determines if an operator is entered with a valid number in the bottom display.
    } else if (REGEX_DIGIT_AT_END.test(display.bottomDisplay)) {
      // Don't want to accept an operator when nothing has been inputted
      if (display.topDisplay === "") {
        updatedBottomDisplay = display.bottomDisplay
        updatedTopDisplay = display.topDisplay
      } else {
        updatedBottomDisplay = operator
        operator = checkOperatorForMultiply(operator)
        // If a solution was just calculated, set the top display to include the solution from the bottom display.
        if (display.topDisplay.indexOf("=") !== -1) {
          updatedTopDisplay = display.bottomDisplay + " " + operator + " "
        // Otherwise, concatenate the operator to the current top display.
        } else {
          updatedTopDisplay = display.topDisplay + " " + operator + " "
        }
      }
      
    }
    return { "bottomDisplay": updatedBottomDisplay, "topDisplay": updatedTopDisplay }
  })
    }
  
  switch (key) {
    case '.':
      onDecClick()
      break
    case 'Backspace':
      onClearClick()
      break
    case 'Enter':
    case '=':
      onEqualsClick()
      break
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      onNumClick(key)
      break
    case '+':
    case '-':
    case 'x':
    case '/':
      onOperatorClick(key)
      break
    case '*':
      onOperatorClick('x')
      break
    default:
      break
  }
  }

    document.addEventListener('keydown', (e)=>{
      handleKeyEvent(e.key)
    })
    document.addEventListener('click', (e)=>{
      handleKeyEvent(e.target.getAttribute('clickname'))
    })
    return () => {
      document.removeEventListener('keydown', (e)=>{
        handleKeyEvent(e.key)
      })
      document.removeEventListener('click', (e)=>{
        handleKeyEvent(e.target.getAttribute('clickname'))
      })
    }
  },[])

  return (
    
    <div className="calculator" >
      {/* Display component at top of calculator */}
      <Display display={display} />
      
      {/* All clear button - only one so not rendered as component */}
      <button id="clear" text="AC" clickname="Backspace" className="clear button">AC</button>
      
      {/* Division button */}
      <Operator id="divide" text="/" clickname="/" />

      {/* Multiplication button */}
      <Operator id="multiply" text="x" clickname="x" />

      {/* Seven button */}
      <NumButton id="seven" text="7" clickname="7" />

      {/* Eight button */}
      <NumButton id="eight" text="8" clickname="8" />

      {/* Nine button */}
      <NumButton id="nine" text="9" clickname="9" />

      {/* Subtraction button */}
      <Operator id="subtract" text="&minus;" clickname="-" />

      {/* Four button */}
      <NumButton id="four" text="4" clickname="4" />

      {/* Five button */}
      <NumButton id="five" text="5" clickname="5" />

      {/* Six button */}
      <NumButton id="six" text="6" clickname="6" />

      {/* Addition button */}
      <Operator id="add" text="+" clickname="+" />

      {/* One button */}
      <NumButton id="one" text="1" clickname="1" />

      {/* Two button */}
      <NumButton id="two" text="2" clickname="2" />

      {/* Three button */}
      <NumButton id="three" text="3" clickname="3" />

      {/* Equals button - not a component because only one */}
      <button id="equals" text="=" clickname="=" className="equals button">=</button>

      {/* Zero button */}
      <NumButton id="zero" text="0" clickname="0" />

      {/* Decimal button */}
      <button id="decimal" text="." clickname="." className="number button">.</button>
    </div>
  )

}

function Display( { display } ) {
  
  /***** Divided display into two parts. Top display
 * shows the current formula being constructed. Bottom display shows only the number or the operator being used.
 * 
 */

  return (
    <div id="main-display" className="display">
      <div id="top-display" className="top-display">{display.topDisplay}</div>
      <div id="display" className="bottom-display">{display.bottomDisplay}</div>
    </div>
  )
}

function NumButton( { id, text, clickname } ) {

  return (
      <button id={id} clickname={clickname} className={"number button " + id}>{text}</button>
  )
}

function Operator({ id, text, clickname }) {

    return(
      <button id={id} clickname={clickname}className="operator button">{text}</button>
    )
}

export default App;
