import { signInStart, signInFailure, signInSuccess } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { useState } from "react";

import toast from "react-hot-toast";
import OAuth from "../components/modules/OAuth";

const SignIn = () => {
  // ============ Redux ============
  const { loading, error } = useSelector((state) => state.user);

  // ============ Dispatch ============
  const dispatch = useDispatch();

  // ============ Navigate ============
  const navigate = useNavigate();

  // ============ State ============
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ============ Handlers ============
  const changeHandler = ({ target: { id, value } }) => {
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    dispatch(signInStart());

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok)
        throw new Error(responseData.message || "Sign in failed.");

      dispatch(signInSuccess(responseData));
      toast.success(responseData.message || "Sign In successful!");
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  // ============ Rendering ============
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center capitalize font-semibold my-7">
        Sign In
      </h1>
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
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
          {loading ? <BeatLoader color="#b18484" size={8} /> : "Sign In"}
        </button>
        <OAuth />
        <div className="flex gap-2 mt-5">
          <p>Don&apos;t have an account?</p>
          <Link to="/sign-up">
            <span className="text-blue-700">Sign Up</span>
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

export default SignIn;
