import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { app } from "../firebase";

import toast from "react-hot-toast";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
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
  const [userListings, setUserListings] = useState([]);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [showListingError, setShowListingError] = useState(false);

  // ============== Redux =============
  const { currentUser, loading } = useSelector((state) => state.user);

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

  // ============== delete Handler =============
  const deleteUserHandler = async () => {
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const responseData = await response.json();
      if (responseData) {
        dispatch(deleteUserSuccess(responseData));
        toast.success(responseData.message);
      } else {
        dispatch(updateUserFailure(responseData.message));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // ============== Sign Out Handler =============
  const signOutHandler = async () => {
    try {
      dispatch(signOutUserStart());
      const response = await fetch(`/api/auth/signout`);
      const responseData = await response.json();
      console.log(responseData);
      if (responseData) {
        dispatch(signOutUserSuccess(responseData));
        toast.success(responseData.message);
      } else {
        dispatch(signOutUserFailure(responseData.message));
      }
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  // ============== Show Listing Function =============
  const showListingHandler = async () => {
    try {
      setShowListingError(false);
      const response = await fetch(`/api/user/listings/${currentUser._id}`);
      const responseData = await response.json();
      if (!response.ok) {
        setShowListingError(true);
        return;
      }
      setUserListings(responseData);
    } catch (error) {
      toast.error(error.message);
      setShowListingError(true);
    }
  };

  // ============== Delete Listing =============
  const deleteListingHandler = async (listingId) => {
    try {
      const response = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const responseData = await response.json();
      if (!response.ok) {
        toast.error(responseData.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      toast.success(responseData.message);
    } catch (error) {
      console.log(error);
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
        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Create List
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={deleteUserHandler}
        >
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={signOutHandler}>
          Sign Out
        </span>
      </div>
      <button onClick={showListingHandler} className="text-green-700 w-full">
        Show Listing
      </button>
      <p className="text-red-700 mt-5">
        {showListingError ? "Error showing Listing" : ""}
      </p>
      {userListings?.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center my-7 text-2xl font-semibold">
            Your Listing
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border shadow-lg rounded-lg p-3 flex justify-between items-center gap-3"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing"
                  className="w-16 h-16 object-contain rounded-lg"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  className="text-red-700 uppercase"
                  onClick={() => deleteListingHandler(listing._id)}
                >
                  Delete
                </button>
                <button className="text-green-700 uppercase">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
