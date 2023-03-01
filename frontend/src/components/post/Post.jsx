import React from "react";

import "./post.css";

export default function Post({ post }, {index}) {
  
  return (
    <div className="post" key = {index}>
      {/*<!--image--> */ }
      <img className="postImg" src={post.image} 
      alt="post" />
      <div className="postInfo">
        <div className="postCats">
        <span className="postCat">{post.topic}</span>
        </div>
        <a href={`/article/${post.article_id}`} className="link">
          <span className="postTitle">{post.title}</span>
        </a>
        <hr />
        <span className="postDate">
          {post.time}
        </span>
      </div>
      <p className="postDesc">{post.content}</p>
    </div>
  );
}

/*

 {post.topic.map((c) => (
            <span className="postCat">{c.name}</span>
          ))}


  {post.photo && <img className="postImg" src={PF + post.photo} alt="" />}

  {"new Date(post.createdAt).toDateString()"}


<image className="postImg" src={post.image} 
      alt="image" ></image>

//const PF = "http://localhost:5000/static/images/";
*/