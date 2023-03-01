import React from "react";
import "./summeryPost.css";

export default function SummeryPost({article}) {
  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        
          <img src={article.image} alt="post summery" className="singlePostImg" />
          <span className="postCat">{article.topic}</span>
          <h1 className="singlePostTitle">
            <a href={article.article_id} className="link">

              {article.title}
            </a>
            
          </h1>
          
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
       
        <p className="singlePostDesc">{article.content}</p>
      </div>
    </div>
  );
}
