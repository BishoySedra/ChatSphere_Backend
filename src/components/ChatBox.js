import React, { useEffect, useState } from "react";
import Axios from "axios";
import Searchbar from "./Searchbar";
import ChatComponent from "./ChatComponent";
import { baseUrl } from "../helpers/urls";
import { useAuth } from "./AuthProvider";
import GroupComponent from "./GroupComponent";
import "@fortawesome/fontawesome-free/css/all.css";
import { socket } from "./socket/socket";

function ChatBox() {
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero

  const midnightISOString = midnight.toISOString();
  const [fetchingData, setFetchingData] = useState(true);
  const [chats, setChats] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // State variable for search query
  const avatarUrl =
    "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg";

  const auth = useAuth();
  const activeButton = auth.activeButton;

  useEffect(() => {
    const handleChat = (data) => {
      console.log("HERE SOCKET", data);
      auth.updateChat(data.chatID, data.toBeSentMessage);
    };
    socket.on("receivedMessage", handleChat);
    return () => {
      socket.off("receivedMessage", handleChat);
    };
  }, [chats]);
  
  useEffect(() => {
    fetchData(activeButton);
    auth.setSelectedChatIndex(null);
  }, [activeButton]);


  const fetchData = async (type) => {
    setFetchingData(true);
    try {
      const url =
        type === "Friends"
          ? `${baseUrl}/chats/private/${localStorage.getItem("email")}`
          : `${baseUrl}/chats/groups/${localStorage.getItem("email")}`;
      const res = await Axios.get(url, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setChats(res.data.body);
      
      auth.setAllChats(res.data.body)
      if (activeButton === "Friends") fetchUsernames(res.data.body);
    } catch (err) {
      console.log(err);
    } finally {
      setFetchingData(false);
    }
  };

  async function fetchUsernames(chats) {
    const updatedUsernames = {};
    const useremail = localStorage.getItem("email");
    for (const chat of chats) {
      let index = -1;
      if (useremail === chat.users[1]) {
        index = 0;
      } else {
        index = 1;
      }
      const sender = await getUserNameByEmail(chat.users[index]);
      updatedUsernames[chat._id] = sender || "Unknown User";
      chat.users[0] = updatedUsernames[chat._id];
    }
    setUsernames(updatedUsernames);
  }

  async function getUserNameByEmail(email) {
    const url = `${baseUrl}/profile/username/${email}`;
    try {
      const res = await Axios.get(url);
      return res.data.body;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  const handleButtonClick = (buttonName) => {
    auth.setActiveButton(buttonName);
  };

  // Function to handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div style={{ backgroundColor: "#F4F4F4" }}>
      {/* Searchbar component */}
      <Searchbar value={searchQuery} onChange={handleSearchChange} />
      <div className="d-flex align-item-center justify-content-center">
        <button
          type="button"
          className="btn btn-sm mx-5 mb-2 w-75"
          style={{
            backgroundColor: activeButton === "Friends" ? "#262626" : "#ffffff",
            color: activeButton === "Friends" ? "#ffffff" : "#262626",
          }}
          onClick={function () {
            handleButtonClick("Friends");
            auth.setCreateGroup(false);
          }}
        >
          Friends
        </button>
        <button
          type="button"
          className="btn btn-sm mx-5 mb-2 w-75"
          style={{
            backgroundColor: activeButton === "Groups" ? "#262626" : "#ffffff",
            color: activeButton === "Groups" ? "#ffffff" : "#262626",
          }}
          onClick={() => handleButtonClick("Groups")}
        >
          Groups
        </button>
        {auth.activeButton === "Groups" ? (
          <button
            type="button"
            className="btn btn-sm mx-5 mb-2 w-25"
            onClick={function () {
              auth.setCreateGroup(!auth.createGroup);
            }}
          >
            <i className="fa-solid fa-xl fa-plus"></i>
          </button>
        ) : null}
      </div>
      <div className="list-group">
        {fetchingData ? (
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
          chats
            .filter((chat) =>
              chat.users.some((user) =>
                user.toLowerCase().includes(searchQuery.toLowerCase())
              )
            )
            .map((chat, index) => (
              <button
                key={index}
                className="btn d-flex justify-content-between"
                onClick={function () {
                  auth.updateChats(index, chat);
                  auth.setCreateGroup(false);
                }}
                style={{
                  backgroundColor: "#F4F4F4",
                  border: "none",
                  outline: "none",
                }}
              >
                {activeButton === "Groups" ? (
                  <GroupComponent
                    clicked={auth.selectedChatIndex === index}
                    sender={
                      chat.messages.length
                        ? chat.messages[chat.messages.length - 1].sender_email
                        : ""
                    }
                    lastMessage={
                      chat.messages.length
                        ? chat.messages[chat.messages.length - 1].text
                        : "New Chat"
                    }
                    timestamp={
                      chat.messages.length
                        ? chat.messages[chat.messages.length - 1].createdAt
                        : midnightISOString
                    }
                    avatarUrl={avatarUrl}
                    groupid={chat._id}
                    groupname={
                      chat.groupChatDetails
                        ? chat.groupChatDetails.group_name
                        : ""
                    }
                  />
                ) : (
                  <ChatComponent
                    clicked={auth.selectedChatIndex === index}
                    sender={usernames[chat._id] || ""}
                    lastMessage={
                      chat.messages.length
                        ? chat.messages[chat.messages.length - 1].text
                        : "New Chat"
                    }
                    timestamp={
                      chat.messages.length
                        ? chat.messages[chat.messages.length - 1].createdAt
                        : midnightISOString
                    }
                    avatarUrl={avatarUrl}
                  />
                )}
              </button>
            ))
        )}
      </div>
    </div>
  );
}

export default ChatBox;
