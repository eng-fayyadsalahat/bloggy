import {useContext, useEffect, useState} from "react";
import React from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Context} from "../../context/Context";
import {FaTrashAlt, FaPenSquare} from 'react-icons/fa';
import "./singlePost.css";

export default function SinglePost() {
    const navigate = useNavigate();
    const {user} = useContext(Context);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [updateMode, setUpdateMode] = useState(false);
    let {id} = useParams();
    let [article, setArtical] = useState({});

    let get_article = async () => {
        try {
            await fetch(`/article/${id}`,
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
                        if (result.ok) {
                            return result.json();
                        } else {
                            navigate("/error", {state: {status: result.status, text: result.statusText}});
                        }


                    }
                )
                .then((data) => {
                    article = data;
                    setArtical(article);
                })
        } catch (error) {
            console.log("error:", error)
        }

    };
    useEffect(
        () => {
            get_article();

        }, []);


    const handleDelete = async () => {
        try {
            await fetch(`/article/${id}/delete`,
                {
                    method: "DELETE",
                })
            navigate("/")
        } catch (err) {
        }
    };

    const handleUpdate = async () => {

        try {
            const response = await fetch(`/article/${id}/update`,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: title,
                        content: desc,
                    })
                }).then((result) => {
                    if (result.ok) {
                        return result.json();
                    } else {
                        navigate("/error", {state: {status: result.status, text: result.statusText}});
                    }
                }
            )

            if (response["success"] === true) {
                navigate("/")
                navigate(`/article/${id}`)
                setUpdateMode(false)
            }

        } catch (error) {
            console.log(error)
        }
    };


    return (
        <div className="singlePost">
            <div className="singlePostWrapper">
                {updateMode ? (<img src={article.image} alt="Single post " className="singlePostImg"/>) :
                    <img src={article.image} alt="Single post " className="singlePostImg"/>
                }

                {updateMode ? (
                    <input
                        type="text"
                        value={title}
                        className="singlePostTitleInput"
                        autoFocus
                        onChange={(e) => setTitle(e.target.value)}
                    />
                ) : (
                    <h1 className="singlePostTitle">
                        {article.title}
                        {article.username === user && (
                            <div className="singlePostEdit">
                                <FaPenSquare className="singlePostIcon" onClick={() => setUpdateMode(true)}/>
                                <FaTrashAlt className="singlePostIcon" onClick={handleDelete}/>

                            </div>
                        )}
                    </h1>
                )}
                <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:
            <a href={`/?user=${article.auther}`} className="link">
              <b> {article.auther}</b>
            </a>
          </span>
                    <span className="singlePostDate">
            {article.time}
          </span>
                </div>
                {updateMode ? (
                    <textarea
                        className="singlePostDescInput"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    />
                ) : (
                    <p className="singlePostDesc">{article.content}</p>
                )}
                {updateMode && (
                    <button className="singlePostButton"
                            onClick={handleUpdate}>
                        Update
                    </button>
                )}
            </div>
        </div>
    );
}

