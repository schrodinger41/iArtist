import React, { useState, useEffect } from "react";
import "./post.css";
import { FaHeart, FaComment, FaEllipsisV } from "react-icons/fa";
import { auth, db } from "../../config/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Post = ({
  postId,
  imageUrl,
  userName,
  userPhoto,
  caption: initialCaption,
  initialLikes,
  postOwnerUid,
  createdAt,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(initialCaption);
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (user && likes.includes(user.uid)) {
      setHasLiked(true);
    }
  }, [likes, user, postOwnerUid]);

  const handleLike = async () => {
    if (!user) return;

    const postRef = doc(db, "posts", postId);
    if (hasLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(user.uid),
      });
      setLikes(likes.filter((uid) => uid !== user.uid));
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user.uid),
      });
      setLikes([...likes, user.uid]);
    }
    setHasLiked(!hasLiked);
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleSave = async () => {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { caption });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post caption:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const postRef = doc(db, "posts", postId);
      await deleteDoc(postRef);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleViewProfile = () => {
    navigate(`/profile/${postOwnerUid}`);
  };

  const formattedDate = createdAt
    ? format(new Date(createdAt.toDate()), "MMM d, yyyy")
    : "Unknown Date";

  return (
    <div className="post-container">
      <div className="post-header">
        <img src={userPhoto} alt="User Profile" className="user-photo" />
        <div className="user-info">
          <p className="user-name">{userName}</p>
          <p className="post-date">{formattedDate}</p>{" "}
        </div>
        <div className="post-menu">
          <FaEllipsisV
            onClick={handleMenuToggle}
            className="more-options-icon"
          />
          {menuOpen && (
            <div className="menu-options">
              <button onClick={handleViewProfile}>View Profile</button>
              {user && user.uid === postOwnerUid && (
                <>
                  <button onClick={handleEdit}>Edit</button>
                  <button onClick={handleDelete}>Delete</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="post-caption">
        {isEditing ? (
          <div>
            <textarea value={caption} onChange={handleCaptionChange} rows="3" />
            <button onClick={handleSave}>Save</button>
          </div>
        ) : (
          <p>{caption}</p>
        )}
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
        <div className="footer-icon comment">
          <FaComment />
        </div>
      </div>
    </div>
  );
};

export default Post;
