import { FaBath, FaBed, FaParking, FaHome, FaTag } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MdLocationOn } from "react-icons/md";
import { useSelector } from "react-redux";
import { MoonLoader } from "react-spinners";
import { Navigation } from "swiper/modules";
import { GiPriceTag } from "react-icons/gi";
import { useParams } from "react-router-dom";
import SwiperCore from "swiper";
import { motion } from "framer-motion"; // Import framer-motion
import "swiper/css/bundle";
import Contact from "../components/modules/Contact";

// Enable Swiper's navigation module

const Listing = () => {
  // ================ Swiper ================
  SwiperCore.use([Navigation]);

  // ================ Redux ================
  const { currentUser } = useSelector((state) => state.user);

  // ================ State ================
  const [error, setError] = useState(false);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState(false);

  // ================ Params ================
  const { listingId } = useParams();

  // ================ Effect ================
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);
        setListing(null);
        const response = await fetch(`/api/listing/get/${listingId}`);
        const responseData = await response.json();
        if (!response.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(responseData);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.log(error.message);
      }
    };
    fetchListing();
  }, [listingId]);

  // ================ Motion  ================
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // ================ Rendering  ================
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <MoonLoader size={50} color="#4A90E2" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-red-500 text-center mt-5">
        <p>Failed to load the listing. Please try again later.</p>
      </div>
    );
  }

  // No listing found
  if (!listing) {
    return (
      <div className="text-center mt-5">
        <p>No listing found.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-5"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.2 }}
    >
      {/* Swiper Section */}
      <motion.div className="w-full mb-8" variants={fadeIn}>
        <Swiper navigation className="h-96" loop>
          {listing.imageUrls && listing.imageUrls.length > 0 ? (
            listing.imageUrls.map((url) => (
              <SwiperSlide key={uuidv4()}>
                <motion.img
                  src={url}
                  alt={`Image of listing ${listing.name}`}
                  className="w-full h-full object-contain mix-blend-multiply rounded-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <motion.img
                src="/path/to/placeholder.jpg"
                alt="Placeholder"
                className="w-full h-full object-cover mix-blend-multiply rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </SwiperSlide>
          )}
        </Swiper>
      </motion.div>

      {/* Listing Details Section */}
      <motion.div
        className="bg-white shadow-lg rounded-lg p-6"
        variants={slideUp}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          {listing.name}
        </h1>
        <div className="flex items-center text-gray-600 mb-4">
          <MdLocationOn className="text-red-500 mr-2" size={20} />
          <p className="text-lg">{listing.address}</p>
        </div>
        <p className="text-gray-700 mb-4 text-justify">
          <strong>Description:</strong> {listing.description}
        </p>

        <div className="flex items-center mb-4">
          <GiPriceTag className="text-green-600 mr-2" size={20} />
          <p className="text-lg">
            <strong>Price:</strong> ${listing.regularPrice}
            {listing.offer && (
              <span className="text-green-500 ml-2">
                (Discount: ${listing.discountPrice})
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-4 text-gray-700">
          <div className="flex items-center">
            <FaBath className="text-blue-500 mr-2" size={20} />
            <p>{listing.bathrooms} Bathrooms</p>
          </div>
          <div className="flex items-center">
            <FaBed className="text-purple-500 mr-2" size={20} />
            <p>{listing.bedrooms} Bedrooms</p>
          </div>
          <div className="flex items-center">
            <FaParking className="text-yellow-500 mr-2" size={20} />
            <p>{listing.parking ? "Parking Available" : "No Parking"}</p>
          </div>
          <div className="flex items-center">
            <FaHome className="text-pink-500 mr-2" size={20} />
            <p>{listing.type}</p>
          </div>
        </div>

        <div className="flex items-center text-gray-700">
          <FaTag className="text-green-500 mr-2" size={20} />
          <p>
            <strong>Offer:</strong> {listing.offer ? "Yes" : "No"}
          </p>
        </div>
        {currentUser && listing.userRef !== currentUser._id && !contact && (
          <motion.button
            className="bg-slate-700 w-full my-4 text-white rounded-lg uppercase hover:opacity-95 p-3"
            onClick={() => setContact(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Landlord
          </motion.button>
        )}
        {contact && <Contact listing={listing} />}
      </motion.div>
    </motion.div>
  );
};

export default Listing;
