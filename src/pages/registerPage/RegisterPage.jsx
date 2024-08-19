import React, { useState } from "react";
import { auth, googleProvider, db } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

import GoogleLogo from "../../images/googlelogo.png";
import "./registerPage.css";
import Icon from "../../images/icon.png";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
        });
      }
      console.log("User Registered Successfully");
      window.location.href = "/home";
    } catch (error) {
      console.log(error.message);
    }
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="register-page">
      <div className="info-container">
        <img src={Icon} alt="Logo" className="info-logo" />
        <h1 className="info-text">Welcome to iArtist!</h1>
      </div>
      <div className="login-form-container">
        <h1 className="app-logo">Sign Up!</h1>
        <form>
          <input
            type="text"
            placeholder="First Name"
            onChange={(e) => setFname(e.target.value)}
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            className="input"
            onChange={(e) => setLname(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="input"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="button" type="button" onClick={signIn}>
            Sign Up
          </button>
          <button className="button" type="button" onClick={logout}>
            log Up
          </button>

          <p className="or-text">OR</p>
          <button
            type="button"
            className="google-sign-in-button button"
            onClick={signInWithGoogle}
          >
            <img src={GoogleLogo} alt="Google logo" />
            Sign Up with Google
          </button>
        </form>
        <div className="signup-text">
          Already have an account? <a href="/login">Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
