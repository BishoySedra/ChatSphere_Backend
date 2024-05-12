// import './App.css';
import AuthProvider from "./components/AuthProvider";
import FriendRequestForm from "./components/screens/FriendRequest";
import Home from "./components/screens/Home";
import Login from "./components/screens/Login";
import SignUp from "./components/screens/SignUp";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" Component={Login} />
            <Route path="/signup" Component={SignUp} />
            <Route path="/friendrequest" Component={FriendRequestForm} />
            <Route path="/homepage" Component={Home} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      {/* <FriendRequestForm /> */}
    </div>
  );
}

export default App;
