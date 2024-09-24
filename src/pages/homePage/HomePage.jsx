import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import Navbar from "../../components/navbar/Navbar";
import Post from "../../components/post/Post";
import "./homepage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef);
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No matching documents.");
          setPosts([]);
          setLoading(false);
          return;
        }

        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Posts Data:", postsData);

        const uids = [...new Set(postsData.map((post) => post.uid))];
        console.log("User UIDs:", uids);

        const usersData = {};
        const usersPromises = uids.map(async (uid) => {
          const userRef = doc(db, "Users", uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            usersData[uid] = userSnap.data();
          }
        });

        await Promise.all(usersPromises);
        setUsers(usersData);
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts and users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndUsers();
  }, [navigate]);

  const getUserPhoto = (user) => {
    if (user?.photo) {
      return user.photo;
    } else if (user?.fullName) {
      const initials = user.fullName.charAt(0).toUpperCase();
      return `https://via.placeholder.com/150?text=${initials}`;
    } else {
      return "https://via.placeholder.com/150?text=A"; // Default placeholder with 'A'
    }
  };

  return (
    <div className="home">
      <Navbar />
      <div className="content">
        <div className="post-contents">
          {loading ? (
            <p>Loading posts...</p>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Post
                key={post.id}
                postId={post.id}
                imageUrl={post.imageUrl}
                caption={post.caption || ""}
                userName={users[post.uid]?.fullName || "Anonymous"}
                userPhoto={getUserPhoto(users[post.uid])}
                initialLikes={post.likes || []}
                postOwnerUid={post.uid}
                createdAt={post.createdAt}
              />
            ))
          ) : (
            <p>No posts to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
