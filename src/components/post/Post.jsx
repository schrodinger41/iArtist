import React, { useState, useEffect } from "react";
import "./post.css";
import { FaHeart, FaComment, FaEllipsisV, FaEllipsisH } from "react-icons/fa"; // Import horizontal dots icon
import { auth, db } from "../../config/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
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
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [commentMenuOpen, setCommentMenuOpen] = useState({}); // Track comment menu state

  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (user && likes.includes(user.uid)) {
      setHasLiked(true);
    }
  }, [likes, user]);

  // Fetch comments from Firestore
  useEffect(() => {
    const commentsRef = collection(db, "posts", postId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
      setCommentCount(commentsData.length); // Set the comment count
    });

    return () => unsubscribe();
  }, [postId]);

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

  const handleCommentToggle = () => {
    setCommentsVisible(!commentsVisible);
  };

  const handleNewCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleNewCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const commentsRef = collection(db, "posts", postId, "comments");

    await addDoc(commentsRef, {
      commentText: newComment,
      userId: user.uid,
      userName: user.displayName || "Anonymous",
      userPhoto: user.photoURL || "",
      createdAt: new Date(),
    });

    setNewComment("");
  };

  const formattedDate = createdAt
    ? format(new Date(createdAt.toDate()), "MMM d, yyyy")
    : "Unknown Date";

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setCommentsVisible(false); // Close the modal
    }
  };

  const handleCloseModal = () => {
    setCommentsVisible(false);
  };

  // Toggle the comment menu for each comment
  const toggleCommentMenu = (commentId) => {
    setCommentMenuOpen((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  // Handle editing the comment
  const handleEditComment = (commentId, commentText) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, isEditing: true } : comment
      )
    );
  };

  // Handle deleting the comment
  const handleDeleteComment = async (commentId) => {
    const commentRef = doc(db, "posts", postId, "comments", commentId);
    await deleteDoc(commentRef);
  };

  // Handle saving the edited comment
  const handleSaveComment = async (commentId, newCommentText) => {
    const commentRef = doc(db, "posts", postId, "comments", commentId);
    await updateDoc(commentRef, { commentText: newCommentText });
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, isEditing: false } : comment
      )
    );
  };

  return (
    <div className="post-container">
      <div className="post-header">
      <img src={userPhoto} alt="User Profile" className="user-photo" onClick={handleViewProfile} style={{ cursor: 'pointer' }} />
        <div className="user-info">
        <p className="user-name" onClick={handleViewProfile} style={{ cursor: 'pointer' }}>
      {userName}
    </p>
          <p className="post-date">{formattedDate}</p>
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
        <div className="footer-icon" onClick={handleCommentToggle}>
          <FaComment />
          <span className="like">{commentCount}</span>
        </div>
      </div>

      {/* Modal for comments */}
      {commentsVisible && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content">
            <button className="close-modal-button" onClick={handleCloseModal}>
              &times;
            </button>
            <div className="comments-section">
              {comments.length > 0 ? (
                <div className="comments-container">
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <img
                        src={comment.userPhoto}
                        alt={comment.userName}
                        className="comment-user-photo"
                      />
                      <div className="comment-content">
                        <p className="comment-user-name">{comment.userName}</p>
                        {comment.isEditing ? (
                          <textarea
                            className="edit-box"
                            value={comment.commentText}
                            onChange={(e) =>
                              setComments((prevComments) =>
                                prevComments.map((c) =>
                                  c.id === comment.id
                                    ? { ...c, commentText: e.target.value }
                                    : c
                                )
                              )
                            }
                          />
                        ) : (
                          <p className="comment-text">{comment.commentText}</p>
                        )}
                        {user && user.uid === comment.userId && (
                          <div className="comment-menu">
                            <FaEllipsisH
                              onClick={() => toggleCommentMenu(comment.id)}
                              className="comment-menu-icon"
                            />
                            {commentMenuOpen[comment.id] && (
                              <div className="comment-menu-options">
                                {comment.isEditing ? (
                                  <button
                                    onClick={() =>
                                      handleSaveComment(
                                        comment.id,
                                        comment.commentText
                                      )
                                    }
                                  >
                                    Save
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleEditComment(
                                          comment.id,
                                          comment.commentText
                                        )
                                      }
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteComment(comment.id)
                                      }
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="comment-placeholder">No comments yet.</p>
              )}
              <div className="new-comment">
                <textarea
                  value={newComment}
                  onChange={handleNewCommentChange}
                  placeholder="Write a comment..."
                />
                <button onClick={handleNewCommentSubmit}>Comment</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
