import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  // ============= State ==============
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState(null);

  // ============= Effect ==============
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const response = await fetch(`/api/user/${listing.userRef}`);
        if (!response.ok) {
          throw new Error("Failed to fetch landlord data.");
        }
        const responseData = await response.json();
        setLandlord(responseData);
      } catch (error) {
        console.log(error);
        setError("Could not fetch landlord details.");
      }
    };
    if (listing?.userRef) {
      fetchLandlord();
    }
  }, [listing?.userRef]);

  // ============= Change Function ==============
  const changeHandler = (event) => {
    setMessage(event.target.value);
  };

  // ============= Rendering ==============
  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <>
      {landlord && (
        <div className="p-4 bg-white shadow-lg border mt-4 rounded-lg flex flex-col gap-2">
          <p className="text-gray-700 font-medium">
            Contact
            <span className="text-indigo-600 font-bold">
              {landlord.username}
            </span>
            for the listing:
            <span className="text-indigo-600 font-bold">
              {listing.name.toLowerCase()}
            </span>
          </p>
          <textarea
            rows={"2"}
            id="message"
            name="message"
            value={message}
            onChange={changeHandler}
            placeholder="Enter Your Message here..."
            className="w-full border p-3 rounded-lg mt-2"
          ></textarea>
          <Link
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

Contact.propTypes = {
  listing: PropTypes.shape({
    name: PropTypes.string.isRequired,
    userRef: PropTypes.string.isRequired,
  }).isRequired,
};

export default Contact;
