import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

import ListingItem from "../components/modules/ListingItem";
import "swiper/css/navigation";
import "swiper/css";

const Home = () => {
  // ============== State =============
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  // ============== Effect =============
  useEffect(() => {
    const fetchOfferListings = async () => {
      const response = await fetch(`/api/listing/get?offer=true&limit=4`);
      const responseData = await response.json();
      setOfferListings(responseData);
      fetchRentListings();
    };

    const fetchRentListings = async () => {
      const response = await fetch(`/api/listing/get?type=rent&limit=4`);
      const responseData = await response.json();
      setRentListings(responseData);
      fetchSaleListings();
    };

    const fetchSaleListings = async () => {
      const response = await fetch("/api/listing/get?type=sale&limit=4");
      const responseData = await response.json();
      setSaleListings(responseData);
    };

    fetchOfferListings();
  }, []);

  // ============== Rendering =============
  return (
    <div className="max-w-screen-xl mx-auto p-4">
      {/* Top Section */}
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Find Your Next <span className="text-blue-600">Perfect</span> Place
          with Ease
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Real Estate is the best place to find your next home. <br />
          We have a wide range of properties for you to choose from.
        </p>
        <Link
          to="/search"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Let&apos;s get Started...
        </Link>
      </div>

      {/* Swiper Section */}
      {offerListings && offerListings.length > 0 && (
        <div className="my-10">
          <Swiper
            navigation
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={1}
          >
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <Link to={`/listing/${listing._id}`}>
                  <div
                    style={{
                      backgroundImage: `url(${listing.imageUrls[0]})`,
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                    }}
                    className="h-[500px] rounded-lg shadow-lg transition-transform hover:scale-105"
                  ></div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Listings Section */}
      <div className="flex flex-col gap-12 my-10">
        {/* Offer Listings */}
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Recent Offers</h2>
              <Link
                to="/search?offer=true"
                className="text-blue-600 hover:underline"
              >
                Show more offers
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Rent Listings */}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Recent Places for Rent</h2>
              <Link
                to="/search?type=rent"
                className="text-blue-600 hover:underline"
              >
                Show more places for rent
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Sale Listings */}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Recent Places for Sale</h2>
              <Link
                to="/search?type=sale"
                className="text-blue-600 hover:underline"
              >
                Show more places for sale
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
