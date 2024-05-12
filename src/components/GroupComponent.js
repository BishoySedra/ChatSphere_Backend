import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { baseUrl } from "../helpers/urls";

function GroupComponent(props) {
  const backgroundColor = props.clicked ? "#262626" : "white";
  const Headercolor = props.clicked ? "white" : "black";
  const FontColor = props.clicked ? "#FCFCFC" : "rgba(38, 38, 38, 0.6)";
  const [groupName, setGroupName] = useState("");
  const [senderName, setSenderName] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const username = await getUserNameByEmail(props.sender);
        setSenderName(username);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    }

    fetchData();
  }, [props.sender]);

  async function getUserNameByEmail(email) {
    const url = `${baseUrl}/profile/username/${email}`;
    const res = await Axios.get(url);
    return res.data.body;
  }

  return (
    <div
      className="chat-app my-1"
      style={{
        overflowX: "hidden",
      }}
    >
      <div
        className="container rounded-4 position-relative"
        style={{
          backgroundColor: backgroundColor,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <div className="row">
          <div className="col-md-2">
            <Image
              src={props.avatarUrl}
              className="rounded-circle w-100 h-100 "
            />
          </div>

          <div className="col-md-10 mt-3 flex-fill text-start">
            <div>
              <h5
                style={{
                  fontWeight: "bold",
                  color: Headercolor,
                  wordWrap: "break-word",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {props.groupname}
              </h5>
            </div>
            <p style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              <span
                style={{
                  wordWrap: "break-word",
                  color: FontColor,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  fontWeight: "bold",
                  marginRight: "10px",
                }}
              >
                {senderName} :
              </span>
              <span
                style={{
                  wordWrap: "break-word",
                  color: FontColor,
                  overflow: "hidden",
                  //   textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {props.lastMessage}
              </span>
            </p>
          </div>
          <div className="position-absolute p-3 ">
            <p
              className="position-absolute end-0 mx-3"
              style={{
                color: FontColor,
              }}
            >
              {new Date(props.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupComponent;
