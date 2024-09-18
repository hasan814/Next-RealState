import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { app } from "../firebase";

const Profile = () => {
  // ============ State =================
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [loading, setLoading] = useState(false);

  // ============ Ref =================
  const fileRef = useRef();

  // ============ Redux =================
  const { currentUser } = useSelector((state) => state.user);

  // ============ Effect =================
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        avatar: currentUser.avatar || "",
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (file) uploadFileHandler(file);
  }, [file]);

  // ============ Function =================
  const uploadFileHandler = (file) => {
    setLoading(true);
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
        setFileUploadError(true);
        setLoading(false);
        console.error("File upload failed:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevData) => ({
            ...prevData,
            avatar: downloadURL,
          }));
          setLoading(false);
          setFileUploadError(false);
        });
      }
    );
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form data submitted: ", formData);
  };

  // ============ Rendering =================
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
        <div className="my-3 text-center">
          {filePercentage > 0 && filePercentage < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              {filePercentage}%
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${filePercentage}%` }}
              ></div>
            </div>
          )}
          {filePercentage === 100 && (
            <span className="text-white bg-green-500 py-2 rounded-lg px-1">
              File upload Successfully
            </span>
          )}
          {fileUploadError && (
            <span className="text-red-600">File upload failed</span>
          )}
        </div>
        <input
          type="text"
          id="username"
          value={formData.username || ""}
          onChange={handleInputChange}
          placeholder="Username.."
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          id="email"
          value={formData.email || ""}
          onChange={handleInputChange}
          placeholder="Email.."
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          id="password"
          value={formData.password || ""}
          onChange={handleInputChange}
          placeholder="Password..."
          className="border p-3 rounded-lg"
        />
        <button
          type="submit"
          className="uppercase bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Update"}
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
