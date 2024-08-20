import React, { useState, useEffect } from "react";
import { storage, db, auth } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./uploadForm.css";

const UploadForm = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        console.log("User data:", userSnap.data()); // Debugging line
        setUserData(userSnap.data());
      } else {
        console.log("No user data found."); // Debugging line
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
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
        navigate("/login");
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
        createdAt: new Date(),
      });

      setImage(null);
      setCaption("");
      setImagePreview(null); // Clear the preview
      setLoading(false);
      alert("Image uploaded successfully!");
    } catch (err) {
      setError("Failed to upload image.");
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-left">
        {!imagePreview ? (
          <button className="select-image-btn">
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </button>
        ) : (
          <div className="image-preview">
            <img src={imagePreview} alt="Selected Image" />
          </div>
        )}
      </div>

      <div className="upload-right">
        <div className="user-and-upload">
          {userData ? (
            <div className="user-info">
              <img
                src={userData.photo || "https://via.placeholder.com/150"} // Use a test URL if needed
                alt="User Profile"
                className="user-photo"
              />
              <div className="user-details">
                <p>{userData.fullName || "Anonymous"}</p>{" "}
                {/* Fallback if fullName is not available */}
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
          placeholder="Enter a caption for your image..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        ></textarea>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default UploadForm;
