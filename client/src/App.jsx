import { BrowserRouter, Route, Routes } from "react-router-dom";

import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Home from "./pages/Home";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/modules/PrivateRoute";
import CreateListing from "./pages/CreateListing";

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
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
