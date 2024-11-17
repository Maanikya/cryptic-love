import React, { useState } from "react";
import CryptoJS from "crypto-js";
import "./App.scss";

const storedHash = process.env.REACT_APP_USER_HASH;

const App = () => {
    const [transitioning, setTransitioning] = useState(false);
    const [password, setPassword] = useState("");
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const hashedPassword = CryptoJS.SHA256(password).toString(
            CryptoJS.enc.Hex
        );

        if (hashedPassword === storedHash) {
            setTransitioning(true);
            setTimeout(() => {
                setIsPasswordCorrect(true);
            }, 1000);
        } else {
            alert("Try harder pookie 🥺");
        }
    };

    if (isPasswordCorrect) {
        return (
            <>
                <div className="container">
                    <span className="text1">Hi `Pookie`</span>
                    <span className="text2">Love You</span>
                </div>
                <div className="title3">
                    <h3>
                        -<strong>M K L N X</strong>
                    </h3>
                </div>
            </>
        );
    }

    return (
        <div className="main-div">
            <div
                className={`password-container ${
                    transitioning ? "transitioning" : ""
                }`}
            >
                <h2>
                    Please enter the password (your first name in lowercase):{" "}
                </h2>
                <form onSubmit={handleSubmit} className="form">
                    <input
                        className="password-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password 🫦"
                    />
                    <button className="button" onSubmit={handleSubmit}>
                        Fooking Send it!
                    </button>
                </form>
            </div>
        </div>
    );
};

export default App;
