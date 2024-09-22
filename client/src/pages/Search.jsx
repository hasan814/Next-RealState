import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

import ListingItem from "../components/modules/ListingItem";

const Search = () => {
  // =============== Navigate ==============
  const navigate = useNavigate();

  // =============== State ==============
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  // =============== Change Function ==============
  const changeHandler = (event) => {
    const { id, value, checked } = event.target;

    if (id === "all" || id === "rent" || id === "sale")
      setSidebarData({ ...sidebarData, type: id });

    if (id === "searchTerm")
      setSidebarData({ ...sidebarData, searchTerm: value });

    if (id === "parking" || id === "furnished" || id === "offer")
      setSidebarData({
        ...sidebarData,
        [id]: checked || checked === "true" ? true : false,
      });

    if (id === "sort_order") {
      const sort = value.split("_")[0] || "created-at";
      const order = value.split("_")[1] || "desc";
      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  // =============== Effect ==============
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    )
      setSidebarData({
        type: typeFromUrl || "",
        order: orderFromUrl || "desc",
        sort: sortFromUrl || "created_at",
        searchTerm: searchTermFromUrl || "",
        offer: offerFromUrl === "true" ? true : false,
        parking: parkingFromUrl === "type" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
      });

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const response = await fetch(`/api/listing/get?${searchQuery}`);
      const responseData = await response.json();
      if (responseData.length > 8) setShowMore(true);
      else setShowMore(false);
      setListings(responseData);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  // =============== Submit Function ==============
  const submitHandler = async (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // =============== Show Function ==============
  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const response = await fetch(`/api/listing/get?${searchQuery}`);
    const responseData = await response.json();
    if (responseData < 9) setShowMore(false);
    setListings([...listings, ...responseData]);
  };

  // =============== Rendering ==============
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen md:col-span-1 bg-gray-50">
        <form onSubmit={submitHandler} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="searchTerm" className="mb-2 font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              value={sidebarData.searchTerm}
              onChange={changeHandler}
              placeholder="Enter search term..."
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-2">Type:</label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <input
                  id="all"
                  type="checkbox"
                  className="w-5 h-5"
                  onChange={changeHandler}
                  checked={sidebarData.type === "all"}
                />
                <label htmlFor="all" className="ml-2">
                  Rent & Sale
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="rent"
                  type="checkbox"
                  className="w-5 h-5"
                  onChange={changeHandler}
                  checked={sidebarData.type === "rent"}
                />
                <label htmlFor="rent" className="ml-2">
                  Rent
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="sale"
                  type="checkbox"
                  className="w-5 h-5"
                  onChange={changeHandler}
                  checked={sidebarData.type === "sale"}
                />
                <label htmlFor="sale" className="ml-2">
                  Sale
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="offer"
                  type="checkbox"
                  className="w-5 h-5"
                  onChange={changeHandler}
                  checked={sidebarData.offer}
                />
                <label htmlFor="offer" className="ml-2">
                  Offer
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-2">Amenities:</label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <input
                  id="parking"
                  type="checkbox"
                  className="w-5 h-5"
                  onChange={changeHandler}
                  checked={sidebarData.parking}
                />
                <label htmlFor="parking" className="ml-2">
                  Parking
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="furnished"
                  type="checkbox"
                  className="w-5 h-5"
                  onChange={changeHandler}
                  checked={sidebarData.furnished}
                />
                <label htmlFor="furnished" className="ml-2">
                  Furnished
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="sort_order" className="font-semibold mb-2">
              Sort By:
            </label>
            <select
              id="sort_order"
              onChange={changeHandler}
              defaultValue={"created_at_desc"}
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={"regularPrice_desc"}>Price High to Low</option>
              <option value={"regularPrice_asc"}>Price Low to High</option>
              <option value={"createdAt_desc"}>Latest</option>
              <option value={"createdAt_asc"}>Oldest</option>
            </select>
          </div>
          <button className="bg-blue-600 text-white p-3 rounded-lg uppercase hover:bg-blue-700 transition duration-200">
            Search
          </button>
        </form>
      </div>
      <div className="md:col-span-3 p-7">
        <h1 className="text-3xl font-semibold text-gray-800 border-b pb-3">
          Listing Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">
              No Listings found. Start a new Search above
            </p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              <BeatLoader />
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={uuidv4()} listing={listing} />
            ))}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 w-full text-center"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
