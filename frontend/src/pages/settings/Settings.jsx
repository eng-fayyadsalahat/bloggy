import React from "react";


import Sidebar from "../../components/sidebar/Sidebar";
import {useContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Context} from "../../context/Context";
import user_prof from "./user.png"
import "./settings.css";

export default function Settings() {
    const [file, setFile] = useState(null);
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [country, setCountry] = useState("");
    const [success, setSuccess] = useState(false);
    const {user, dispatch} = useContext(Context);
    const navigate = useNavigate();
    const [userinfo, setUserInfo] = useState({})
    let user_info = async () => {
        try {
            const response = await fetch(`/users/${user}`, {
                method: "GET", headers: {
                    'Accept': 'application/json', 'Content-Type': 'application/json'
                },
            })// end fetch
                .then((result) => {
                    return result.json();
                })
            setUserInfo(response);
        } catch (error) {
            console.log("err")
        }
    }

    useEffect(() => {
        user_info();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({type: "UPDATE_START"});

        if (file) {
            const data = new FormData();
            data.append("request_type", "profile");
            data.append("file", file);
            // updatedUser.profilePic = filename;
            try {
                await fetch("/upload", {
                    method: "POST", body: data,
                });
            } catch (err) {
            }
        } // end file

        const updatedUser = {
            fullname, email, password, country, age
        };

        try {
            const res = await fetch(`/users/${user}/settings`, {
                method: 'POST', headers: {
                    'Accept': 'application/json', 'Content-Type': 'application/json'
                }, body: JSON.stringify(updatedUser)
            })
                .then(data => data.json())
            setSuccess(true);
            dispatch({type: "UPDATE_SUCCESS", payload: res["user"]});
        } catch (err) {
            dispatch({type: "UPDATE_FAILURE"});
        }
    }; // submit

    setTimeout(() => {
        if (success) {
            navigate(`/`);
        }

    }, 2000)


    return (<div className="settings">
        <div className="settingsWrapper">
            <div className="settingsTitle">
                <span className="settingsTitleUpdate">Update Your Account</span>

            </div>
            <form className="settingsForm" onSubmit={handleSubmit} enctype="multipart/form-data">
                <label>Profile Picture</label>
                <div className="settingsPP">
                    <img
                        src={file ? URL.createObjectURL(file) : user_prof}
                        alt=""
                    />
                    <label htmlFor="fileInput">
                        <i className="settingsPPIcon far fa-user-circle"></i>
                    </label>
                    <input
                        type="file"
                        id="fileInput"
                        style={{display: "none"}}
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>
                <span className="settingsSubTitle">Genral Information</span>
                <label>Full Name</label>
                <input
                    className="settingsPPInput"
                    type="text"
                    placeholder={userinfo.full_name || ""}
                    onChange={(e) => setFullname(e.target.value)}
                />
                <label>Email</label>
                <input
                    className="settingsPPInput"
                    type="email"
                    placeholder={userinfo.email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password</label>
                <input
                    className="settingsPPInput"
                    type="password"

                    onChange={(e) => setPassword(e.target.value)}
                />

                <span className="settingsSubTitle">Information</span>
                <label>Age</label>
                <input
                    className="settingsPPInput"
                    type="text"
                    placeholder={userinfo.age || ""}
                    onChange={(e) => setAge(e.target.value)}
                />
                <label>Country</label>
                <input
                    className="settingsPPInput"
                    type="text"
                    placeholder={userinfo.country || ""}
                    onChange={(e) => setCountry(e.target.value)}
                />

                <button className="settingsSubmitButton" type="submit">
                    Update
                </button>
                {success && (<span
                    style={{color: "green", textAlign: "center", marginTop: "20px"}}
                >
              Profile has been updated...
            </span>)}
            </form>
        </div>
        <Sidebar/>
    </div>);
}