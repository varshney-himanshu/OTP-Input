import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./style.css";

let index = -1; // position of the current input (-1 = not focused on any input)
let keyCode;

function OTP({
  active,
  numberOfInputs,
  isNumber,
  placeholder,
  inputStyle,
  inputClass,
  containerStyle,
  containerClass,
  buttonStyle,
  buttonContainer,
  hasErrored,
}) {
  const ref = useRef(null);
  const [code, setCode] = useState("");
  let validRegex = isNumber ? /^[0-9]+$/ : /./;

  /* makes the current index -1 when someone clicks outside of the input container */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setPosition(-1);
      }
    };
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (hasErrored === true) {
      const inputClassAll = document.querySelectorAll(".otp__input");
      for (let i = 0; i < inputClassAll.length; i++) {
        inputClassAll[i].classList.toggle("otp__input--active");
      }
    } else {
      const inputClassAll = document.querySelectorAll(".otp__input");
      for (let i = 0; i < inputClassAll.length; i++) {
        inputClassAll[i].classList.remove("otp__input--active");
      }
    }
  }, [hasErrored]);

  /* Focuses on the next input when characters are entered sequentially */
  useEffect(() => {
    if (index !== -1) {
      if (code.length - 1 >= index) {
        if (index < numberOfInputs - 1) {
          const nextInput = document.querySelector(`#index-${index + 1}`);
          nextInput.focus();
          return;
        }
      }

      if (code.length < numberOfInputs && keyCode !== 8) {
        const nextInput = document.querySelector(`#index-${code.length}`);
        nextInput.focus();
      }
    }
  }, [code, numberOfInputs]);

  /* Sets the index position and selects the character when input is focused */
  function onInputFocus(e, pos) {
    const currentInput = document.querySelector(`#index-${pos}`);
    if (currentInput !== null) {
      currentInput.classList.remove("otp__input--active");
    }

    setTimeout(() => {
      currentInput.setSelectionRange(0, 1);
    }, 0);

    setPosition(pos);
  }

  /* Sets the index for the current input */
  function setPosition(pos) {
    index = pos;
  }

  /* handles backspace, arrow key events  */
  function handleKeyDown(e) {
    // backspace key event

    keyCode = e.keyCode;
    if (e.keyCode === 8) {
      if (index !== -1) {
        const newcode = removeCharacter(code, index);
        setCode(newcode);

        if (index > 0) {
          const nextInput = document.querySelector(`#index-${index - 1}`);
          nextInput.focus();
        }
      }
    }

    // left arrow event
    if (e.keyCode === 37) {
      if (index > 0) {
        const prevInput = document.querySelector(`#index-${index - 1}`);
        prevInput.focus();
      }
    }

    // right arrow event
    if (e.keyCode === 39) {
      if (index < numberOfInputs - 1) {
        const nextInput = document.querySelector(`#index-${index + 1}`);

        nextInput.focus();
      }
    }
  }

  /* handles input value changes */
  function handleOnChange(e) {
    let char = e.target.value[0];

    if (e.target.value.match(validRegex)) {
      if (index !== -1) {
        if (e.target.value !== "") {
          //if the code is empty
          if (code.length === 0) {
            setCode(char);

            //if the index of current focused input is less than the length of the code
          } else if (code.length - 1 < index) {
            setCode(code + char);

            //if the index of current focused input is greater than or equal to the length of the code. the following code will replace the character of the code string at the same position as the input.
          } else if (code.length - 1 >= index) {
            const newcode = setCharAt(code, index, char);
            setCode(newcode);
          }
        }
      }
    }
  }

  /* removes a character from the string */
  function removeCharacter(str, index) {
    let subStr1 = str.substring(0, index);
    let subStr2 = str.substring(index + 1, str.length);
    return subStr1 + subStr2;
  }

  /* replaces a character from the string */
  function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
  }

  /* pastes the string from the clipboard  */
  function onPaste(e) {
    var clipboardData, pastedData;
    e.stopPropagation();
    e.preventDefault();
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData("Text");
    pastedData = pastedData.trim();
    if (pastedData.match(/^[0-9]+$/)) {
      let str = pastedData;
      if (pastedData.length > numberOfInputs) {
        str = pastedData.slice(0, numberOfInputs);
      }
      setCode(str);
    }
  }

  function onInput(e) {
    if (code[index] === e.target.value[0]) {
      if (index < numberOfInputs - 1) {
        const nextInput = document.querySelector(`#index-${index + 1}`);
        nextInput.focus();
      }
    }
  }

  /* returns an array of input fields */
  function getInputsJSX() {
    const inputs = [];
    for (let i = 0; i < numberOfInputs; i++) {
      let input = (
        <input
          id={`index-${i}`}
          key={`input-${i}`}
          className={`otp__input ${inputClass}`}
          style={inputStyle}
          onFocus={(e) => onInputFocus(e, i)}
          onChange={handleOnChange}
          onPaste={onPaste}
          value={code[i] ? code[i] : ""}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          onInput={onInput}
        ></input>
      );

      inputs.push(input);
    }

    return inputs;
  }

  let inputsJSX = getInputsJSX();

  return (
    <div className="input-card">
      <div
        className={`form-container ${containerClass}`}
        style={containerStyle}
      >
        <div className="otp">
          <div className="otp__title">Phone Verification</div>
          <div className="otp__line"></div>
          <div className="otp__content">
            Enter the OTP you received on 89206-6XXXX
          </div>
          <div ref={ref}>{inputsJSX}</div>
          <div className="otp__alternate-options">
            <button className="otp__alternate-options__changebtn">
              Change Number
            </button>
            <button className="otp__alternate-options__changebtn">
              Re-send OTP
            </button>
          </div>
          <button className="otp__submit-btn">Verify Phone Number</button>
        </div>
      </div>
    </div>
  );
}

OTP.defaultProps = {
  numberOfInputs: 4,
  isNumber: false,
  placeholder: "0",
  inputStyle: {},
  inputClass: "",
  containerStyle: {},
  containerClass: "",
  hasErrored: false,
};

OTP.propTypes = {
  numberOfInputs: PropTypes.number,
  isNumber: PropTypes.bool,
  placeholder: PropTypes.string,
  inputStyle: PropTypes.object,
  inputClass: PropTypes.string,
  containerStyle: PropTypes.object,
  containerClass: PropTypes.string,
  hasErrored: PropTypes.bool,
};

export default OTP;
