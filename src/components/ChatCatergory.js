import React from "react";

function ChatCategory(props) {
  return (
    <button
      type="button"
      className="btn btn-sm mx-5 mb-2 w-75"
      style={{ backgroundColor: "white" }}
    >
      {props.category}
    </button>
  );
}


export default ChatCategory;
