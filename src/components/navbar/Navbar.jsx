import React, { useState, useEffect } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import { auth, db } from "../../config/firebase";
import { signOut } from "firebase/auth";
import Icon from "../../images/icon.png";
import { FiPlusCircle } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";
import Cookies from "universal-cookie";
import UploadForm from "../uploadForm/UploadForm";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

const cookies = new Cookies();

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(
    cookies.get("auth-token") ? true : false
  );
  const [userUid, setUserUid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuth(cookies.get("auth-token") ? true : false);

    const storedUid = localStorage.getItem("userUid"); // Get the userUid from localStorage
    if (storedUid) {
      setUserUid(storedUid);
      console.log("User UID:", storedUid);
    } else {
      console.log("No user UID in localStorage");
    }
  }, [isAuth]);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      cookies.remove("auth-token");
      setIsAuth(false);
      localStorage.removeItem("userUid"); // Clear user UID on logout
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const goToProfile = () => {
    if (userUid) {
      console.log("Navigating to profile:", `/profile/${userUid}`);
      navigate(`/profile/${userUid}`);
    } else {
      console.error("User UID is not set");
    }
  };

  return (
    <header>
      <div className="navbar">
        <div className="logo">
          <a href="/" className="">
            <img src={Icon} alt="Logo" className="logo_image" />
          </a>
        </div>
        <ul className="links">
          <li>
            <a href="/" className="links_items">
              <GoHome />
            </a>
          </li>
          <li>
            <a className="links_items" onClick={() => setModalOpen(true)}>
              <FiPlusCircle />
            </a>
          </li>
          <li>
            <a className="links_items" onClick={goToProfile}>
              <FaRegUserCircle />
            </a>
          </li>
        </ul>

        <button className="logout_btn" type="button" onClick={handleLogout}>
          Log Out
        </button>

        <div className="toggle_btn" onClick={handleToggleMenu}>
          {menuOpen ? <FaXmark /> : <FaBars />}
        </div>
      </div>

      <div className={`dropdown_menu ${menuOpen ? "open" : ""}`}>
        <li>
          <a href="/" className="links_items_drop">
            Home
          </a>
        </li>
        <li>
          <a className="links_items_drop" onClick={() => setModalOpen(true)}>
            Upload
          </a>
        </li>
        <li>
          <a className="links_items_drop" onClick={goToProfile}>
            Profile
          </a>
        </li>

        <li>
          <button className="logout_btn" type="button" onClick={handleLogout}>
            Log Out
          </button>
        </li>
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setModalOpen(false)}>
              &times;
            </button>
            <UploadForm />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
