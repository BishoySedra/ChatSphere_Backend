import React, { useEffect, useState } from "react";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ToolBar from "../ToolBar";
import PendingRequest from "../PendingRequest";
import { baseUrl } from "../../helpers/urls";
import { Navigate } from "react-router-dom";
import { socket } from "../socket/socket";
import ProfilePage from "../ProfilePage";
import { useAuth } from "../AuthProvider";
function FriendRequestForm() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Send Request");
  const [requestesArray, setRequestesArray] = useState([]);
  const [fetchingData, setFetchingData] = useState(true); // State to indicate data fetching
  const currentlyLoggedEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleReceiveNotification = (data) => {
      updateRequestesArray(data.username, data.email);
    };

    socket.on("receiveNotification", handleReceiveNotification);
    socket.on("acceptFriendRequest", (data) => console.log(data));
    return () => {
      socket.off("receiveNotification", handleReceiveNotification);
      socket.off("acceptFriendRequest");
    };
  }, []);

  function updateRequestesArray(username, email) {
    setRequestesArray((prevArray) => [...prevArray, { username, email }]);
  }

  useEffect(() => {
    if (token) socket.emit("successfulLogin", { email: currentlyLoggedEmail });
  }, []);

  useEffect(() => {
    const url = `${baseUrl}/users/${currentlyLoggedEmail}/friend-requests`;
    Axios.get(url, {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((res) => {
        setRequestesArray(res.data.body);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setFetchingData(false); // Update state after fetching data
      });
  }, []);

  const sendFriendRequest = () => {
    const SendReqUrl = `${baseUrl}/users/${currentlyLoggedEmail}/send/${email}`;

    // Start loading
    setLoading(true);

    const headers = {
      Authorization: token,
    };

    Axios.post(SendReqUrl, null, {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        // Request sent successfully, update button text
        setButtonText("Request Sent");
      })
      .catch((err) => {
        console.log(email);
        console.log(err);
      })
      .finally(() => {
        // Request completed, stop loading
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div
      className="d-flex flex-column "
      style={{ overflow: "hidden", height: " 100vh" }}
    >
      <div className="row">
        <header className="col-1">
          <div className="row">
            <div className="col-8">
              <ToolBar />
            </div>
          </div>
        </header>

        <div className=" col-11">
          {auth.showProfilePage && <ProfilePage />}
          <div className="container ">
            <div className="row p-5">
              <div className="col-md-6 offset-md-2">
                <input
                  onChange={handleInputChange}
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter the email"
                />
              </div>
              <div className="col-md-2">
                <button
                  onClick={sendFriendRequest}
                  className="btn btn-success btn-block"
                  style={{ backgroundColor: "#135D66", border: "#262626" }}
                  disabled={loading} // Disable button when loading
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    buttonText
                  )}
                </button>
              </div>
            </div>
            <div className="row p-5">
              <h2>Your Pending Requests</h2>
            </div>
            <div
              className="p-5 list-group"
              style={{
                overflow: "scroll",
                maxHeight: "100vh",
              }}
            >
              {fetchingData ? ( // Display spinner while fetching data
                <div className="text-center">
                  <div
                    className="spinner-border"
                    role="status"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                requestesArray.map((sender, index) => (
                  <PendingRequest
                    key={index}
                    senderusername={sender.username}
                    senderemail={sender.email}
                    array={requestesArray}
                    setArray={setRequestesArray}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendRequestForm;
