import React from "react";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function Topics() {

    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    let getTopics = () => {
        return new Promise((resolve, reject) => (fetch("/topics",
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
                    setTopics(data["topics"]);
                    setIsLoading(false);
                    return resolve(data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    return reject(error)
                })
        ))
    } // end of get topics function


    useEffect(() => {
        getTopics();
    }, []);


    if (isLoading) {
        return (
            <li></li>
        );
    } else {
        return (
            topics.map((c, index) => (
                <li className="sidebarListItem" key={index}>{c}</li>
            ))
        );
    }

}


