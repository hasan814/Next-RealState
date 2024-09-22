import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  // ============== Navigate ===============
  const navigate = useNavigate();

  // ============== State ===============
  const [searchTerm, setSearchTerm] = useState("");

  // ============== Selector ===============
  const { currentUser } = useSelector((state) => state.user);

  // ============== Submit Function ===============
  const submitHandler = async (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // ============== Effect ===============
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFormUrl = urlParams.get("searchTerm");
    if (searchTermFormUrl) setSearchTerm(searchTermFormUrl);
  }, []);

  // ============== Rendering ===============
  return (
    <header className="bg-slate-200 shadow-lg">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="flex items-center space-x-2 font-bold text-sm sm:text-xl">
            <img
              src="https://img.icons8.com/papercut/60/real-estate.png"
              alt="logo"
              className="w-6 sm:w-10"
            />
            <span>Real-State</span>
          </h1>
        </Link>
        <form
          onSubmit={submitHandler}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            value={searchTerm}
            placeholder="Search..."
            onChange={(event) => setSearchTerm(event.target.value)}
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4 items-center">
          <Link to={"/"}>
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to={"/about"}>
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <li
                className="
                      p-2
                      list-none
                      rounded-lg 
                      text-white
                      duration-300
                    bg-slate-700
                      transition-all 
                      hover:bg-transparent 
                    hover:text-slate-700
                    "
              >
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
