import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, form);
      setSuccess("Registration successful! Please login.");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-xl w-96 flex flex-col gap-4">
        <h2 className="text-3xl font-bold mb-2 text-center text-blue-700 flex items-center justify-center gap-2">
          <FiUserPlus className="inline-block mb-1" /> Register
        </h2>
        <p className="text-gray-500 text-center mb-2">Create your account to get started.</p>
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        {success && <div className="text-green-600 mb-2 text-center">{success}</div>}
        <div className="relative">
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg" />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
            required
          />
        </div>
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
            required
          />
        </div>
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-lg mt-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </>
          ) : (
            <>
              <FiUserPlus /> Register
            </>
          )}
        </button>
        <div className="mt-2 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-semibold">Login</Link>
        </div>
      </form>
    </div>
  );
} 