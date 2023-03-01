import React from "react";
import {useLocation} from "react-router-dom";
import "./error.css"
export default function Error() {
    const location = useLocation();
    return (
        <div className="content-section">
            <h1>{location.state.status}</h1>
            <p>{location.state.text}</p>
        </div>
    );

}