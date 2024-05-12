import React, { useContext } from "react";
import Home from "./icons/Home";
import Profile from "./icons/Profile";
import FriendRequest from "./icons/FriendRequest";
import { createContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import { useAuth } from "./AuthProvider";
const ToolBar = () => {
  const navigate = useNavigate();

  function HandleClickFreind() {
    navigate("/friendrequest");
  }

  function HandleClickHome() {
    navigate("/homepage");
  }
  const auth = useAuth();
  return (
    <div
      className="d-flex flex-column align-items-center position-relative p-4"
      style={{
        backgroundColor: "#135D66",
        height: "100vh",
      }}
    >
      <div className="py-5 mt-5">
        <button
          className="btn btn-primary border-0"
          style={{ backgroundColor: "transparent" }}
          onClick={HandleClickHome}
        >
          <Home />
        </button>
      </div>
      <div className="py-5">
        <button
          className="btn btn-primary border-0"
          style={{ backgroundColor: "transparent" }}
          onClick={HandleClickFreind}
        >
          <FriendRequest />
        </button>
      </div>
      <div className="py-5  position-absolute bottom-0">
        <button
          onClick={auth.handleProfileButtonClick}
          className="btn btn-primary border-0"
          style={{ backgroundColor: "transparent" }}
        >
          <Profile />
        </button>
      </div>
    </div>
  );
};

export default ToolBar;
