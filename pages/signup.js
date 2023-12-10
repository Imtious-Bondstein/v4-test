import AnimatedSVG from "@/components/AnimatedSVG";
import Footer from "@/components/Footer";
import MainLogo from "@/svg/MainLogoSVG";
import React, { useState } from "react";
// import bgImg from "../public/tmv-bg.jpeg";
import "../styles/pages/Home.css";
import ReCAPTCHA from "react-google-recaptcha";

import DownloadApp from "@/components/DownloadApp";
import Helpline from "@/components/Helpline";
import Link from "next/link";
import animationImg from "../public/login-animation.png";

import { ToastContainer, toast } from "react-toastify";
import AuthLayout from "@/components/layouts/AuthLayout";
import Layout from "@/components/layouts/Layout";
import axios from "@/plugins/axios";
import { useRouter } from "next/router";

import { useDispatch } from "react-redux";
// store action
import { SET_PHONE, ROUTE_CHANGE } from "../store/slices/authSlice.js";
import UnprotectedRoute from "@/components/authentication/UnprotectedRoute";
// import axios from "axios";
import baseUrl from "@/plugins/baseUrl";
import EyeSVG from "@/components/SVG/EyeSVG";
// import axios from "axios";

const signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsCondition, setTermsCondition] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(username, email, phone, password, confirmPassword, termsCondition);
    const data = {
      username: username,
      email: email,
      phone_number: phone,
      password: password,
      password_confirmation: confirmPassword,
      terms_agreed: termsCondition ? 1 : 0,
    };
    console.log(data);
    axios
      .post("/api/v4/signup", data)
      .then((res) => {
        console.log(res.data);
        dispatch(SET_PHONE({ phone: phone }));
        dispatch(ROUTE_CHANGE("signup"));
        router.push("/verify");
        clearForm(e);
        successNotify();
      })
      .catch((err) => {
        // errorNotify()
        let allErrors = Object.values(err.response.data.errors);
        allErrors.map((error) => {
          errorNotify(error[0]);
        });
        console.log("err.....", allErrors);
      });
  };

  const clearForm = (e) => {
    e.target.reset();
    console.log("calling");
    setUsername("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setTermsCondition(false);
  };

  // google capcha
  function onChange(value) {
    console.log("Captcha value:", value);
  }

  const successNotify = () => {
    toast.success(
      "Your account has been created. Please verify your phone number.",
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
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

  return (
    <div className="w-[450px] px-6 sm:p-6 text-center z-10 overflow-auto">
      <div className="flex justify-center pb-10 pt-12 md:py-0">
        <MainLogo />
      </div>
      <div>
        <p className="text-base font-bold mt-2 mb-4">Signup</p>
      </div>
      <div>
        <p className="text-sm sm:text-base text-center text-primaryText pb-6">
          Welcome to Track My Vehicle. <br className="sm:hidden" /> Track your
          vehicle at any place any time.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            onChange={(e) => setUsername(e.target.value)}
            className="w-full text-sm px-5 py-4 font-bold tmv-shadow rounded-xl outline-quaternary input"
            type="text"
            placeholder="Username"
            autoComplete="username"
            required
          />
        </div>

        <div className="mt-2 md:mt-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-sm px-5 py-4 font-bold tmv-shadow rounded-xl outline-quaternary input"
            type="email"
            placeholder="Email Address"
            autoComplete="email"
            required
          />
        </div>

        <div className="mt-2 md:mt-4">
          <input
            onChange={(e) => setPhone(e.target.value)}
            className="w-full text-sm px-5 py-4 font-bold tmv-shadow rounded-xl outline-quaternary input"
            type="text"
            placeholder="Phone Number"
            autoComplete="phone"
            required
          />
        </div>

        <div className="mt-2 md:mt-4 relative">
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-sm px-5 py-4 font-bold tmv-shadow rounded-xl outline-quaternary input"
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

        <div className="mt-2 md:mt-4 relative">
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full text-sm px-5 py-4 font-bold tmv-shadow rounded-xl outline-quaternary input"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            autoComplete="new-password"
            required
          />
          {confirmPassword.length ? (
            <div
              onMouseDown={() => setShowConfirmPassword(true)}
              onMouseUp={() => setShowConfirmPassword(false)}
              className="absolute right-4 top-4"
            >
              <EyeSVG />
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="my-6 flex items-center justify-center">
          <input
            onChange={() => setTermsCondition(!termsCondition)}
            className="checkbox"
            type="checkbox"
            id="loginCheckbox"
          />
          <label
            className="text-sm sm:text-base text-start text-tertiaryText ml-3"
            htmlFor="loginCheckbox"
          >
            {" "}
            By signing up, I agree to all{" "}
            <Link
              href="#"
              className="text-secondaryText hover:text-tertiaryText"
            >
              terms
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="text-secondaryText hover:text-tertiaryText"
            >
              condition.
            </Link>
          </label>
        </div>

        {/* <Recapcha /> */}
        <div className="flex justify-center my-6">
          <ReCAPTCHA sitekey="Your client site key" onChange={onChange} />
        </div>

        <button
          disabled={!termsCondition ? true : false}
          className={[
            !termsCondition ? "cursor-not-allowed" : "cursor-pointer",
            "bg-gradient w-full py-4 font-bold rounded-xl tmv-shadow",
          ].join(" ")}
          type="submit"
        >
          Sign Up
        </button>
      </form>

      <div className="text-primaryText mt-6 submit">
        <p className="mt-6">
          Already have an Account?{" "}
          <Link href="/signin" className="text-secondaryText">
            Sign In
          </Link>
        </p>
      </div>

      {/* get app */}
      <div className="hidden md:block">
        <DownloadApp />
      </div>

      {/* Helpline */}
      <Helpline />

      <div className="h-10 md:h-20"></div>
    </div>
  );
};

export default signup;

signup.getLayout = function getLayout(page) {
  return (
    <UnprotectedRoute>
      <Layout>
        <AuthLayout>{page}</AuthLayout>
      </Layout>
    </UnprotectedRoute>
  );
};
