const Search = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen md:col-span-1 bg-gray-50">
        <form className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="searchTerm" className="mb-2 font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Enter search term..."
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-2">Type:</label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <input type="checkbox" id="all" className="w-5 h-5" />
                <label htmlFor="all" className="ml-2">
                  Rent & Sale
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="rent" className="w-5 h-5" />
                <label htmlFor="rent" className="ml-2">
                  Rent
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="sale" className="w-5 h-5" />
                <label htmlFor="sale" className="ml-2">
                  Sale
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="offer" className="w-5 h-5" />
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
                <input type="checkbox" id="parking" className="w-5 h-5" />
                <label htmlFor="parking" className="ml-2">
                  Parking
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="furnished" className="w-5 h-5" />
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
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Price High to Low</option>
              <option>Price Low to High</option>
              <option>Latest</option>
              <option>Oldest</option>
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
        <div className="mt-6">
          <p className="text-gray-500">
            No listings found. Start a new search above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Search;
