import { useState } from 'react';
import './App.scss';
import CryptoJS from 'crypto-js';

function App() {

  const [password, setPassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const storedHash = 'f2a8570f2515de6a58b8ad3b33341d9caec4740b3c65a235f0863909b21fddac';

  const handleSubmit = (event) => {
    event.preventDefault();

    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

    if (hashedPassword === storedHash) {
      setIsPasswordCorrect(true);
    } else {
      alert("Try hard pookie 🥺");
    }
  }

  if (isPasswordCorrect) {
    return (
      <div id="title">
        <span>Hi Pookie!</span>
        <span>Love you 👉🏻🖤👈🏻</span>
        <span id="signature">- cooper3301 🖋️</span>
      </div>
    );
  }

  return (
    <div className="password-container">
      <h2>Please enter the password (first name in lowercase): </h2>
      <form onSubmit={handleSubmit}>
        <input
          className="password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password 🫦"
        />
        <button type="submit">Roll the rollercoster</button>
      </form>
    </div>
  )
}

export default App;
