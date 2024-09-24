import React, { useState, useEffect } from "react";
import { storage, db, auth } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaImages } from "react-icons/fa6";
import "./uploadForm.css";

const UploadForm = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(255); // To track remaining characters
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        return;
      }
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        console.log("User data:", userSnap.data());
        setUserData(userSnap.data());
      } else {
        console.log("No user data found.");
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCaptionChange = (e) => {
    const input = e.target.value;
    if (input.length <= 255) {
      setCaption(input);
      setCharCount(255 - input.length); // Update remaining characters
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    setError("");
    if (!image || !caption) {
      setError("Please upload an image and enter a caption.");
      setLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        return;
      }

      const storageRef = ref(storage, `images/${user.uid}/${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);

      const postRef = collection(db, "posts");
      await addDoc(postRef, {
        uid: user.uid,
        imageUrl: imageUrl,
        caption: caption,
        createdAt: new Date(), // Saves the current timestamp
      });

      setImage(null);
      setCaption("");
      setImagePreview(null);
      setCharCount(255); // Reset character count
      setLoading(false);
      window.location.href = "/";
    } catch (err) {
      setError("Failed to upload image.");
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-info">
        <div className="user-and-upload">
          {userData ? (
            <div className="user-info">
              <img
                src={userData.photo || "https://via.placeholder.com/150"}
                alt="User Profile"
                className="user-photo"
              />
              <div className="user-details">
                <p>{userData.fullName || "Anonymous"}</p>
              </div>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}

          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

        <textarea
          placeholder="Enter a caption for your image (max 255 characters)..."
          value={caption}
          onChange={handleCaptionChange}
        ></textarea>

        {error && <p className="error">{error}</p>}
      </div>

      <div className="upload-img">
        {!imagePreview ? (
          <div className="icon-container">
            <input
              type="file"
              accept="image/*"
              id="file-input"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <label htmlFor="file-input">
              <FaImages className="plus-icon" />
            </label>
          </div>
        ) : (
          <div className="image-preview">
            <img src={imagePreview} alt="Selected Image" />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
