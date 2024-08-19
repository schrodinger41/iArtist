import React from "react";
import { auth, googleProvider, db } from "../../config/firebase";
import { signOut } from "firebase/auth";
import "./homepage.css";
const logout = async () => {
  try {
    await signOut(auth);
    window.location.href = "/login";
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
const HomePage = () => {
  return (
    <button className="button" type="button" onClick={logout}>
      log out
    </button>
  );
};

export default HomePage;
