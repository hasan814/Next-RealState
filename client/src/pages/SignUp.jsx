import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { useState } from "react";
import { motion } from "framer-motion";

import toast from "react-hot-toast";
import OAuth from "../components/modules/OAuth";

const SignUp = () => {
  // ============= Navigation ===============
  const navigate = useNavigate();

  // ============= State ===============
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // ============= Change Handler ===============
  const changeHandler = ({ target: { id, value } }) => {
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  // ============= Submit Function ===============
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
      if (!response.ok)
        throw new Error(responseData.message || "Something went wrong");

      toast.success(responseData.message || "Sign Up successful!");
      navigate("/sign-in");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ============= Motion Function ===============
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // ============= Rendering ===============
  return (
    <motion.div
      className="p-3 max-w-lg mx-auto"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.2 }}
    >
      <motion.h1
        className="text-3xl text-center capitalize font-semibold my-7"
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        Sign Up
      </motion.h1>
      <motion.form
        className="flex flex-col gap-4"
        onSubmit={submitHandler}
        variants={fadeIn}
      >
        <motion.input
          type="text"
          placeholder="Username..."
          className="border p-3 rounded-lg"
          id="username"
          value={formData.username}
          onChange={changeHandler}
          required
          variants={fadeIn}
        />
        <motion.input
          type="email"
          placeholder="Email..."
          className="border p-3 rounded-lg"
          id="email"
          value={formData.email}
          onChange={changeHandler}
          required
          variants={fadeIn}
        />
        <motion.input
          type="password"
          placeholder="Password..."
          className="border p-3 rounded-lg"
          id="password"
          value={formData.password}
          onChange={changeHandler}
          required
          variants={fadeIn}
        />
        <motion.button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variants={fadeIn}
        >
          {loading ? <BeatLoader color="#b18484" size={8} /> : "Sign Up"}
        </motion.button>
        <motion.div variants={fadeIn} className="w-full">
          <OAuth />
        </motion.div>
        <motion.div className="flex gap-2 mt-5" variants={fadeIn}>
          <p>Have an account?</p>
          <Link to="/sign-in">
            <span className="text-blue-700">Sign In</span>
          </Link>
        </motion.div>
        {error && (
          <motion.p
            className="text-white mt-5 text-center bg-red-400 rounded-lg py-2"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.p>
        )}
      </motion.form>
    </motion.div>
  );
};

export default SignUp;
