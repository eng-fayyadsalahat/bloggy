import React, {useEffect, useState} from 'react';
import {useContext} from 'react';
import Search from '../search/articleSearch';
import {Context} from "../../context/Context";
import "./topbar.css";
import user_prof from "./user.png"
export default function TopBar() {
    const {user, dispatch} = useContext(Context);
    const [image, setImage] = useState("");
    let user_info = async () => {
        try {
            await fetch(`/users/${user}`,
                {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                }
            )// end fetch
                .then(
                    (result) => {
                        return result.json();
                    }
                )
                .then((data) => {
                    setImage(data.image);

                })
            if (image === null){
                setImage(user_prof)
            }
        } catch (error) {
            setImage(user_prof);
        }
    }


    useEffect(
        () => {
            user_info();
        }, []);

    const handleLogout = () => {
        dispatch({type: "LOGOUT"});
    };
    return (
        <div className="top">
            <div className="topLeft">
                <Search/>
            </div>
            <div className="topCenter">
                <ul className="topList">
                    <li className="topListItem">
                        <a className="link" href="/">
                            HOME
                        </a>
                    </li>
                    <li className="topListItem">
                        <a className="link" href="/article/summery">
                            SUMMERY
                        </a>
                    </li>

                    <li className="topListItem">

                        <a className="link" href="/article/write">
                            WRITE
                        </a>
                    </li>
                    <li className="topListItem" onClick={handleLogout}>
                        {user && "LOGOUT"}
                    </li>
                </ul>
            </div>
            <div className="topRight">
                {user ? (
                    <a href="/settings">
                        {/*<!-- image --> */}
                        <img className="topImg"
                             src={image} alt="settings"/>
                    </a>
                ) : (
                    <ul className="topList">
                        <li className="topListItem">
                            <a className="link" href="/login">
                                LOGIN
                            </a>
                        </li>
                        <li className="topListItem">
                            <a className="link" href="/signup">
                                REGISTER
                            </a>
                        </li>
                    </ul>
                )}


            </div>
        </div>
    );
}

