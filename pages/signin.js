import AnimatedSVG from "@/components/AnimatedSVG";
import DownloadApp from "@/components/DownloadApp";
import Footer from "@/components/Footer";
import Helpline from "@/components/Helpline";
import CreditCard from "@/svg/CreditCardSVG";
import MainLogo from "@/svg/MainLogoSVG";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import bgImg from "../public/tmv-bg.jpeg";
import "../styles/pages/Home.css";
import animationImg from "../public/login-animation.png";
import AuthLayout from "@/components/layouts/AuthLayout";
import Layout from "@/components/layouts/Layout";
import axios from "@/plugins/axios";
import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

// store actions
import { useDispatch } from "react-redux";
import { SIGNIN } from "../store/slices/authSlice.js";
import { useRouter } from "next/router";

// cookie
import Cookies from "js-cookie";
import UnprotectedRoute from "@/components/authentication/UnprotectedRoute";
// import axios from "axios";
import baseUrl from "@/plugins/baseUrl";
import EyeSVG from "@/components/SVG/EyeSVG";

const signin = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [keepMeLoggedin, setKeepMeLoggedin] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(identifier, password, keepMeLoggedin);
    const data = {
      identifier: identifier,
      password: password,
    };
    console.log(data);
    axios
      .post("/api/v4/login", data)
      .then((res) => {
        const user = res.data;
        console.log(res.data);
        dispatch(SIGNIN({ token: user.access_token, user: user.data }));
        // router.push("/analytics-and-summary");
        location.replace("/analytics-and-summary");

        clearForm(e);
      })
      .catch((err) => {
        console.log(err);
        errorNotify(err.response.data.user_message);
      });
  };

  const clearForm = (e) => {
    e.target.reset();
    console.log("calling");
    setIdentifier("");
    setPassword("");
    setKeepMeLoggedin(false);
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

  useEffect(() => { }, []);

  return (
    <div className="sm:w-[450px] sm:p-6 text-center z-10 overflow-auto">
      <div className="flex justify-center pb-10 pt-12 md:py-0">
        <MainLogo />
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full text-sm px-5 font-bold tmv-shadow rounded-xl outline-quaternary input"
            type="text"
            placeholder="Email Address/Username"
            autoComplete="username"
            required
          />
        </div>

        <div className="mt-4 relative">
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-sm px-5 font-bold tmv-shadow rounded-xl outline-quaternary input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="new-password"
            required
          />
          {password.length ? (
            <div
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              className="absolute right-4 top-4"
            >
              <EyeSVG />
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="my-6 flex items-center md:justify-center">
          <input
            onChange={() => setKeepMeLoggedin(!keepMeLoggedin)}
            className="checkbox"
            type="checkbox"
            id="loginCheckbox"
          />
          <label
            className="text-sm md:text-normal text-tertiaryText ml-3"
            htmlFor="loginCheckbox"
          >
            {" "}
            Keep me logged in
          </label>
        </div>

        <button
          className="bg-gradient w-full font-bold rounded-xl tmv-shadow submit"
          type="submit"
        >
          Login
        </button>
      </form>

      <div className="text-primaryText mt-6">
        <p className="pb-4 md:pb-0">
          Forgot Password?{" "}
          <Link
            href="/sendotp"
            className="font-semibold md:font-normal md:text-secondaryText hover:text-primaryText"
          >
            Reset
          </Link>
        </p>

        <p className="md:mt-6 py-5 md:py-0">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/signup"
            className="text-secondaryText hover:text-primaryText"
          >
            Sign Up
          </Link>
        </p>
      </div>

      {/* get app */}
      <DownloadApp />

      {/* payment card */}
      <button className="w-full mt-6 flex justify-center items-center bg-secondary hover:bg-white tmv-shadow rounded-xl mb-20 md:mb-0 py-4">
        <CreditCard />
        <p className="text-sm text-primaryText font-bold ml-2.5">
          Go to Payment
        </p>
      </button>

      {/* Helpline */}
      <Helpline />
    </div>
  );
};

export default signin;

signin.getLayout = function getLayout(page) {
  return (
    <UnprotectedRoute>
      <Layout>
        <AuthLayout>{page}</AuthLayout>
      </Layout>
    </UnprotectedRoute>
  );
};
