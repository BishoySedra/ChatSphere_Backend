import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import ToolBar from "../ToolBar";
import ChatBox from "../ChatBox";
import ChatScreenComponent from "../ChatScreenCompnent";
import { useEffect } from "react";
import { socket } from "../socket/socket.js";
import ProfilePage from "../ProfilePage.js";
import "../../styles/Home.css";
import CreateGroup from "../CreateGroup.js";

function Home() {
  const auth = useAuth();
  const token = localStorage.getItem("token");
  const loggedinEmail = localStorage.getItem("email");

  useEffect(() => {
    if (token) socket.emit("successfulLogin", { email: loggedinEmail });
  }, []);

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="row fixed-top">
        <header className="col-12 col-md-4">
          <div className="row">
            <div className="col-2">
              <ToolBar />
            </div>

            <div
              className="col-10 chat-column"
              style={{
                backgroundColor: "#F4F4F4",
                overflowY: "scroll",
                height: "100vh",
              }}
            >
              <ChatBox />
              {auth.showProfilePage && <ProfilePage />}
            </div>
          </div>
        </header>

        <div className="col-8 chat-screen-column align-content-center">
          <div className="row p-3">
            {auth.selectedChatIndex !== null && !auth.createGroup && (
              <ChatScreenComponent chatIndex={auth.selectedChatIndex} />
            )}
            {auth.createGroup && (
              <CreateGroup />
            )}
            {auth.selectedChatIndex === null && (
              // Render something for the null state
              null
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
