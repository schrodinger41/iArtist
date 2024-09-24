import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import Navbar from "../../components/navbar/Navbar";
import Post from "../../components/post/Post"; // Ensure this import matches your Post component
import Modal from "../../components/ModalPost/Modal"; // Import your Modal component
import "./profilePage.css";

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null); // State for the selected post for the modal

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser(userSnap.data());
          // Fetch user posts after setting the user data
          await fetchUserPosts(userId);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPosts = async (userId) => {
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("uid", "==", userId)); // Fetch posts by user ID
        const querySnapshot = await getDocs(q);

        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const getUserPhoto = (user) => {
    if (user?.photo) {
      return user.photo;
    } else if (user?.fullName) {
      const initials = user.fullName.charAt(0).toUpperCase();
      return `https://via.placeholder.com/150?text=${initials}`;
    } else {
      return "https://via.placeholder.com/150?text=U"; // Default placeholder with 'U' for "Unknown"
    }
  };

  const handleImageClick = (post) => {
    setSelectedPost(post); // Set the selected post to display in the modal
  };

  const closeModal = () => {
    setSelectedPost(null); // Close the modal
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-contents">
        {user ? (
          <>
            <img
              src={getUserPhoto(user)}
              alt="Profile"
              className="profile-photo"
            />
            <h1 className="userName">{user.fullName || "Unknown User"}</h1>
            <p className="userEmail">{user.email || "No email provided"}</p>
          </>
        ) : (
          <p>No user data available</p>
        )}
        <span className="divider"></span>
        <div className="posts-section">
  {posts.length > 0 ? (
    <div className="post-grid">
      {posts.map((post) => (
        <img
          key={post.id}
          src={post.imageUrl}
          alt={post.caption || ""}
          className="posts-image"
          onClick={() => handleImageClick(post)} // Pass the whole post to the click handler
        />
      ))}
    </div>
  ) : (
    <p>No posts to display.</p>
  )}
</div>

        {selectedPost && (
          <Modal onClose={closeModal}>
            <Post
              postId={selectedPost.id}
              imageUrl={selectedPost.imageUrl}
              caption={selectedPost.caption || ""}
              userName={user?.fullName || "Anonymous"}
              userPhoto={getUserPhoto(user)}
              initialLikes={selectedPost.likes || []}
              postOwnerUid={selectedPost.uid}
              createdAt={selectedPost.createdAt}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
