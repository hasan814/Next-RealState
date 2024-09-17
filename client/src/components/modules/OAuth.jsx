import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { signInSuccess, signInFailure } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { app } from "../../firebase";

import toast from "react-hot-toast";

const OAuth = () => {
  // ============ Navigate ==============
  const navigate = useNavigate();

  // ============ Dispatch ==============
  const dispatch = useDispatch();

  // ============ Selector ==============
  const { loading } = useSelector((state) => state.user);

  // ============ Function ==============
  const googleHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const responseData = await response.json();

      if (!response.ok)
        throw new Error(responseData.message || "Google sign-in failed.");

      console.log(responseData);
      dispatch(signInSuccess(responseData));
      navigate("/");
      toast.success("Signed in successfully!");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  // ============ Rendering ==============
  return (
    <>
      <button
        type="button"
        onClick={googleHandler}
        disabled={loading}
        className="flex items-center gap-5 justify-center p-3 my-2 bg-red-500 rounded-lg uppercase hover:bg-red-400 disabled:opacity-80"
      >
        {loading ? (
          "Loading..."
        ) : (
          <>
            <FcGoogle /> Continue with Google
          </>
        )}
      </button>
    </>
  );
};

export default OAuth;
