import React, { useState } from "react";
import "./navbar.css";
import { FaBars, FaXmark } from "react-icons/fa6";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import Icon from "../../images/icon.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
              Home
            </a>
          </li>
          <li>
            <a href="/upload" className="links_items">
              Upload
            </a>
          </li>
          <li>
            <a href="/profile" className="links_items">
              Profile
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
        <li className="">
          <a href="/" className="links_items">
            Home
          </a>
        </li>
        <li className="">
          <a href="/upload" className="links_items">
            Upload
          </a>
        </li>
        <li className="">
          <a href="/profile" className="links_items">
            Profile
          </a>
        </li>
        <li className="">
          <button className="logout_btn" type="button" onClick={handleLogout}>
            Log Out
          </button>
        </li>
      </div>
    </header>
  );
};

export default Navbar;
