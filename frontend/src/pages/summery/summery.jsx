import React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import SummeryPosts from "../../components/summeryPosts/summeryPosts";

import Loading from "../lazy_loading/loading";

import "./summery.css";


export default function Summery() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    let get_article = () => {
        return new Promise((resolve, reject) => (fetch("/article/summery",
                {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                }
            )// end fetch
                .then((result) => {
                    if (result.ok) {
                        return result.json();
                    } else {
                        navigate("/error", {state: {status: result.status, text: result.statusText}});
                    }
                })
                .then(data => {
                    setPosts(data["articles"]);
                    setIsLoading(false);
                    return resolve(data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    return reject(error)
                })
        ))
    } // end of get article function

    useEffect(() => {

        get_article()
    }, []);

    if (isLoading) {
        return (<Loading/>);
    } else {
        return (
            <div className="summery">
                <SummeryPosts posts={posts}/>
            </div>
        );
    }
}


