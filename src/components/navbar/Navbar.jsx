import React, { useState } from "react";
import "./navbar.css";
import { FaBars, FaXmark } from "react-icons/fa6";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import Icon from "../../images/icon.png";
import { FiPlusCircle } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";
import UploadForm from "../uploadForm/UploadForm";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
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
            <button className="links_items" onClick={() => setModalOpen(true)}>
              <FiPlusCircle />
            </button>
          </li>
          <li>
            <a href="/profile" className="links_items">
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
          <button
            className="links_items_drop"
            onClick={() => setModalOpen(true)} // Open modal on click
          >
            Upload
          </button>
        </li>
        <li>
          <a href="/profile" className="links_items_drop">
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
