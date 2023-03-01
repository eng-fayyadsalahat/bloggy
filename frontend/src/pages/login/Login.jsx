import React from "react";

import {useContext, useState} from "react";
import {Context} from "../../context/Context";
import {useNavigate, useLocation} from "react-router-dom";
import "./login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const {dispatch, isFetching} = useContext(Context);
    const location = useLocation();

// fetch data from API
    async function loginUser(credentials) {
        return fetch("/login", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(credentials)
        })
            .then(data => data.json())
    }// end login user


    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({type: "LOGIN_START"});
        try {
            const response = await loginUser({
                email,
                password
            });

            dispatch({type: "LOGIN_SUCCESS", payload: response["user"]});

            if (response["success"] === true) {
                setTimeout(() => {
                    if (location.state !== null) {
                        navigate(location.state.from.pathname);
                    } else {
                        navigate("/");
                    }

                }, 2000)
            }
            else {
                alert(`${response["message"]}`);
            }

        } catch (err) {

            dispatch({type: "LOGIN_FAILURE"});
        }
    };

    return (
        <div className="login">
            <span className="loginTitle">Login</span>
            <form className="loginForm" onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="text"
                    className="loginInput"
                    placeholder="Enter your email..."
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password</label>
                <input
                    type="password"
                    className="loginInput"
                    placeholder="Enter your password..."
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}

                />
                <button className="loginButton" type="submit" disabled={isFetching}>
                    Login
                </button>
            </form>
            <button className="loginRegisterButton">
                <a className="link" href="/signup">
                    Register
                </a>
            </button>
        </div>
    );
}
