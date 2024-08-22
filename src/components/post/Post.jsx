import React, { useState, useEffect } from "react";
import "./post.css";
import { FaHeart, FaComment, FaShare } from "react-icons/fa";
import { auth, db } from "../../config/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const Post = ({
  postId,
  imageUrl,
  userName,
  userPhoto,
  caption,
  initialLikes,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (user && likes.includes(user.uid)) {
      setHasLiked(true);
    }
  }, [likes, user]);

  const handleLike = async () => {
    if (!user) return;

    const postRef = doc(db, "posts", postId);
    if (hasLiked) {
      // Unlike the post
      await updateDoc(postRef, {
        likes: arrayRemove(user.uid),
      });
      setLikes(likes.filter((uid) => uid !== user.uid));
    } else {
      // Like the post
      await updateDoc(postRef, {
        likes: arrayUnion(user.uid),
      });
      setLikes([...likes, user.uid]);
    }
    setHasLiked(!hasLiked);
  };

  return (
    <div className="post-container">
      <div className="post-header">
        <img src={userPhoto} alt="User Profile" className="user-photo" />
        <p className="user-name">{userName}</p>
      </div>
      <div className="post-caption">
        <p>{caption}</p>
      </div>
      <div className="post-image">
        <img src={imageUrl} alt="Uploaded content" />
      </div>
      <div className="post-footer">
        <div className="footer-icon" onClick={handleLike}>
          <FaHeart
            color={hasLiked ? "var(--accent-color)" : "var(--text-color)"}
          />
          <span className={`like ${hasLiked ? "liked" : ""}`}>
            {likes.length}
          </span>
        </div>
        <div className="footer-icon">
          <FaComment />
        </div>
      </div>
    </div>
  );
};

export default Post;
