import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";
import axios from "@/plugins/axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { async } from "regenerator-runtime";
import { useDispatch, useSelector } from "react-redux";
import { SIGNIN } from "@/store/slices/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DownArrowSVG from "@/components/SVG/DownArrowSVG";
import baseUrl from "@/plugins/baseUrl";
import CrossSVG from "@/svg/CrossSVG";
import SearchCar from "@/svg/SearchCarSVG";
import Search from "@/svg/SearchSVG";
import LoadingScreen from "@/components/LoadingScreen";

const impersonate = () => {
  const [identifier, setIdentifier] = useState("");
  const [clicked, setClicked] = useState(false);
  const [userdData, setUserData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.reducer.auth.user);

  const handleInput = async () => {
    setClicked(!clicked);
    await axios
      .get("/api/v4/user-list")
      .then((res) => {
        setUserData(res.data.data);
        setAllData(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        errorNotify(err.response.data.user_message);
        errorNotify(err.response.data.app_message);
      });
  };

  const handleUser = async (e) => {
    setIdentifier(e);
    setClicked(false);
  };

  const handleReset = () => {
    setIdentifier("");
  };

  // SUBMIT THE SELECTED USER DATA  & CALL API =========================
  const handleSubmit = async () => {
    // identifier.length
    //   ? window.open(
    //       "http://localhost:3000/analytics-and-summary",
    //       "_blank",
    //       "noopener,noreferrer,private"
    //     )
    //   : "";

    // DATA
    const data = {
      identifier: identifier,
    };

    await axios
      .post("/api/v4/switch-user", data)
      .then((res) => {
        const user = res.data;
        console.log(res.data, "Data====");
        dispatch(SIGNIN({ token: user.access_token, user: user.data }));
        location.replace("/analytics-and-summary");
        // router.push("/analytics-and-summary");
      })
      .catch((err) => {
        console.log(err);
        errorNotify(err.response.data.user_message);
        errorNotify(err.response.data.app_message);
      });
  };

  const errorNotify = (mgs) => {
    toast.error(mgs, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);

    const filteredUsers = userdData.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setUserData(filteredUsers);
  };

  useEffect(() => {
    searchQuery.length <= 0 ? setUserData(allData) : "";
  }, [searchQuery]);

  return (
    <>
      <ToastContainer />
      {user.id === 1 ? (
        <div className="pb-10">
          <h1 className="text-lg md:text-[32px] text-primaryText font-bold mb-3 sm:mb-5">
            Impersonate Another User
          </h1>
          <div className="bg-white p-5 sm:p-10 rounded-xl h-[100vh]">
            <div className="w-full sm:w-[400px] overflow-hidden">
              <p className="text-tmvDarkGray font-bold mb-2">
                Username Or Email:
              </p>
              <div
                className={`w-full border-2 px-2 py-2 ${
                  clicked ? "rounded-t-lg " : "rounded-lg"
                } text-tmvGray outline-quaternary flex justify-between items-center cursor-pointer`}
                onClick={() => handleInput()}
              >
                {identifier ? identifier : "Select User"}
                <DownArrowSVG />
              </div>
              <div
                className={`${
                  clicked ? "overflow-y-scroll" : "overflow-none"
                } max-h-[160px] duration-300 shadow-md rounded-b-lg`}
              >
                {clicked === true ? (
                  <>
                    <div className="relative ">
                      <input
                        type="text"
                        className="w-full border-2 px-2 py-2 cursor-pointer outline-quaternary"
                        placeholder="Search"
                        onChange={(e) => handleSearch(e)}
                        autoFocus
                      />
                      <div className="absolute top-3 right-4">
                        <Search />
                      </div>
                    </div>

                    {userdData?.map(({ username }, index) => {
                      return (
                        <div
                          key={index}
                          className="w-full border-b-2 border-x-2 px-2 py-2 hover:bg-tmvGray/60 cursor-pointer"
                          onClick={() => handleUser(username)}
                        >
                          {username}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  ""
                )}
              </div>

              <p className="text-tmvGray text-[12px] mt-2">
                *Type in the sign in name or email address of another user to
                impersonate for
              </p>

              {/* BUTTONS START */}
              <div className="w-full flex justify-between space-x-2 xs:space-x-0 items-center py-5">
                <button
                  onClick={() => handleReset()}
                  className={`${
                    identifier.length <= 0
                      ? "bg-[#00FF00]/60 text-primaryText/60 cursor-not-allowed"
                      : "bg-[#00FF00] text-primaryText hover:shadow-xl"
                  } h-[40px] xs:h-[48px] w-1/2 xs:w-[100px] rounded-xl shadow-sm  duration-300 text-sm`}
                >
                  Reset
                </button>
                <button
                  onClick={() => handleSubmit()}
                  className={`${
                    identifier.length <= 0
                      ? "bg-primary/60 text-primaryText/60 cursor-not-allowed"
                      : "bg-primary text-primaryText hover:shadow-xl"
                  } fill-primaryText flex items-center justify-center gap-3 text-sm rounded-lg w-1/2 xs:w-[120px] h-[40px] xs:h-[48px] primary-shadow hover:shadow-primary/60 duration-300`}
                >
                  Impersonate
                </button>
              </div>
              {/* BUTTONS ENDS */}
              <p className="text-tmvGray text-[12px] my-2">
                Your own session will end a new session will be started for the
                impersonated user.
              </p>
              <p className="text-tmvDarkGray text-[12px] my-2 font-bold">
                You will need to sign back in for your own account.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <LoadingScreen />
        // <p className="h-[90vh] w-full flex items-center justify-center text-tmvRed">
        //   Well Played Bro 😎
        // </p>
      )}
    </>
  );
};

export default impersonate;

impersonate.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page}</DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
