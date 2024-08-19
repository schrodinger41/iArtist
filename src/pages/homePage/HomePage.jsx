import React, { useEffect } from "react";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import "./homepage.css";
import Navbar from "../../components/navbar/Navbar";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
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
    </div>
  );
};

export default HomePage;
