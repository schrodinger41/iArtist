import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import Navbar from "../../components/navbar/Navbar";
import Post from "../../components/post/Post"; // Ensure this import matches your Post component
import Modal from "../../components/ModalPost/Modal"; // Import your Modal component
import EditProfile from "../../components/EditProfile/EditProfile";
import { FaHeart, FaComment } from "react-icons/fa"; // Add Font Awesome icons
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaSquareXTwitter, FaSquareInstagram, FaLinkedin } from "react-icons/fa6"; // Add LinkedIn icon
import { MdEmail } from "react-icons/md"; // Add Email icon
import { MdAttachEmail } from "react-icons/md";
import "./profilePage.css";

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null); // State for the selected post for the modal

  const currentUser = auth.currentUser;

  const [isEditing, setIsEditing] = useState(false); // State to manage the editing mode

  const toggleEditProfile = () => {
    setIsEditing(!isEditing); // Toggle the editing state
  };

  

  const totalLikes = posts.reduce(
    (acc, post) => acc + (post.likes?.length || 0),
    0
  );
  const totalComments = posts.reduce(
    (acc, post) => acc + (post.comments?.length || 0),
    0
  );
  const totalPosts = posts.length;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "Users", userId);
        const userSnap = await getDoc(userRef);
    
        if (userSnap.exists()) {
          const userData = userSnap.data();
          // Ensure uid is included in the user object
          setUser({ ...userData, uid: userId });
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

        const postsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const postData = doc.data();

            // Fetch comments for each post
            const commentsRef = collection(db, "posts", doc.id, "comments");
            const commentsSnapshot = await getDocs(commentsRef);
            const commentsData = commentsSnapshot.docs.map((commentDoc) =>
              commentDoc.data()
            );

            return {
              id: doc.id,
              ...postData,
              likes: postData.likes || [], // Ensure likes are initialized
              comments: commentsData // Add fetched comments to post data
            };
          })
        );

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
    console.log("Image clicked:", post);
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
        <div className="profile-data">
          {user ? (
            <>
              <img
                src={getUserPhoto(user)}
                alt="Profile"
                className="profile-photo"
              />

              <div className="column-1">
                <div className="column-2">
                  <div>
                    <h1 className="userName">
                      {user.fullName || "Unknown User"}
                    </h1>
                  </div>

                  <div>
                    {currentUser && currentUser.uid === userId ? (
                      <div>
                        <button className="edit-profile-button" onClick={toggleEditProfile}>
                          Edit Profile
                        </button>
                      </div>
                    ) : (
                      <div className="threedots">
                        <BsThreeDotsVertical />
                      </div>
                    )}
                  </div>
                </div>

                <div className="profile-stats">
                  <p>
                    <b>{totalPosts}</b> posts
                  </p>
                  <p>
                    <b>{totalLikes}</b> likes
                  </p>
                  <p>
                    <b>{totalComments}</b> comments
                  </p>
                </div>

                <div className="socials">
                  {user.email && (
                    <a href={`mailto:${user.email}`} target="_blank" rel="noopener noreferrer">
                      <MdAttachEmail className="social-icon" /> 
                    </a>
                  )}
                  {user.instagram && (
                    <a href={`${user.instagram}`} target="_blank" rel="noopener noreferrer">
                      <FaSquareInstagram className="social-icon" /> 
                    </a>
                  )}
                  {user.twitter && (
                    <a href={`${user.twitter}`} target="_blank" rel="noopener noreferrer">
                      <FaSquareXTwitter className="social-icon" /> 
                    </a>
                  )}
                  {user.linkedIn && (
                    <a href={user.linkedIn} target="_blank" rel="noopener noreferrer">
                      <FaLinkedin className="social-icon" /> 
                    </a>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p>No user data available</p>
          )}
        </div>
        <span className="divider"></span>

        {isEditing && (
          <EditProfile user={user} onClose={toggleEditProfile} />
        )}

        <div className="posts-section">
          {posts.length > 0 ? (
            <div className="post-grid">
              {posts.map((post) => (
                <div className="posts-image-container" key={post.id}>
                  <img
                    src={post.imageUrl}
                    alt={post.caption || ""}
                    className="posts-image"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick(post);
                    }}
                  />
                  <div className="overlay">
                    <div className="overlay-info">
                      <div className="likes-comments">
                        <div className="likes">
                          <FaHeart /> {post.likes ? post.likes.length : 0}
                        </div>
                        <div className="comments">
                          <FaComment />{" "}
                          {post.comments ? post.comments.length : 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
