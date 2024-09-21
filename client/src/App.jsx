import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import PrivateRoute from "./components/modules/PrivateRoute";
import Profile from "./pages/Profile";
import Listing from "./pages/Listing";
import SignIn from "./pages/SignIn";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Home from "./pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
