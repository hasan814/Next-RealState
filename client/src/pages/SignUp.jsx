import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { useState } from "react";

import toast from "react-hot-toast";

const SignUp = () => {
  // ============ State ============
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // ============ Handlers ============
  const changeHandler = ({ target: { id, value } }) => {
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Something went wrong");
      }

      toast.success(responseData.message || "Signup successful!");
      navigate("/sign-in");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ============ Rendering ============
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center capitalize font-semibold my-7">
        Sign Up
      </h1>
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Username..."
          className="border p-3 rounded-lg"
          id="username"
          value={formData.username}
          onChange={changeHandler}
          required
        />
        <input
          type="email"
          placeholder="Email..."
          className="border p-3 rounded-lg"
          id="email"
          value={formData.email}
          onChange={changeHandler}
          required
        />
        <input
          type="password"
          placeholder="Password..."
          className="border p-3 rounded-lg"
          id="password"
          value={formData.password}
          onChange={changeHandler}
          required
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? <BeatLoader color="#b18484" size={8} /> : "Sign Up"}
        </button>
        <div className="flex gap-2 mt-5">
          <p>Have an account?</p>
          <Link to="/sign-in">
            <span className="text-blue-700">Sign In</span>
          </Link>
        </div>
        {error && (
          <p className="text-white mt-5 text-center bg-red-400 rounded-lg py-2">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default SignUp;
