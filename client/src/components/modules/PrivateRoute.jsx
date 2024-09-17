import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  // ============ Selector ===============
  const { currentUser } = useSelector((state) => state.user);

  // ============ Rendering ===============
  return currentUser ? <Outlet/> : <Navigate to='/sign-in'/>;
};

export default PrivateRoute;
