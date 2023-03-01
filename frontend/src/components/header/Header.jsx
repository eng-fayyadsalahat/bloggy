import React from "react";
import "./header.css";
import blogHeader from "./blogheader.jpg";


export default function Header() {


  return (
    <div className="header">
      <div className="headerTitles">
        <span className="headerTitleSm">React & Flask</span>
        <span className="headerTitleLg">Bloggy</span>
      </div>
      <img
        className="headerImg"
        src={blogHeader}
        alt=""
      />
    </div>
  );
}
