import React, { useEffect, useState } from "react";
import Axios from "axios";
import { baseUrl } from "../../helpers/urls";
import "../../styles/SignUp.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import logo from "../../images/logo.png" 
function SignUp() {
  const url = `${baseUrl}/auth/register`;
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function submit(e) {
    e.preventDefault();
    setLoading(true);
    Axios.post(url, {
      username: data.username,
      email: data.email,
      password: data.password,
    })
      .then((res) => {
        navigate("/");
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.body) {
          const errorData = err.response.data.body;
          const newErrors = {};

          errorData.forEach((error) => {
            newErrors[error.field] = error.message || "";
          });

          setErrors(newErrors);
        } else if (err.response && err.response.status === 409) {
          setErrors({
            email: err.response.data.message,
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

  if (localStorage.getItem("token")) navigate("/homepage");
 
  const handleClick = () => {
    navigate("/");
  };
  return (
    <div className="signup">
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
        <h1 className="welcome">Welcome,</h1>
        <h3 className="postwelcome">Please fill the following information to sign up</h3>
        <div className="signup-info">
          <form onSubmit={(e) => submit(e)}>
            <input
              onChange={(e) => handle(e)}
              id="email"
              value={data.email}
              type="text"
              placeholder="Email"
              className={errors.email && "error"}
            />
            {errors.email && <div className="error">{errors.email}</div>}
            <br />
            <input
              onChange={(e) => handle(e)}
              id="username"
              value={data.username}
              type="text"
              placeholder="Username"
              className={errors.username && "error"}
            />
            {errors.username && <div className="error">{errors.username}</div>}
            <br />
            <input
              onChange={(e) => handle(e)}
              id="password"
              value={data.password}
              type="password"
              placeholder="Password"
              className={errors.password && "error"}
            />
            {errors.password && <div className="error">{errors.password}</div>}
            <br />

            <button className="signupbutton" type="signup" disabled={loading}>
              {loading ? (
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>
      </div>
      <button className="login" onClick={handleClick}>
         Already have an account?<span className="different-color">Login</span>
        </button>
    </div>
  );
}

export default SignUp;
