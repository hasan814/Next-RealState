import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { app } from "../firebase";

import toast from "react-hot-toast";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/userSlice";

const Profile = () => {
  // ============== Dispatch =============
  const dispatch = useDispatch();

  // ============== Ref =============
  const fileRef = useRef();

  // ============== State =============
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);

  // ============== Redux =============
  const { currentUser, loading, error } = useSelector((state) => state.user);

  // ============== Effect =============
  useEffect(() => {
    if (file) uploadFileHandler(file);
  }, [file]);

  // ============== Upload Function =============
  const uploadFileHandler = useCallback((file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevData) => ({
            ...prevData,
            avatar: downloadURL,
          }));
          setFileUploadError(null);
        });
      }
    );
  }, []);

  // ============== Change Handler =============
  const changeHandler = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  // ============== submit Handler =============
  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      dispatch(updateUserStart());
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (responseData) {
        dispatch(updateUserSuccess(responseData.user));
        toast.success(responseData.message);
      } else {
        dispatch(updateUserFailure(responseData.message));
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // ============== Rendering =============
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
        <input
          hidden
          type="file"
          ref={fileRef}
          accept="image/*"
          onChange={(event) => setFile(event.target.files[0])}
        />
        <img
          alt="avatar"
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser?.avatar}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload (image must be less than 2 MB)
            </span>
          ) : (
            <>
              {filePercentage > 0 && filePercentage < 100 ? (
                <span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>
              ) : filePercentage === 100 ? (
                <span className="text-green-700">
                  Image Successfully Uploaded!
                </span>
              ) : (
                ""
              )}
            </>
          )}
        </p>
        <input
          type="text"
          id="username"
          placeholder="Username.."
          onChange={changeHandler}
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
        />
        <input
          id="email"
          type="email"
          placeholder="Email.."
          onChange={changeHandler}
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
        />
        <input
          id="password"
          type="password"
          onChange={changeHandler}
          placeholder="Password..."
          className="border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="uppercase bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-80"
        >
          {loading ? <BeatLoader color="#a58080" /> : "update"}
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
