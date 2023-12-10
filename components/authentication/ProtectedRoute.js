import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { pathname, push } = useRouter();
  const isAuthenticated = useSelector(
    (state) => state.reducer.auth.isAuthenticated
  );
  console.log("isAuthenticated", isAuthenticated);

  useEffect(() => {
    // console.log("pathname---------", pathname);
    if (pathname === "/") {
      //   push("/location");
      push("/analytics-and-summary");
    }
    if (!isAuthenticated) {
      push("/signin");
    }
  }, [isAuthenticated, pathname]);

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
