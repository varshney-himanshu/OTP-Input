import "./App.css";
import OTP from "./components/otp";
import React, { useEffect, useState } from "react";

function App() {
  const [error, setError] = useState(false);
  useEffect(() => {
    // setTimeout(() => {
    //   setError(true);
    // }, 10000);
    setError(false);
  }, []);

  return (
    <div className="App">
      <div className="panel">
        <OTP hasErrored={error} resendDuration={60} />
      </div>
    </div>
  );
}

export default App;
