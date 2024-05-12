import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.css";
import Axios  from "axios";
import { baseUrl } from "../helpers/urls.js";
import { useAuth } from "./AuthProvider.js";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const avatarUrl =
    "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg";

  const [data, setData] = useState({
    username: "",
    email: "",
  });
  const navigate = useNavigate();


  const loggedinEmail = localStorage.getItem("email");
  const auth = useAuth();
  const loggedinUserName = localStorage.getItem("username");
  function logout () {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    navigate("/");
  }

  useEffect(() => {
    if(!loggedinUserName){
      const url = `${baseUrl}/profile/${loggedinEmail}`;
      Axios.get(url, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
        .then((res) => {
          setData({
            username: res.data.body.username,
            email: res.data.body.email,
          });
          localStorage.setItem("username", res.data.body.username);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    
  }, []);

  return (
    <div
      className="position-absolute bottom-0 left-0 col-3 h-50 container rounded-3 "
      style={{
        background: "#FCFCFC",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="col pt-4 d-flex flex-column align-items-center">
        <div className="d-flex justify-content-center align-items-center">
          <Image src={avatarUrl} className="rounded-circle w-25 h-25" />
        </div>
        <div
          className="row d-flex align-items-center text-center pt-3"
          style={{
            fontWeight: "bold",
            wordWrap: "break-word",
          }}
        >
          <h5>{loggedinUserName}</h5>
        </div>
      </div>
      <div
        className="row d-flex pt-4 pl-1"
        style={{
          fontWeight: "bold",
          wordWrap: "break-word",
        }}
      >
        <h5>Email</h5>
      </div>
      <div
        className="row d-flex pt-1 pl-1"
        style={{
          fontWeight: "bold",
          wordWrap: "break-word",
        }}
      >
        <h6>{loggedinEmail}</h6>
      </div>

      <div className="row d-flex justify-content-center text-center pt-5">
        <button
          type="button"
          className="btn justify-content-center text-light text-center w-50"
          style={{ backgroundColor: "#135D66" }}
          onClick={logout}
        >
          <i className="fa-solid fa-right-from-bracket ml-2"></i>
          &nbsp; Logout
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
