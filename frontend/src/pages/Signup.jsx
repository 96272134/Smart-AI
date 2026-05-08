import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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

      await API.post(
        "/auth/signup",
        formData
      );

      alert("Signup successful");

      navigate("/");

    } catch (error) {

      alert(error.response.data.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">

      <div className="bg-gray-900 p-10 rounded-2xl w-[400px] shadow-lg">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Signup
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 outline-none"
          />

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
            Signup
          </button>

        </form>

        <p className="mt-6 text-center text-gray-400">

          Already have account?

          <Link
            to="/"
            className="text-blue-500 ml-2"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Signup;