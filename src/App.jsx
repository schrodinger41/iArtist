import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cookies from "universal-cookie";
import AuthPage from "./pages/authPage/AuthPage";
import HomePage from "./pages/homePage/HomePage";
import ProfilePage from "./pages/profilePage/ProfilePage";
import "./App.css";

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(
    cookies.get("auth-token") ? true : false
  );

  useEffect(() => {
    // Update authentication state based on cookie changes
    setIsAuth(cookies.get("auth-token") ? true : false);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuth ? <HomePage /> : <AuthPage setIsAuth={setIsAuth} />}
        />
        <Route
          path="/profile/:userId"
          element={
            isAuth ? <ProfilePage /> : <AuthPage setIsAuth={setIsAuth} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
