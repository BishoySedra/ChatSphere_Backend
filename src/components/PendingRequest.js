import React, { useState } from "react";
import { Image } from "react-bootstrap";
import Axios from "axios";
import { baseUrl } from "../helpers/urls.js";
import { useNavigate } from "react-router-dom";

function PendingRequest(props) {
  const navigate = useNavigate();
  const loggedinEmail = localStorage.getItem("email");
  const url = `${baseUrl}/users/${loggedinEmail}/response/${props.senderemail}`;
  const token = localStorage.getItem("token");

  const reqarr = props.array;
  const index = reqarr.indexOf(props.senderemail);
  const setfunc = props.setArray;

  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  function acceptFriendReq() {
    setLoadingApprove(true);
    Axios.post(
      url,
      {
        status: "ACCEPTED",
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
      .then((res) => {
        setfunc((prevArray) => {
          const newArray = [...prevArray];
          newArray.splice(index, 1);
          return newArray;
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingApprove(false);
      });
  }

  function rejectFriendReq() {
    setLoadingReject(true);
    Axios.post(
      url,
      {
        status: "REJECTED",
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
      .then((res) => {
        setfunc((prevArray) => {
          const newArray = [...prevArray];
          newArray.splice(index, 1);
          return newArray;
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingReject(false);
      });
  }

  const avatarUrl =
    "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg";
  return (
    <div className="chat-app my-2 p-5 pt-0 pb-0">
      <div
        className="container my-2 rounded-4 position-relative"
        style={{ backgroundColor: "#FCFCFC" }}
      >
        <div className="row">
          <div className="col-md-2 pt-4">
            <Image src={avatarUrl} className="rounded-circle w-75 h-75 " />
          </div>

          <div className="col-md-6 mt-3 align-items-center d-flex">
            <div className="row d-flex justify-content-center">
              <h3
                style={{
                  //fontFamily: "serif",
                  fontWeight: "bold",
                  wordWrap: "break-word",
                }}
              >
                {props.senderusername}
              </h3>
              <h6
                style={{
                  //fontFamily: "serif",
                  wordWrap: "break-word",
                }}
              >
                {props.senderemail}
              </h6>
            </div>
          </div>

          <div className="col-4 d-flex end-0 align-items-center ">
            <button
              type="button"
              className="btn mx-5 mb-2 w-100 btn-large text-light"
              style={{ backgroundColor: "#135D66" }}
              onClick={acceptFriendReq}
              disabled={loadingApprove}
            >
              {loadingApprove ? ( 
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Approve"
              )}
            </button>
            <button
              type="button"
              className="btn mx-5 mb-2 w-100 btn-large text-light"
              style={{ backgroundColor: "#135D66" }}
              onClick={rejectFriendReq}
              disabled={loadingReject}
            >
              {loadingReject ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Reject"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingRequest;
