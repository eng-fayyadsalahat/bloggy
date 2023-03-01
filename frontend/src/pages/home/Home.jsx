import {useEffect, useState, useContext} from "react";
import React from "react";
import {Context} from "../../context/Context";
import Header from "../../components/header/Header";
import {useNavigate} from "react-router-dom";
import "./home.css";

const Posts = React.lazy(() => import( "../../components/posts/Posts"));
const Sidebar = React.lazy(() => import( "../../components/sidebar/Sidebar"));


export default function Home() {

    const {user} = useContext(Context);
    const navigate = useNavigate();
    let user_info = async () => {
        try {
            await fetch("/user", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: user,

                }),
            }); // end fetch


        } catch (err) {
            console.log(err)
        }
    }

    useEffect(
        () => {
            user_info();
        }, []);


    const [posts, setPosts] = useState([]);

    useEffect(() => {
        let get_article = async () => {
            try {
                await fetch("/article",
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
                    .then((article) => {
                        return article["articles"];
                    })
                    .then((articles) => {
                        setPosts(articles);
                    })
                //return data;
            } catch (error) {
                console.log("error:", error)
            }
        };
        get_article();
    }, []);

    let id;
    function callSetinterval(){
        id= setInterval( () =>{
            window.location.reload();
        },1000)
    }
    function callClearinterval(){
        clearInterval(id);
    }

    callSetinterval();
    callClearinterval();

    return (
        <>
            <Header/>
            <div className="home">
                <Posts posts={posts}/>
                <Sidebar/>
            </div>

        </>
    );


}
