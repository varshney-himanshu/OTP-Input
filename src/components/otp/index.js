import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./style.css";
import { floor } from "lodash";
// let index = -1;

const BACKSPACE_KEY = 8;
const LEFTARROW_KEY = 37;
const RIGHTARROW_KEY = 39;
const NOT_SELECTED = -1;
const EMPTY_CHARACTER = " ";

//let keyCode;
function OTP({
  value,
  setValue,
  numberOfInputs,
  isNumber,
  placeholder,
  primaryText,
  secondaryText,
  hasErrored,
  isDisabled,
  resendDuration,
  onOtpResend,
  inputStyle,
  inputClass,
  containerStyle,
  containerClass,
  primaryTextStyle,
  primaryTextClass,
  secondaryTextStyle,
  secondaryTextClass,
  primaryButtonStyle,
  primaryButtonClass,
  secondaryButtonStyle,
  secondaryButtonClass,
  onOTPSubmit,
}) {
  const ref = useRef(null);

  const index = useRef(NOT_SELECTED); // position of the current input (-1 = not focused on any input)
  const keyCode = useRef(null);

  const [isResendInactive, setIsResendInactive] = useState(false);
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(true);
  const [isDisabledClear, setIsDisabledClear] = useState(true);
  let duration = resendDuration - 1;
  //let minutes = floor(duration / 60);
  const [minutes, setMinutes] = useState(floor(duration / 60));
  let seconds = duration % 60;
  //duration = new Date(resendDuration * 1000).toISOString().substr(14, 5);
  const [counter, setCounter] = useState(seconds);
  let validRegex = isNumber ? /^[0-9]+$/ : /./;

  /* makes the current index -1 when someone clicks outside of the input container */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setPosition(NOT_SELECTED);
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
    if (index.current !== NOT_SELECTED) {
      if (value.length - 1 >= index.current) {
        if (index.current < numberOfInputs - 1) {
          const nextInput = document.getElementById(
            `index-${index.current + 1}`
          );
          nextInput.focus();
          return;
        }
      }

      if (value.length < numberOfInputs && keyCode.current !== BACKSPACE_KEY) {
        const nextInput = document.getElementById(`index-${value.length}`);
        nextInput.focus();
      }
    }
  }, [value, numberOfInputs]);

  let noOfInputs = numberOfInputs;

  /*This useEffect will make clear button active when input value is not empty */
  useEffect(() => {
    if (value !== "") {
      setIsDisabledClear(false);
    } else {
      setIsDisabledClear(true);
    }

    if (value.length === noOfInputs) {
      setIsDisabledSubmit(false);
    } else {
      setIsDisabledSubmit(true);
    }
  }, [value, noOfInputs]);

  /*This useEffect will start the timer on Resend Button Click*/
  useEffect(() => {
    if (isResendInactive) {
      var timer =
        counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
      if (counter === 0) {
        if (minutes > 0) {
          setCounter(59);
          setMinutes(minutes - 1);
        } else {
          setIsResendInactive(false);
        }
      }
    }
    return () => {
      clearInterval(timer);
    };
  }, [counter, minutes, isResendInactive]);

  function handleOnClear() {
    setValue("");
    const nextInput = document.getElementById(`index-0`);
    nextInput.focus();
  }

  function handleOnResend() {
    setIsResendInactive(true);
    setMinutes(floor(duration / 60));
    setCounter(seconds);
    onOtpResend();
  }

  /* Sets the index position and selects the character when input is focused */
  function onInputFocus(e, pos) {
    const currentInput = document.getElementById(`index-${pos}`);
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
    index.current = pos;
  }

  /* handles backspace, arrow key events  */
  function handleKeyDown(e) {
    // backspace key event

    keyCode.current = e.keyCode;
    if (keyCode.current === BACKSPACE_KEY) {
      if (index.current !== NOT_SELECTED) {
        const newvalue = removeCharacter(value, index.current);
        setValue(newvalue);

        if (index.current > 0) {
          const nextInput = document.getElementById(
            `index-${index.current - 1}`
          );
          nextInput.focus();
        }
      }
    }

    // left arrow event
    if (e.keyCode === LEFTARROW_KEY) {
      if (index.current > 0) {
        const prevInput = document.getElementById(`index-${index.current - 1}`);
        prevInput.focus();
      }
    }

    // right arrow event
    if (e.keyCode === RIGHTARROW_KEY) {
      if (index.current < numberOfInputs - 1) {
        const nextInput = document.getElementById(`index-${index.current + 1}`);

        nextInput.focus();
      }
    }
  }

  /* handles input value changes */
  function handleOnChange(e) {
    let char = e.target.value[0];

    if (char === EMPTY_CHARACTER) {
      if (index.current < numberOfInputs - 1) {
        const nextInput = document.getElementById(`index-${index.current + 1}`);
        nextInput.focus();
      }
      return;
    }

    if (e.target.value.match(validRegex)) {
      if (index.current !== NOT_SELECTED) {
        if (e.target.value !== "") {
          //if the value is empty
          if (value.length === 0) {
            setValue(char);

            //if the index of current focused input is greater than the length of the value
          } else if (value.length - 1 < index.current) {
            setValue(value + char);

            //if the index of current focused input is greater than or equal to the length of the value. the following value will replace the character of the value string at the same position as the input.
          } else if (value.length - 1 >= index.current) {
            const newvalue = setCharAt(value, index.current, char);
            setValue(newvalue);
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
    if (pastedData.match(validRegex)) {
      let str = pastedData;
      if (pastedData.length > numberOfInputs) {
        str = pastedData.slice(0, numberOfInputs);
      }
      setValue(str);
    }
  }

  function onInput(e) {
    if (value[index.current] === e.target.value[0]) {
      if (index.current < numberOfInputs - 1) {
        const nextInput = document.getElementById(`index-${index.current + 1}`);
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
          value={value[i] ? value[i] : ""}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          onInput={onInput}
          disabled={isDisabled}
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
          <div
            className={`otp__title ${primaryTextClass}`}
            style={primaryTextStyle}
          >
            {primaryText}
          </div>
          <div className="otp__line"></div>
          <div
            className={`otp__content ${secondaryTextClass}`}
            style={secondaryTextStyle}
          >
            {secondaryText}
          </div>
          <div ref={ref}>{inputsJSX}</div>
          <div className="otp__alternate-options">
            <button
              className={`otp__alternate-options__changebtn ${secondaryButtonClass}`}
              style={secondaryButtonStyle}
              onClick={handleOnClear}
              disabled={isDisabled || isDisabledClear}
            >
              Clear input
            </button>
            {!isResendInactive ? (
              <button
                className={`otp__alternate-options__changebtn ${secondaryButtonClass}`}
                style={secondaryButtonStyle}
                onClick={handleOnResend}
              >
                Resend OTP
              </button>
            ) : (
              <span className="otp__alternate-options__timer">
                Resend OTP in {minutes < 10 ? "0" + minutes : minutes}:
                {counter < 10 ? "0" + counter : counter}
              </span>
            )}
          </div>
          <button
            className={`otp__submit-btn ${primaryButtonClass}`}
            style={primaryButtonStyle}
            disabled={isDisabledSubmit}
            onClick={onOTPSubmit}
          >
            Verify Phone Number
          </button>
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
  primaryTextStyle: {},
  primaryTextClass: "",
  secondaryTextStyle: {},
  secondaryTextClass: "",
  primaryButtonStyle: {},
  primaryButtonClass: "",
  secondaryButtonStyle: {},
  secondaryButtonClass: "",
  hasErrored: false,
  isDisabled: false,
  resendDuration: 60,
  onOtpResend: () => {},
  primaryText: "Phone Verification",
  secondaryText: "Enter the OTP you received on 89206-6XXXX",
  onOTPSubmit: () => {},
};

OTP.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func,
  numberOfInputs: PropTypes.number,
  isNumber: PropTypes.bool,
  placeholder: PropTypes.string,
  inputStyle: PropTypes.object,
  inputClass: PropTypes.string,
  containerStyle: PropTypes.object,
  containerClass: PropTypes.string,
  hasErrored: PropTypes.bool,
  isDisabled: PropTypes.bool,
  resendDuration: PropTypes.number,
  onOtpResend: PropTypes.func,
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  primaryTextStyle: PropTypes.object,
  primaryTextClass: PropTypes.string,
  secondaryTextStyle: PropTypes.object,
  secondaryTextClass: PropTypes.string,
  primaryButtonStyle: PropTypes.object,
  primaryButtonClass: PropTypes.string,
  secondaryButtonStyle: PropTypes.object,
  secondaryButtonClass: PropTypes.string,
  onOTPSubmit: PropTypes.func,
};

export default OTP;
