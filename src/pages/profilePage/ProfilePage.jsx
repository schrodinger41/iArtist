import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import Navbar from "../../components/navbar/Navbar";
import "./profilePage.css";

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "Users", userId); // Updated collection name
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser(userSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <Navbar />
      {user ? (
        <>
          <img
            src={user.photo || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-photo"
          />
          <h1>{user.fullName || "Unknown User"}</h1>
          <p>{user.email || "No email provided"}</p>
          {/* Add more user details as needed */}
        </>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default ProfilePage;
