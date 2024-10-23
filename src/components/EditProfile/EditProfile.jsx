import React, { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db, auth, storage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase storage for image uploads
import { FaSquareXTwitter, FaSquareInstagram } from "react-icons/fa6";
import { MdEmail, MdPerson } from "react-icons/md";
import "./editprofile.css";
import { FaCamera } from "react-icons/fa"; // Add this import for the camera icon

const EditProfile = ({ user, onClose }) => {
  if (!user || !user.uid) {
    console.error("User object is not valid or missing 'uid'.");
    return <p>Error: User not found.</p>;
  }

  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    photo: user.photo || "",
    email: user.email || "",
    linkedIn: user.linkedIn || "",
    instagram: user.instagram || "",
    twitter: user.twitter || "",
    facebook: user.facebook || "",
  });

  const [newPhoto, setNewPhoto] = useState(null); // For storing the new profile picture file
  const [imagePreview, setImagePreview] = useState(user.photo || ""); // Preview the selected image
  const [uploading, setUploading] = useState(false); // Uploading state
  const [error, setError] = useState(""); // Error handling

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file change for profile picture with image preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
      setImagePreview(URL.createObjectURL(file)); // Set preview for the selected image
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    try {
      const userRef = doc(db, "Users", user.uid); // Reference to the user document
      let updatedData = { ...formData };

      // If a new profile picture is selected, upload it to Firebase Storage
      if (newPhoto) {
        const photoRef = ref(
          storage,
          `profilePictures/${user.uid}/${newPhoto.name}`
        );
        await uploadBytes(photoRef, newPhoto); // Upload new photo
        const photoURL = await getDownloadURL(photoRef); // Get the photo URL
        updatedData.photo = photoURL; // Update the photo URL in the formData
      }

      // Update the user document in Firestore with the new data
      await updateDoc(userRef, updatedData);
      alert("Profile updated successfully!");
      onClose(); // Close the edit profile modal after submission
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    }

    setUploading(false);
  };

  return (
    <div className="modalpost-overlay">
      <div className="edit-profile">
        <form onSubmit={handleSubmit} className="editprofile-form">
          <p>Edit Profile</p>
          <div className="input-container">
            <input
              className="upload-profile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Image preview section */}
          {imagePreview && (
            <div className="image-previews">
              <img src={imagePreview} alt="Profile Preview" />
              <label
                className="camera-icon"
                htmlFor="file-input"
                tooltip="Change profile"
              >
                <FaCamera />
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          )}

          <p>Name</p>
          <div className="input-container">
            <MdPerson className="input-icon" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="text-input"
            />
          </div>

          {uploading && <p>Uploading...</p>}
          {error && <p className="error">{error}</p>}

          <span className="contacts">Contacts</span>

          <div className="input-container">
            <MdEmail className="input-icon" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="email-input"
            />
          </div>

          <div className="input-container">
            <FaSquareInstagram className="input-icon" />
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="Instagram"
              className="email-input"
            />
          </div>

          <div className="input-container">
            <FaSquareXTwitter className="input-icon" />
            <input
              type="text"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="Twitter"
              className="email-input"
            />
          </div>

          <button className="secondary-btn" type="submit" disabled={uploading}>
            {uploading ? "Saving..." : "Save Changes"}
          </button>
          <button className="secondary-btn" type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
