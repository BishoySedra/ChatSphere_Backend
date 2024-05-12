import React from "react";
import { Image } from "react-bootstrap";

function ChatMessage(props) {
  const flag = props.senderemail === localStorage.getItem("email");
  const justifyClass = flag ? "justify-content-end" : "justify-content-start";

  return (
    <div className="row position-relative ">
      {/* <div className={container my-2 rounded-4 position-relative ${isSender ? 'justify-content-end' : ''}}>  */}
      <div className={`row ${justifyClass}`}>
        <div className="my-2 " style={{ width: "fit-content" }}>
          <div className="row ">
            <div
              className="message-container py-2 px-3 rounded-3 border border-light"
              style={{
                backgroundColor: "#F4F4F4",
                width: "fit-content",
              }}
            >
              <div>
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
                  className="message-content text-dark "
                  style={{ wordWrap: "break-word" }}
                >
                  {props.message}
                </span>
                {/* <br></br> */}
                <span
                  className="text-secondary d-flex justify-content-end "
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

export default ChatMessage;
