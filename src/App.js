import "./App.css";
import OTP from "./components/otp";
import React from "react";

function App() {
  function toggleInputForm() {
    let form = document.querySelector(".input-card");
    form.classList.toggle("input-card--active");
    let blurred = document.querySelector(".blur");
    blurred.classList.toggle("blur--active");
  }

  return (
    <div className="App">
      <div className="panel">
        <div className="blur"></div>
        <button className="add-otp-btn" onClick={toggleInputForm}>
          Phone Verification
        </button>
        <OTP active={toggleInputForm} />
      </div>
    </div>
  );
}

export default App;
