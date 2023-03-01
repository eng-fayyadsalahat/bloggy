import React from "react";
import blog from "./bloggy.png";
import "./load.css";
function Loading(){
    return(
        <div className="load">
            <img src={blog} className="image" alt="Bloogy"/>
        </div>
       
  )}

export default Loading;


