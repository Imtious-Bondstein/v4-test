import React, { useState } from "react";
import Footer from "@/components/Footer";
import MainLogo from "@/svg/MainLogoSVG";
import Headphone from "@/svg/HeadphoneSVG";
import bgImg from "../public/tmv-bg.jpeg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import AnimatedSVG from "@/components/AnimatedSVG";
import { useRouter } from "next/router";
import AuthLayout from "@/components/layouts/AuthLayout";
import animationImg from "../public/login-animation.png";
import Layout from "@/components/layouts/Layout";
import axios from "@/plugins/axios";
import "../styles/pages/Home.css"

import { ToastContainer, toast } from "react-toastify";

// store action
import { ROUTE_CHANGE, SET_PHONE } from "../store/slices/authSlice.js";
import { useDispatch } from "react-redux";
// import axios from "axios";
import baseUrl from "@/plugins/baseUrl";
import UnprotectedRoute from "@/components/authentication/UnprotectedRoute";

const sendotp = () => {
  const [phone, setPhone] = useState("");
  const [hasFocus, setFocus] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const phone_number = phone.slice(2, 13);

    console.log('phone_number length', phone_number.length);
    if (phone_number.length < 11) {
      errorNotify("Your phone number must be of 11 characters.")
      return
    }

    axios
      .get(`/api/v4/reset-password?phone_number=${phone_number}`)
      .then((res) => {
        dispatch(SET_PHONE({ phone: phone_number }));
        dispatch(ROUTE_CHANGE("resetpassword"));
        console.log('reset pass:', res.data.data);
        router.push("/verify");
        notifySendOTP();
        clearForm(e);
      })
      .catch((err) => {
        console.log('reset pass err:', err);
        errorNotify(err.response.data.user_message)
      });
    console.log(phone.slice(2, 13));
  };

  const clearForm = (e) => {
    e.target.reset();
    console.log("calling");

    setPhone("");
  };

  const notifySendOTP = () => {
    toast.info("An OTP has been sent to your phone number.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    // setTime({ minutes: 3, seconds: 0 });
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
    <div className="w-[450px] p-6 text-center overflow-hidden">
      <div className="flex justify-center pt-12 md:py-0">
        <MainLogo />
      </div>
      <div className="text-center">
        <p className="text-sm md:text-2xl font-bold pb-4 md:pb-0 pt-2 md:pt-0 reset-pass-title"></p>
        <p className="text-sm md:text-base">We will send you a one time password (OTP)</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="pt-24 pb-6 text-left">
          <PhoneInput
            containerStyle={{
              outline: hasFocus ? "2px #F36B24 solid" : "none",
              borderRadius: "12px",
            }}
            inputClass="input text-sm font-bold tmv-shadow"
            inputStyle={{
              border: "none",
              width: "100%",
              height: "50px",
              paddingLeft: "50px",
              borderRadius: "12px",
            }}
            buttonStyle={{
              backgroundColor: "white",
              border: "none",
              paddingLeft: "10px",
              borderRadius: "12px",
              margin: "2px",
            }}
            country={"bd"}
            value={phone}
            onChange={(e) => setPhone(e)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholder=""
          />
          {/* <input onChange={e => setPhone(e.target.value)} className='w-full text-sm px-5 py-4 font-bold tmv-shadow rounded-xl' type="text" placeholder='Phone Number' autoComplete="phone" /> */}
        </div>

        <button
          className="bg-gradient w-full font-bold rounded-xl tmv-shadow submit"
          type="submit"
        >
          Send Code
        </button>
      </form>

      {/* Helpline */}
      <div className="hidden md:block mt-6">
        <p>Call for any assistance</p>
        <div className="flex justify-center items-center">
          <Headphone />
          <p className="text-2xl text-primaryText font-bold ml-3">
            09639595959
          </p>
        </div>
      </div>
      <div className="h-20 md:hidden"></div>
    </div>
  );
};

export default sendotp;

sendotp.getLayout = function getLayout(page) {
  return (
    <UnprotectedRoute>
      <Layout>
        <AuthLayout>{page}</AuthLayout>
      </Layout>
    </UnprotectedRoute>
  );
};
