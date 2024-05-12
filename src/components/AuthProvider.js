import { useContext, createContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();
  const [selectedChatIndex, setSelectedChatIndex] = useState(null);
  const [allChats, setAllChats] = useState([]); 
  const [currentlyChats, setCurrentlyChats] = useState([]);
  const [activeButton, setActiveButton] = useState("Friends");
  const [createGroup, setCreateGroup] = useState(false);
  const chatContainerRef = useRef(null);


  function updateChats(index, chat) {
    setSelectedChatIndex(index);
    setCurrentlyChats(chat);
  }

  const redirectEmail = async (email) => {
    try {
      setEmail(email);
      localStorage.setItem("email", email);
      navigate("/homepage");
      return;
    } catch (err) {
      console.error(err);
    }
  };

  const [showProfilePage, setShowProfilePage] = useState(false);

  const handleProfileButtonClick = () => {
    setShowProfilePage(!showProfilePage);
  };
  const scrollToBottom = () => {
    if(chatContainerRef.current === null) return;
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
  };
  //make an update to a specific chat by its id on the chats state
  const updateChat = (id,message) => {
    console.log("ID: " + id)
    console.log(allChats + " all chats")
    const updatedChats = allChats.map((c) => {
      if (c._id === id) {
        c.messages.push(message);
        scrollToBottom()
      }
      return c;
    });
    setAllChats(updatedChats);
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        redirectEmail,
        showProfilePage,
        handleProfileButtonClick,
        selectedChatIndex,
        setSelectedChatIndex,
        updateChats,
        currentlyChats,
        setCurrentlyChats,
        activeButton,
        setActiveButton,
        createGroup,
        setCreateGroup,
        allChats,
        setAllChats,
        updateChat,
        chatContainerRef,
        scrollToBottom,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
