import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/signup",
        {
          username,
          email,
          password,
        }
      );
      navigate("/login");
    } catch (error) {
      setError("Error signing up. Please try again.");
    }
  };
  return (
    <>
      <div className="signup-container">
        <h1>SignUp</h1>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            className="form-input"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            className="form-input"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p>{error}</p>}
          <button className="form-button" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
}

export default SignUp;
