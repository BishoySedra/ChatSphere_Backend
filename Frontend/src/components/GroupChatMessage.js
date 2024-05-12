import React, { useState, useEffect } from "react";
import Axios from "axios";
import { baseUrl } from "../helpers/urls";
import { Image } from "react-bootstrap";

function GroupChatMessage(props) {
  const [senderName, setSenderName] = useState(null);

  useEffect(() => {
    async function fetchSenderName() {
      try {
        const res = await getUserNameByEmail(props.senderemail);
        setSenderName(res);
      } catch (err) {
        console.log(err);
      }
    }

    fetchSenderName();
  }, [props.senderemail]);

  async function getUserNameByEmail(email) {
    const url = `${baseUrl}/profile/username/${email}`;
    const res = await Axios.get(url);
    return res.data.body;
  }

  const flag = props.senderemail === localStorage.getItem("email");
  const justifyClass = flag ? "justify-content-end" : "justify-content-start";

  return (
    <div className="row position-relative ">
      <div className={`row ${justifyClass} `}>
        <div
          className="my-2 overflow-x-hidden"
          style={{ width: "fit-content" }}
        >
          <div className="row">
            <div
              className="message-container py-2 px-3 rounded-4 border border-light"
              style={{ backgroundColor: "#F4F4F4" }}
            >
              <div>
                <span
                  className={`d-flex ${justifyClass}`}
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#77B0AA",
                  }}
                >
                  {senderName}
                </span>
                {props.imageurl ? (
                  <div className={`row ${justifyClass} p-3`}>
                    <div
                      className={`d-flex end-0 `}
                      style={{ maxWidth: "100%" }}
                    >
                      <Image
                        className="rounded-3"
                        src={props.imageurl}
                        style={{ maxWidth: "500px", maxHeight: "500px" }} // Adjust width and height values as needed
                      />{" "}
                      {props.image ? (
                        <Image
                          className="rounded-3"
                          src={props.image}
                          style={{ maxWidth: "500px", maxHeight: "500px" }} // Adjust width and height values as needed
                        />
                      ) : null}
                    </div>
                  </div>
                ) : null}

                <span
                  className={`message-content text-dark d-flex ${justifyClass}`}
                  style={{ wordWrap: "break-word" }}
                >
                  {props.message}
                </span>
                <span
                  className="text-secondary d-flex justify-content-end"
                  style={{ fontSize: "13px" }}
                >
                  {props.timestamp}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupChatMessage;
