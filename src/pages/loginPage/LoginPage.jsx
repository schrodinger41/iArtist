import React, { useState } from "react";
import { auth, googleProvider } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import GoogleLogo from "../../images/googlelogo.png";
import "./loginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
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
        <h1 className="info-text">Welcome Back to Snapstudy!</h1>
      </div>
      <div className="login-form-container">
        <h1 className="app-logo">Snapstudy</h1>
        <form>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={signIn}>
            Sign Up
          </button>

          <p className="or-text">OR</p>
          <button
            type="button"
            className="google-sign-in-button"
            onClick={signInWithGoogle}
          >
            <img src={GoogleLogo} alt="Google logo" />
            Log in with Google
          </button>
        </form>
        <div className="signup-text">
          Don't have an account? <a href="/login">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
