import React, { useState, useRef, useEffect } from "react";
import "./style.css";

let index = 0;

export default function OTP(props) {
  const ref = useRef(null);
  const [values, setValues] = useState({
    _0: "",
    _1: "",
    _2: "",
    _3: "",
    _4: "",
    _5: "",
  });

  function setPosition(pos) {
    index = pos;
  }

  function handleKeyDown(e) {
    if (e.keyCode === 8) {
      if (index !== -1) {
        if (index > 0) {
          const currentInput = document.querySelector(`#index-${index}`);

          if (currentInput.value.length === 0) {
            const prevInput = document.querySelector(`#index-${index - 1}`);
            prevInput.focus();
          }
        }
      }
    }

    if (e.keyCode === 37) {
      if (index > 0) {
        const prevInput = document.querySelector(`#index-${index - 1}`);
        prevInput.focus();
        setTimeout(function () {
          prevInput.setSelectionRange(1, 1);
        }, 0);
      }
    }

    if (e.keyCode === 39) {
      if (index < 5) {
        const currentInput = document.querySelector(`#index-${index}`);

        const prevInput = document.querySelector(`#index-${index + 1}`);

        if (currentInput.selectionStart === 1 || currentInput.value === "") {
          prevInput.focus();
          setTimeout(function () {
            prevInput.setSelectionRange(1, 1);
          }, 0);
        }
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setPosition(-1);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  function handleOnChange(e) {
    if (e.target.value.match(/^[0-9]+$/)) {
      if (index !== -1) {
        const currentInput = document.querySelector(`#index-${index}`);

        if (index < 5) {
          let secondChar = e.target.value[1];
          let firstChar = e.target.value[0];

          setValues({ ...values, [`_${index}`]: firstChar });

          if (currentInput.selectionStart === 2) {
            if (secondChar) {
              const nextInput = document.querySelector(`#index-${index + 1}`);

              setValues({ ...values, [`_${index + 1}`]: secondChar });
              nextInput.focus();
            }
          }
        } else {
          setValues({ ...values, [`_${index}`]: e.target.value[0] });
        }
      }
    } else if (e.target.value === "") {
      setValues({ ...values, [`_${index}`]: "" });
    }
  }

  function toggleOnclose() {
    setValues({
      _0: "",
      _1: "",
      _2: "",
      _3: "",
      _4: "",
      _5: "",
    });
    props.active();
  }

  function onPaste(e) {
    var clipboardData, pastedData;

    e.stopPropagation();
    e.preventDefault();

    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData("Text");
    pastedData = pastedData.trim();
    if (pastedData.match(/^[0-9]+$/)) {
      let counter = 0;
      let temp = {};
      for (let i = index; i < 6; i++) {
        temp[`_${i}`] = pastedData[counter];
        counter++;
      }

      setValues({ ...values, ...temp });
    } else {
      alert("not a number");
    }
  }

  return (
    <div className="input-card">
      <div className="form-container">
        <button className="input-card__close" onClick={toggleOnclose}>
          <i className="fas fa-times"></i>
        </button>
        <div className="otp">
          <div className="otp__title"> Phone Verification</div>
          <div className="otp__line"></div>
          <div className="otp__content">
            Enter the OTP you received on 89206-6XXXX
          </div>
          <div ref={ref}>
            <input
              id="index-0"
              className="otp__input"
              onFocus={() => setPosition(0)}
              onChange={handleOnChange}
              value={values._0}
              onPaste={onPaste}
            ></input>
            <input
              id="index-1"
              className="otp__input"
              onFocus={() => setPosition(1)}
              onChange={handleOnChange}
              onPaste={onPaste}
              value={values._1}
            ></input>
            <input
              id="index-2"
              className="otp__input"
              onFocus={() => setPosition(2)}
              onChange={handleOnChange}
              onPaste={onPaste}
              value={values._2}
            ></input>
            <input
              id="index-3"
              className="otp__input"
              onFocus={() => setPosition(3)}
              onChange={handleOnChange}
              onPaste={onPaste}
              value={values._3}
            ></input>
            <input
              id="index-4"
              className="otp__input"
              onFocus={() => setPosition(4)}
              onChange={handleOnChange}
              onPaste={onPaste}
              value={values._4}
            ></input>
            <input
              id="index-5"
              className="otp__input"
              onFocus={() => setPosition(5)}
              onChange={handleOnChange}
              onPaste={onPaste}
              value={values._5}
            ></input>
          </div>
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
