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
  const [users, setUsers] = useState({}); // Store user data here
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        // Fetch all posts
        const postsRef = collection(db, "posts");
        const q = query(postsRef);
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No matching documents."); // Debugging: No posts found
          setPosts([]);
          setLoading(false);
          return;
        }

        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Posts Data:", postsData); // Debugging: Log posts data

        // Collect unique UIDs from posts
        const uids = [...new Set(postsData.map((post) => post.uid))];
        console.log("User UIDs:", uids); // Debugging: Log UIDs

        // Fetch user data for all UIDs
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

        // Set posts data
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts and users:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchPostsAndUsers();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div>
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
                userPhoto={
                  users[post.uid]?.photo || "https://via.placeholder.com/150"
                }
                initialLikes={post.likes || []} // Pass the likes array
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
