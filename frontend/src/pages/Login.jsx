// import React, { useState } from "react";
// import { loginUser } from "../services/api";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const data = await loginUser({ username, password });

//       localStorage.setItem("token", data.accessToken);

//       alert("Login successful ✅");
//       navigate("/dashboard");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>

//       <input
//         placeholder="Username"
//         onChange={(e) => setUsername(e.target.value)}
//       />
//       <br />

//       <input
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <br />

//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// };

// export default Login;






import React, { useState, useEffect } from "react";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, []);

  const handleLogin = async () => {
    try {
      const data = await loginUser({ username, password });
      localStorage.setItem("token", data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3 rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white w-full py-2 rounded"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-sm mt-3 text-center">
          New user? <Link className="text-blue-500" to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;