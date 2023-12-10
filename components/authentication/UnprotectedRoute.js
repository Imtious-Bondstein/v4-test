import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const UnprotectedRoute = ({ children }) => {
  const { pathname, push } = useRouter();
  const isAuthenticated = useSelector(
    (state) => state.reducer.auth.isAuthenticated
  );

  useEffect(() => {
    // console.log("pathname---------", pathname);
    if (isAuthenticated) {
      // push("/analytics-and-summary");
      location.replace("/analytics-and-summary");
    }
  }, [isAuthenticated]);

  return !isAuthenticated ? children : null;
};

export default UnprotectedRoute;
