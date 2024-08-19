import React, { useState } from "react";
import { auth, googleProvider } from "../../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import GoogleLogo from "../../images/googlelogo.png";
import "./loginPage.css";
import Icon from "../../images/icon.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User Logged in Successfully");
      window.location.href = "/home";
    } catch (error) {}
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      const user = auth.currentUser;
      console.log(user);
      console.log("User Logged In Successfully");
      window.location.href = "/home";
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="register-page">
      <div className="info-container">
        <img src={Icon} alt="Logo" className="info-logo" />
        <h1 className="info-text">Welcome Back to iArtist!</h1>
      </div>
      <div className="login-form-container">
        <h1 className="app-logo">Sign In!</h1>
        <form>
          <input
            type="email"
            placeholder="Email"
            className="input"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="button" type="button" onClick={logIn}>
            Sign In
          </button>

          <p className="or-text">OR</p>
          <button
            type="button"
            className="google-sign-in-button button"
            onClick={signInWithGoogle}
          >
            <img src={GoogleLogo} alt="Google logo" />
            Sign In with Google
          </button>
        </form>
        <div className="signup-text">
          Don't have an account? <a href="/register">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
