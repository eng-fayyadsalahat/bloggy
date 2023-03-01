import React from "react";


import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";

import {Context} from "../../context/Context";

import "./register.css";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const {dispatch} = useContext(Context);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(false);

        try {
            dispatch({type: "LOGOUT"});
            const response = await fetch("/signup", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                }),
            }) // end fetch
                .then(
                    data => data.json()
                )

            if (response["success"] === true) {
                setTimeout(() => {

                    navigate("/login");
                }, 1000)
            }else {
                alert(`${response["message"]}`);
            }

        } catch (err) {
            setError(true);
        }
    };
    return (
        <div className="register">
            <span className="registerTitle">Register</span>
            <form className="registerForm" onSubmit={handleSubmit}>
                <label>Username</label>
                <input
                    type="text"
                    className="registerInput"
                    placeholder="Enter your username..."
                    required = {true}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Email</label>
                <input
                    type="email"
                    className="registerInput"
                    placeholder="Enter your email..."
                    required = {true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password</label>
                <input
                    type="password"
                    className="registerInput"
                    placeholder="Enter your password..."
                    required = {true}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="registerButton" type="submit">
                    Register
                </button>
            </form>
            <button className="registerLoginButton">
                <a className="link" href="/login">
                    Login
                </a>
            </button>
            {error && <span style={{color: "red", marginTop: "10px"}}>Something went wrong!</span>}
        </div>
    );
}

