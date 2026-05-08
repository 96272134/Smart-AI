import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/chat");

    } catch (error) {

      alert(error.response.data.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">

      <div className="bg-gray-900 p-10 rounded-2xl w-[400px] shadow-lg">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-xl font-bold"
          >
            Login
          </button>

        </form>

        <p className="mt-6 text-center text-gray-400">

          No account?

          <Link
            to="/signup"
            className="text-blue-500 ml-2"
          >
            Signup
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;