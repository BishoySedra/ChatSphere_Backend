import React, { useState, useEffect, useRef } from "react";
import { Button, Image, Spinner } from "react-bootstrap"; // Import Spinner from react-bootstrap
import ChatMessage from "./ChatMessage";
import Send from "./icons/Send";
import ImageIcon from "./icons/ImageIcon";
import { useAuth } from "./AuthProvider";
import { baseUrl } from "../helpers/urls";
import Axios from "axios";
import { socket } from "./socket/socket";
import GroupChatMessage from "./GroupChatMessage";
import Swal from "sweetalert2";

function ChatComponent(props) {
  const [messageContent, setMessageContent] = useState({
    text: "",
    createdAt: "",
  });
  const avatarUrl =
    "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg";

  const auth = useAuth();
  let ChatsArr = auth.currentlyChats;
  const [chatMessageArr, setChatMessageArr] = useState(ChatsArr.messages);
  const activeButton = auth.activeButton;
  const [pressAddFriend, setPressAddFriend] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const [addingFriend, setAddingFriend] = useState(false); // State variable for loading spinner
  const [error, setError] = useState("");
  const chatContainerRef = auth.chatContainerRef
  useEffect(() => {
    ChatsArr = auth.currentlyChats;
    setChatMessageArr(ChatsArr.messages);
    auth.scrollToBottom();
  }, [props.chatIndex]);


  

  const handleFriendEmailChange = (e) => {
    setFriendEmail(e.target.value);
  };


  const handleAddFriendSubmit = (e) => {
    e.preventDefault();
    setAddingFriend(true); // Set loading spinner to true when adding friend
    const url = `${baseUrl}/chats/groups/add-friend`;
    Axios.post(
      url,
      {
        adminEmail: localStorage.getItem("email"),
        userEmail: friendEmail,
        chatID: ChatsArr._id,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    )
      .then((res) => {
        setAddingFriend(false); // Set loading spinner to false after adding friend
      })
      .catch((err) => {
        setAddingFriend(false); // Set loading spinner to false on error
        setError(err.response.data.message);
        console.log(error);
        Swal.fire({
          icon: "error",
          text: error,
        });
      });
    setFriendEmail("");
    setError("");
  };

  function submit(e) {
    e.preventDefault();
    const newChatMessage = {
      text: messageContent.text,
      createdAt: messageContent.createdAt,
      sender_email: localStorage.getItem("email"),
    };

    // Set the message content
    //setChatMessageArr([...chatMessageArr, newChatMessage]);
    setMessageContent({
      text: "",
    });

    // Create a FormData object and append message and image if available
    let formData = new FormData();
    formData.append("message", newChatMessage.text);
    if (image) formData.append("imageMessage", image);


    const url = `${baseUrl}/messages/${localStorage.getItem("email")}/send/${
      ChatsArr._id
    }`;

    // Send the POST request with formData
    Axios.post(
      url,
      formData, // Pass formData as the data parameter
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
        },
      }
    )
      .then((res) => {
        auth.updateChat(ChatsArr._id, res.data.body);

      })
      .catch((err) => console.log(err))
      .finally(() => setImage(null));
      
  }

  function handel(e) {
    setMessageContent({
      ...messageContent,
      text: e.target.value,
      createdAt: new Date().toISOString(),
    });
  }

  const [image, setImage] = useState(null);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // Get the first selected file
    setImage(selectedFile); // Set the selected file to state
    console.log(selectedFile);
  };

  return (
    <div className="chat-app">
      <div
        className="d-flex flex-column position-relative p-4"
        style={{
          overflow: "hidden",
          backgroundColor: "#FCFCFC",
          height: "100vh",
        }}
      >
        <div className="row pt-2">
          <div className="col-md-2 pt-4">
            <Image src={avatarUrl} className="rounded-circle w-75 h-75" />
          </div>
          <div className="col-4 mt-3 pb-5">
            <div>
              <h5
                style={{
                  fontWeight: "bold",
                  fontSize: "25px",
                  wordWrap: "break-word",
                }}
              >
                {auth.activeButton === "Friends"
                  ? ChatsArr.users && ChatsArr.users[0]
                  : ChatsArr.groupChatDetails
                  ? ChatsArr.groupChatDetails.group_name
                  : ""}
              </h5>
            </div>
          </div>
          <div className="col-6 mt-3">
            <div className="row">
              {pressAddFriend ? (
                <div
                  className="col-8 colored-box p-3 rounded-3  align-items-center justify-content-between"
                  style={{ backgroundColor: "#135D66" }}
                >
                  <div className=" row d-flex position-relative">
                    <input
                      className="form-control ml-5 border-0 rounded-3 w-75"
                      type="text"
                      placeholder="Enter Friend Email"
                      value={friendEmail}
                      onChange={handleFriendEmailChange}
                    />
                    <Button
                      type="submit"
                      className="w-auto border-0 position-absolute end-0" 
                      onClick={handleAddFriendSubmit}
                      style={{ backgroundColor: "transparent" }}
                    >
                      {addingFriend ? (
                        <Spinner animation="border" variant="primary" />
                      ) : (
                        <i class="fa-solid fa-plus fa-xl"></i>
                      )}
                    </Button>
                  </div>
                </div>
              ) : null}
              {auth.activeButton === "Groups" ? (
                <div className="col align-self-end">
                  <div className="row justify-content-end">
                    <button
                      type="button"
                      className="btn btn-sm mx-5 mb-2 w-auto"
                      onClick={() => setPressAddFriend(!pressAddFriend)}
                    >
                      <i className="fa-solid fa-2xl fa-user-plus"></i>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="row p-4 pt-0 pb-0">
            <hr></hr>
          </div>
        </div>
        <div
          className="p-5 list-group end-0"
          style={{
            overflowY: "auto",
          }}
          ref={chatContainerRef} // Ref for the chat container

        >
          {chatMessageArr &&
            chatMessageArr.map((chatMessage, index) =>
              activeButton === "Friends" ? (
                <ChatMessage
                  key={index}
                  message={chatMessage.text}
                  timestamp={new Date(chatMessage.createdAt).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                  senderemail={chatMessage.sender_email}
                  imageurl={chatMessage.imageUrl}
                  image={image}
                />
              ) : (
                <GroupChatMessage
                  key={index}
                  message={chatMessage.text}
                  timestamp={new Date(chatMessage.createdAt).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                  senderemail={chatMessage.sender_email}
                  imageurl={chatMessage.imageUrl}
                  image={image}
                />
              )
            )}
        </div>
        <div className="align-bottom">
          <div className="p-4 pt-0 pb-0">
            <hr></hr>
          </div>

          <div className="col">
            <div className="row p-5 pt-0 pb-0">
              <div className="col-1">
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*" // Accept only image files
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <button
                  className="border-0 bg-transparent"
                  onClick={() => document.getElementById("fileInput").click()} // Trigger file input click when button is clicked
                >
                  <ImageIcon />
                </button>
              </div>
              <div className="col-11">
                <form className="row " onSubmit={(e) => submit(e)}>
                  <input
                    className="col-10 form-control border-0 rounded-3 start-0 w-75"
                    type="text"
                    placeholder="Type your message"
                    aria-label="Search"
                    onChange={(e) => handel(e)}
                    value={messageContent.text}
                  />
                  <div className="col-2 d-flex justify-content-around position-absolute end-0">
                    <button className="border-0 bg-transparent" type="submit">
                      <Send />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;
