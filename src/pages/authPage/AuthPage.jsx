import React, { useState } from "react";
import { auth, googleProvider, db } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import Cookies from "universal-cookie";
import GoogleLogo from "../../images/googlelogo.png";
import "./authPage.css";
import Icon from "../../images/icon.png";

const cookies = new Cookies();
const MAX_ATTEMPTS = 3; // Maximum login attempts
const LOCKOUT_TIME = 5 * 60 * 1000; // Lockout time in milliseconds (5 minutes)
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 20;

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fname, setFname] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/user-disabled":
        return "User account has been disabled.";
      case "auth/user-not-found":
        return "No user found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/email-already-in-use":
        return "Email is already in use.";
      case "auth/weak-password":
        return "Password should be at least 8 characters.";
      case "auth/invalid-credential":
        return "Invalid credentials provided.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  const handleAuth = async () => {
    const attempts = parseInt(localStorage.getItem("loginAttempts")) || 0;
    const lockoutEnd = parseInt(localStorage.getItem("lockoutEnd")) || 0;
    const now = Date.now();

    if (lockoutEnd > now) {
      const remainingTime = Math.ceil((lockoutEnd - now) / 1000 / 60); // Convert to minutes
      setError(
        `You are locked out. Please try again in ${remainingTime} minute(s).`
      );
      return;
    }

    if (
      !email ||
      !password ||
      (isRegistering && (!fname || !confirmPassword))
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (
      password.length < MIN_PASSWORD_LENGTH ||
      password.length > MAX_PASSWORD_LENGTH
    ) {
      setError(
        `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`
      );
      return;
    }

    if (isRegistering) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        if (user) {
          await updateProfile(user, { displayName: fname });
          const userRef = doc(db, "Users", user.uid);
          await setDoc(userRef, {
            email: user.email,
            fullName: fname,
            photo: user.photoURL || "",
          });

          cookies.set("auth-token", user.accessToken);
          localStorage.setItem("userUid", user.uid); // Store the user UID in localStorage
          localStorage.setItem("loginAttempts", "0"); // Reset attempts on successful login
          window.location.assign("/");
        }
      } catch (error) {
        setError(getErrorMessage(error.code));
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        cookies.set("auth-token", user.accessToken);
        localStorage.setItem("userUid", user.uid); // Store the user UID in localStorage
        localStorage.setItem("loginAttempts", "0"); // Reset attempts on successful login
        window.location.assign("/");
      } catch (error) {
        setError(getErrorMessage(error.code));

        // Increment login attempts and handle lockout
        const newAttempts = attempts + 1;
        if (newAttempts >= MAX_ATTEMPTS) {
          const lockoutEndTime = now + LOCKOUT_TIME;
          localStorage.setItem("lockoutEnd", lockoutEndTime.toString());
          setError(
            "Too many failed attempts. You are locked out for 5 minutes."
          );
        } else {
          localStorage.setItem("loginAttempts", newAttempts.toString());
        }
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      cookies.set("auth-token", user.accessToken);
      localStorage.setItem("userUid", user.uid); // Store the user UID in localStorage

      const userRef = doc(db, "Users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        fullName: user.displayName || "Anonymous",
        photo: user.photoURL || "",
      });

      localStorage.setItem("loginAttempts", "0"); // Reset attempts on successful login
      window.location.assign("/");
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
  };

  return (
    <div className="register-page">
      <div className="info-container">
        <img src={Icon} alt="Logo" className="info-logo" />
        <h1 className="info-text">Welcome to iArtist!</h1>
      </div>
      <div className="login-form-container">
        <h1 className="app-logo">{isRegistering ? "Sign Up!" : "Sign In!"}</h1>
        {error && <p className="error-message">{error}</p>}
        <form>
          {isRegistering && (
            <input
              type="text"
              placeholder="Full Name"
              className="input"
              onChange={(e) => setFname(e.target.value)}
            />
          )}
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
          {isRegistering && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="input"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <button className="button" type="button" onClick={handleAuth}>
            {isRegistering ? "Sign Up" : "Sign In"}
          </button>
          <p className="or-text">OR</p>
          <button
            type="button"
            className="google-sign-in-button button"
            onClick={signInWithGoogle}
          >
            <img src={GoogleLogo} alt="Google logo" />
            {isRegistering ? "Sign Up" : "Sign In"} with Google
          </button>
        </form>
        <div className="signup-text">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <a
            className="link-transfer-mode"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Sign In" : "Sign Up"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
