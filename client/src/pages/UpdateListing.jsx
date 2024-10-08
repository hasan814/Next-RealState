import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { motion } from "framer-motion";
import { app } from "../firebase";

import toast from "react-hot-toast";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const UpdateListing = () => {
  // ================ Params ==============
  const params = useParams();

  // ================ Navigate ==============
  const navigate = useNavigate();

  // ================ Redux ==============
  const { currentUser } = useSelector((state) => state.user);

  // ================ State =============
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  // ================ Store Image ==============
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
        }
      );
    });
  };

  // ================ Submit Function ==============
  const submitImageHandler = async () => {
    setUploading(true);
    setImageUploadError(null);
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      try {
        const urls = await Promise.all(files.map(storeImage));
        setFormData((prev) => ({
          ...prev,
          imageUrls: prev.imageUrls.concat(urls),
        }));
        toast.success("Images uploaded successfully");
      } catch (error) {
        setImageUploadError("Image upload failed. Ensure files are <2MB each.");
        console.log(error);
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError("Please upload between 1 and 6 images.");
      setUploading(false);
    }
  };

  // ================ Remove Function ==============
  const removeImageHandler = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  // ================ Change Function ==============
  const changeHandler = (event) => {
    const { id, value, checked, type } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [id]: newValue });
  };

  // ================ Submit Function ==============
  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must Upload at least one Image!");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount Price must be lower than Regular Price");

      setLoading(true);
      setError(false);

      const response = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const responseData = await response.json();
      if (!response.ok) setError(responseData);

      toast.success(responseData.message);
      navigate(`/listing/${responseData.updatedListing._id}`);
    } catch (error) {
      console.log(error);
      setError("An error occurred while updating the listing.");
      setLoading(false);
    }
  };

  // ================ Effect ==============
  useEffect(() => {
    const fetchData = async () => {
      const listingId = params.listingId;
      const response = await fetch(`/api/listing/get/${listingId}`);
      const responseData = await response.json();
      if (!response.ok) {
        toast.error(responseData.message);
        return;
      }
      setFormData(responseData);
    };
    fetchData();
  }, [params.listingId]);

  // ================ Motion ==============
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // ================ Store Image ==============
  return (
    <motion.main
      className="mx-auto p-6 max-w-4xl shadow-lg rounded-lg my-10"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.3 }}
    >
      <motion.h1
        className="text-4xl font-bold text-center my-8 text-blue-600"
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        Update a Listing
      </motion.h1>
      <motion.form
        onSubmit={submitHandler}
        className="flex flex-col gap-8 sm:flex-row"
        variants={fadeIn}
      >
        <div className="flex-1 flex flex-col gap-6">
          <label className="block font-medium text-gray-700">Name</label>
          <motion.input
            id="name"
            type="text"
            value={formData.name}
            onChange={changeHandler}
            placeholder="Name of Listing"
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            variants={fadeIn}
          />
          <label className="block font-medium text-gray-700">Description</label>
          <motion.textarea
            id="description"
            rows="4"
            onChange={changeHandler}
            value={formData.description}
            placeholder="Description of Listing"
            className="border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            variants={fadeIn}
          />
          <label className="block font-medium text-gray-700">Address</label>
          <motion.input
            type="text"
            id="address"
            placeholder="Address"
            value={formData.address}
            onChange={changeHandler}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            variants={fadeIn}
          />
          <label className="block font-medium text-gray-700">
            Property Type
          </label>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2">
              <motion.input
                id="type"
                name="type"
                type="radio"
                value="sell"
                onChange={changeHandler}
                checked={formData.type === "sell"}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                variants={fadeIn}
              />
              <span>Sell</span>
            </label>
            <label className="flex items-center gap-2">
              <motion.input
                id="type"
                name="type"
                type="radio"
                value="rent"
                onChange={changeHandler}
                checked={formData.type === "rent"}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                variants={fadeIn}
              />
              <span>Rent</span>
            </label>
            <label className="flex items-center gap-2">
              <motion.input
                id="offer"
                type="checkbox"
                onChange={changeHandler}
                checked={formData.offer}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                variants={fadeIn}
              />
              <span>Offer</span>
            </label>
          </div>
        </div>

        <motion.div className="flex-1 flex flex-col gap-6" variants={fadeIn}>
          <p className="font-semibold text-gray-700">
            Images:
            <span className="font-normal text-gray-500 ml-2">
              The First image will be the cover (max 6)
            </span>
          </p>
          <div className="border border-gray-300 rounded-lg p-4">
            {imageUploadError && (
              <p className="text-red-700 text-sm">{imageUploadError}</p>
            )}
            <label
              onClick={submitImageHandler}
              htmlFor="images"
              className="cursor-pointer flex items-center justify-center gap-3 text-blue-600 border border-blue-600 rounded-lg py-2 px-4 transition-all hover:bg-blue-600 hover:text-white"
            >
              {uploading ? <BeatLoader color="#a58080" /> : "Upload Image"}
              <input
                multiple
                id="images"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(event) => setFiles([...event.target.files])}
              />
            </label>
            {formData.imageUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {formData.imageUrls.map((url, index) => (
                  <motion.div
                    key={uuidv4()}
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={url}
                      alt="listing"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageHandler(index)}
                      className="mt-2 text-red-700 rounded-lg uppercase hover:opacity-75"
                    >
                      Delete
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          <div className="text-center mt-8">
            <motion.button
              type="submit"
              disabled={loading || uploading}
              className="bg-blue-600 w-full text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              whileHover={{ scale: 1.05 }}
              variants={fadeIn}
            >
              {loading ? <BeatLoader color="#a58080" /> : "Update Listing"}
            </motion.button>
            {error && <p className="text-red-700 text-sm">{error}</p>}
          </div>
        </motion.div>
      </motion.form>
    </motion.main>
  );
};

export default UpdateListing;
