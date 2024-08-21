import React from "react";
import "./post.css";

const Post = ({ imageUrl, userName, userPhoto }) => {
  return (
    <div className="post">
      <div className="post-header">
        <img src={userPhoto} alt="User Profile" className="user-photo" />
        <p className="user-name">{userName}</p>
      </div>
      <div className="post-image">
        <img src={imageUrl} alt="Uploaded content" />
      </div>
    </div>
  );
};

export default Post;
