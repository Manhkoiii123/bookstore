import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotPermitted from "./NotPermitted";
const RoleBaseRoute = (props) => {
  //có vào trang admin ko
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const user = useSelector((state) => state.account.user);
  const role = user.role;
  if (isAdminRoute && role === "ADMIN") {
    return <>{props.children}</>;
  } else {
    return <NotPermitted></NotPermitted>;
  }
};
const ProtectedRoute = (props) => {
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  return (
    <>
      {isAuthenticated === true ? (
        <>
          <RoleBaseRoute>{props.children}</RoleBaseRoute>
        </>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
};
export default ProtectedRoute;
