import "./App.css";
import OTP from "./components/otp";
import React, { useState } from "react";

function App() {
  const [error, setError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [value, setValue] = useState("");
  const [numberOfInputs, setNumberOfInputs] = useState(4);

  return (
    <div className="App">
      <div className="panel">
        <OTP
          hasErrored={error}
          value={value}
          setValue={setValue}
          isDisabled={isDisabled}
          resendDuration={60}
          numberOfInputs={numberOfInputs}
        />
      </div>
      <div className="App__test">
        <div className="App__test__input">
          <input
            type="checkbox"
            value={isDisabled}
            onChange={() => setIsDisabled(!isDisabled)}
          />
          &nbsp; isDisabled
        </div>
        <div className="App__test__input">
          <input onChange={() => setError(!error)} type="checkbox" />
          &nbsp; hasErrors
        </div>
        <div className="App__test__input">
          <input
            style={{ width: "35px" }}
            value={numberOfInputs}
            onChange={(e) => setNumberOfInputs(Number(e.target.value))}
            min={2}
            max={40}
            type="number"
          />
          &nbsp; Number Of Inputs
        </div>
      </div>
    </div>
  );
}

export default App;
