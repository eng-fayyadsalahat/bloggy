import React from "react";

import SummeryPost from "../summerypost/summeryPost";

import "./summeryPosts.css";


export default function SummeryPosts({posts}) {

    return (
        <div className="summery">
            {posts.map((p) => (
                <SummeryPost article={p}/>
            ))}
        </div>

    );
}
