import React, { useEffect } from "react";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import "./uploadPage.css";

import Navbar from "../../components/navbar/Navbar";
import UploadForm from "../../components/uploadForm/UploadForm";

const UploadPage = () => {
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
    <div className="upload_page">
      <Navbar />
      <UploadForm />
    </div>
  );
};

export default UploadPage;
