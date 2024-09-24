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
        const userRef = doc(db, "Users", userId);
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

  if (loading) return <p>Loading...</p>;

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
      </div>
    </div>
  );
};

export default ProfilePage;
