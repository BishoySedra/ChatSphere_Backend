import React, { createContext, useEffect, useState } from "react";
import Axios from "axios";
import { baseUrl } from "../../helpers/urls";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { socket } from "../socket/socket.js";
import "../../styles/Login.css";
import logo from "../../images/logo.png";
export const emailContext = createContext();

function Login() {
  const url = `${baseUrl}/auth/login`;
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/homepage");
    }
  }, []);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function submit(e) {
    e.preventDefault();

    // Client-side validation
    if (!data.email || !isValidEmail(data.email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setLoading(true);
    Axios.post(url, {
      email: data.email,
      password: data.password,
    })
      .then(async (res) => {
        let tokenValue = "Bearer " + res.data.body;
        localStorage.setItem("token", tokenValue);
        setErrors({});
        socket.emit("successfulLogin", { email: data.email });

        await auth.redirectEmail(data.email);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.body) {
          const errorData = err.response.data.body;
          const newErrors = {};

          errorData.forEach((error) => {
            newErrors[error.field] = error.message || "";
          });

          setErrors(newErrors);
        } else if (err.response && err.response.status === 401) {
          setErrors({
            email: "Invalid email or password",
            password: "Invalid email or password",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handle(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value || "";
    setData(newdata);
    setErrors({
      ...errors,
      [e.target.id]: "",
    });
  }

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  if (localStorage.getItem("token")) {
    return <Navigate to="/homepage" />;
  }

  const handleClick = () => {
    navigate("/signup");
  };

  return (
    <div className="login">
      <div className="overlap">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="image wi">
                <img src={logo} alt="" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="info">
        <h1 className="welcome">Hello friend,</h1>
        <h2 className="postwelcome">Long time no see</h2>
        <div className="login-info">
          <form onSubmit={(e) => submit(e)}>
            <input
              onChange={(e) => handle(e)}
              id="email"
              value={data.email}
              type="text"
              placeholder="Email"
              className={errors.email && "errortext"}
            />
            {errors.email && <div className="error">{errors.email}</div>}
            <br />
            <input
              onChange={(e) => handle(e)}
              id="password"
              value={data.password}
              type="password"
              placeholder="Password"
              className={errors.password && "errortext"}
            />
            {errors.password && <div className="error">{errors.password}</div>}
            <br />
            <button className="signupbutton" type="submit" disabled={loading}>
              {loading ? (
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
        <div className="signupdiv">
          <button className="signup" onClick={handleClick}>
            Don’t have an account?{" "}
            <span className="different-color">SignUp</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
