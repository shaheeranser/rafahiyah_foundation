import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/api/users/login", {
        username,
        password,
      });

      console.log('Login response data:', response.data);

      if (!response.data || !response.data.token) {
        throw new Error("Invalid response from server");
      }

      const userData = {
        username: response.data.user?.username || username,
        role: response.data.user?.role || 'member',
        id: response.data.user?.id
      };

      if (userData.role !== 'admin') {
        setError('Access denied: Only admin can log in.');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(userData));

      navigate('/');

      console.log("Login successful:", response.data);
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please check your credentials and try again.";

      if (error.response) {
        errorMessage = error.response.data.msg ||
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      } else if (error.request) {
        errorMessage = "No response from server. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md" style={{ marginTop: "-50px" }}>
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="mt-1 p-2 border rounded w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="mt-1 p-2 border rounded w-full"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="text-center">
            <button
              className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
