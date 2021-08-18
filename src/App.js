import "./App.css";
import OTP from "./components/otp";
import React, {useState} from "react";

function App() {
  const [active, setActive] = useState(false);

  function toggleInputForm() {
    setActive(true);  
    let form = document.querySelector(
      ".input-card"
    );
    console.log(form);
    form.classList.toggle("input-card--active");
    let blurred = document.querySelector(".blur");
    blurred.classList.toggle("blur--active");
  }
  return (
    <div className="App">
    <div className="panel">
    <div className="blur"></div>
    <button className= "add-otp-btn" onClick= {toggleInputForm}>Phone Verification</button>
    { active &&
    <div className= "input-card">
      <div className= "form-container">
      <button
        className="input-card__close"
        onClick={toggleInputForm}
      >
        <i className="fas fa-times"></i>
      </button>
        <OTP />
      </div>
    </div>
    }
    </div>
    </div>
  );
}

export default App;
