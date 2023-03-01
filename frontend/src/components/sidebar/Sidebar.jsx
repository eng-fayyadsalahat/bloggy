import React from "react";
import Topics from "./topicsSidebar";
import media from "./mediabag.png"
import "./sidebar.css";
import {FaFacebookSquare, FaTwitterSquare, FaInstagramSquare, FaYoutubeSquare} from 'react-icons/fa';
export default function Sidebar() {

  return (
    <div className="sidebar">
      <div className="sidebarItem">
        <span className="sidebarTitle">ABOUT ME</span>
        <img
          src= {media}
          alt="media bag"
        ></img>
        <p>
          Bloggy A platform that hosts articles on various topics,
            It belongs to the Media Bag, which is a media company specialized in the field of electronic media.
        </p>
      </div>
      <div className="sidebarItem">
        <span className="sidebarTitle">CATEGORIES</span>
        <ul className="sidebarList">
        <Topics/>
        </ul>
      </div>
      <div className="sidebarItem">
        <span className="sidebarTitle">FOLLOW US</span>
        <div className="sidebarSocial">
            <FaFacebookSquare className="sidebarIcon" />
            <FaTwitterSquare className="sidebarIcon" />
            <FaInstagramSquare className="sidebarIcon" />
            <FaYoutubeSquare className="sidebarIcon" />
        </div>
      </div>
    </div>
  );
}

