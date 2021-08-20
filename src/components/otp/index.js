import React, { useState, useRef, useEffect } from "react";
import "./style.css";

let index = 0;

export default function OTP({ active, numberOfInputs = 8, isNumber = true }) {
  const ref = useRef(null);
  const [code, setCode] = useState("");

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
    if (code.length < numberOfInputs) {
      const nextInput = document.querySelector(`#index-${code.length}`);
      nextInput.focus();
    }
  }, [code, numberOfInputs]);

  function onInputFocus(e, pos) {
    const currentInput = document.querySelector(`#index-${pos}`);

    setTimeout(() => {
      currentInput.setSelectionRange(0, 1);
    }, 0);

    setPosition(pos);
  }

  function setPosition(pos) {
    index = pos;
  }

  function handleKeyDown(e) {
    console.log(code, "code");

    if (e.keyCode === 8) {
      console.log("here in handle key down");
      if (index !== -1) {
        const newcode = removeCharacter(code, index);

        setCode(newcode);

        if (index > 0) {
          const nextInput = document.querySelector(`#index-${index - 1}`);
          nextInput.focus();
        }
      }
    }

    if (e.keyCode === 37) {
      if (index > 0) {
        const prevInput = document.querySelector(`#index-${index - 1}`);
        prevInput.focus();
      }
    }

    if (e.keyCode === 39) {
      if (index < numberOfInputs - 1) {
        const nextInput = document.querySelector(`#index-${index + 1}`);

        nextInput.focus();
      }
    }
  }

  function handleOnChange(e) {
    if (e.target.value.match(/^[0-9]+$/)) {
      if (index !== -1) {
        let char = e.target.value[0];

        if (e.target.value !== "") {
          if (code.length === 0) {
            setCode(char);
          } else if (code.length - 1 < index) {
            setCode(code + char);
          } else if (code.length - 1 >= index) {
            const newcode = setCharAt(code, index, char);

            setCode(newcode);

            if (index < numberOfInputs - 1) {
              const nextInput = document.querySelector(`#index-${index + 1}`);
              nextInput.focus();
            }
          }
        } else {
        }
      }
    }
  }

  function removeCharacter(str, index) {
    let subStr1 = str.substring(0, index);
    let subStr2 = str.substring(index + 1, str.length);
    return subStr1 + subStr2;
  }

  function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
  }

  function toggleOnclose() {
    setCode("");
    active();
  }

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
    } else {
      alert("not a number");
    }
  }

  function getInputsJSX() {
    const inputs = [];
    for (let i = 0; i < numberOfInputs; i++) {
      let input = (
        <input
          id={`index-${i}`}
          className="otp__input"
          onFocus={(e) => onInputFocus(e, i)}
          onChange={handleOnChange}
          onPaste={onPaste}
          value={code[i] ? code[i] : ""}
          onKeyDown={handleKeyDown}
        ></input>
      );

      inputs.push(input);
    }

    return inputs;
  }

  let inputsJSX = getInputsJSX();

  return (
    <div className="input-card">
      <div className="form-container">
        <button className="input-card__close" onClick={toggleOnclose}>
          <i className="fas fa-times"></i>
        </button>
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
