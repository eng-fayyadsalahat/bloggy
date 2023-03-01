import {useState, useContext} from "react";
import React from "react";
import {useNavigate} from "react-router-dom";
import {Context} from "../../context/Context";
import "./write.css";

export default function Write() {


    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [topic, setTopic] = useState("");
    const [file, setFile] = useState(null);
    const {user} = useContext(Context);

    const [id, setId] = useState();
    const navigate = useNavigate();

    console.log(user)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (file) {
            // handel file
            const data = new FormData();
            data.append("file", file);
            data.append("request_type", "write")
            try {
                await fetch("/upload", {
                    method: "POST", body: data,
                });
            } catch (e) {
                console.log(e)
            }
        } // end file

        const currentTime = new Date().toLocaleString();
        const newPost = {

            title: title, content: desc, topic: topic, time: currentTime, auther: user
        };
        try {
            let response = await fetch("/article/write", {
                method: "POST", headers: {
                    'Accept': 'application/json', 'Content-Type': 'application/json'
                }, body: JSON.stringify(newPost),
            }) // end fetch
                .then((result) => {
                    if (result.ok) {
                        return result.json();
                    } else {
                        navigate("/error", {state: {status: result.status, text: result.statusText}});
                    }
                })
            if (response["settings"] === false) {
                navigate("/settings");
            }
            const articleId = "article_id"
            setId(response[articleId]);
        } catch (err) {
            console.log(err)
        }


    };// handel submit
    setTimeout(() => {
        if (id) {
            navigate(`/`);
            navigate(`/article/${id}`);
        }

    }, 2000)


    return (<div className="write">
            {/*<!-- image file --> */}
            {file && (

                <img className="writeImg" src={URL.createObjectURL(file)} alt=""/>)}
            <form className="writeForm" onSubmit={handleSubmit}>


                <div className="writeFormGroup">
                    {/*<!-- files --> */}
                    <form encType="multipart/form-data">
                        <label htmlFor="fileInput">
                            <i className="writeIcon fas fa-plus"></i>
                        </label>
                        <input
                            type="file"
                            id="fileInput"
                            style={{display: "none"}}
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </form>
                </div>

                <div className="writeFormGroup">
                    <input
                        type="text"
                        placeholder="Title"
                        className="writeInput"
                        autoFocus={true}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>

                <div className="writeFormGroup">
          <textarea
              placeholder="Tell your story..."
              type="text"
              className="writeInput writeText"
              onChange={e => setDesc(e.target.value)}
          ></textarea>
                </div>

                <div className="writeFormGroup">
                    <input
                        type="text"
                        placeholder="Topic"
                        className="writeInput"
                        autoFocus={true}
                        onChange={e => setTopic(e.target.value)}
                    />
                </div>

                <button className="writeSubmit" type="submit">
                    Publish
                </button>

            </form>
        </div>);
}

