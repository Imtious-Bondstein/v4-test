import React, { useState, useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import MainLogo from "@/svg/MainLogoSVG";
import Headphone from "@/svg/HeadphoneSVG";
import bgImg from "../public/tmv-bg.jpeg";

import OtpInput from "react18-input-otp";
import AnimatedSVG from "@/components/AnimatedSVG";
import animationImg from "../public/login-animation.png";

import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import AuthLayout from "@/components/layouts/AuthLayout";
import Layout from "@/components/layouts/Layout";
import axios from "@/plugins/axios";
import { useSelector } from "react-redux";

import { useRouter } from "next/router";
// import axios from "axios";
import baseUrl from "@/plugins/baseUrl";
import "../styles/globals.css"
import UnprotectedRoute from "@/components/authentication/UnprotectedRoute";

const verify = () => {
  // states
  const [time, setTime] = useState({ minutes: 3, seconds: 0 });
  const [otp, setOtp] = useState("");
  // const isResendOTP = useRef(false);
  const [isResendOTP, setIsResendOTP] = useState(false);

  const storePhone = useSelector((state) => state.reducer.auth.phone);
  const pre_route = useSelector((state) => state.reducer.auth.pre_route);

  const router = useRouter();

  const handleChange = (enteredOtp) => {
    setOtp(enteredOtp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp.length < 4) {
      errorNotify("Please enter the OTP you received on your phone number to continue.")
      return
    }
    const data = {
      otp: otp,
      phone_number: storePhone,
    };
    if (pre_route === "signup") {
      axios
        .post("/api/v4/verify", data)
        .then((res) => {
          console.log(res.data);

          router.push('/signin')
          notifyVerified()
        })
        .catch(err => {
          // let allErrors = Object.values(err.response.data.errors);
          // allErrors.map((error) => {
          //   errorNotify(error[0]);
          // });
          // console.log(allErrors);
          console.log("err.....", err);
          errorNotify(err.response.data.user_message)
        }).finally(() => clearForm(e))
    } else if (pre_route === 'resetpassword') {
      axios.post('/api/v4/verify-reset-otp', data)
        .then(res => {
          console.log(res.data);
          notifyVerifiedResetPass();
          router.push("/resetpassword");
          clearForm();
        })

        .catch(err => {
          // let allErrors = Object.values(err.response.data.errors);
          // allErrors.map((error) => {
          //   errorNotify(error[0]);
          // });
          // console.log(allErrors);
          errorNotify(err.response.data.user_message)

          console.log("err.....", err);
        });
    }
  };

  const clearForm = () => {
    // e.target.reset();
    console.log("calling");

    setOtp("");
    setTime({ minutes: 3, seconds: 0 });
  };
  const handleResendOTP = () => {
    console.log("resend otp", storePhone);
    const data = {
      phone_number: storePhone,
    };
    axios
      .post("/api/v4/resend-otp", data)
      .then((res) => {
        console.log(res.data);
        notifyResendOTP();
        clearForm();
      })
      .catch(err => {
        // let allErrors = Object.values(err.response.data.errors);
        // allErrors.map((error) => {
        //   errorNotify(error[0]);
        // });
        // console.log(allErrors);
        errorNotify(err.response.data.user_message)
        console.log("err.....", err);
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

  useEffect(() => {
    console.log("previous route:", pre_route);
  }, []);

  const notifyResendOTP = () => {
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
    setTime({ minutes: 3, seconds: 0 });
  };

  const notifyVerified = () => {
    toast.success("Your phone number has been verified. You can now login to your account with your credentials.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setTime({ minutes: 3, seconds: 0 });
  };

  const notifyVerifiedResetPass = () => {
    toast.success("Your phone number has been verified. Please enter your new password.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setTime({ minutes: 3, seconds: 0 });
  };

  useEffect(() => {
    const otpTimeInterval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.seconds === 0 && prevTime.minutes === 0) {
          clearInterval(otpTimeInterval);
          // isResendOTP.current = true;
          // console.log("resend active", isResendOTP.current);
          setIsResendOTP(true)
          return prevTime;
        } else {
          return { minutes: prevTime.minutes - 1, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(otpTimeInterval);
  }, [time]);

  return (
    <div className="text-center w-[450px] px-4 sm:px-0 overflow-hidden">
      <div className="flex justify-center pb-10 pt-12 md:py-0">
        <MainLogo />
      </div>
      <div className="text-center">
        <p className="text-base md:text-2xl font-bold">Enter 4 Digit OTP code</p>
        {storePhone ? (
          <p className="text-sm md:text-base py-4 md:py-0">
            We will send you a verification code to <br className="block md:hidden" /> {storePhone.slice(0, 3)}
            XXXXXXXX
          </p>
        ) : (
          ""
        )}
      </div>
      <div>
        <div className="pt-20 pb-6 md:py-0 md:my-11 text-left flex justify-center">
          <OtpInput
            inputStyle={{
              fontWeight: "700",
              borderRadius: "12px",
              boxShadow:
                "4px 4px 10px rgba(135, 81, 0, 0.05), -4px -4px 13px rgba(255, 255, 255, 0.5), 6px 6px 30px rgba(135, 32, 0, 0.1)",
            }}
            className="otp-verify-input"
            focusStyle={{ outlineColor: "#F36B24" }}
            value={otp}
            onChange={handleChange}
            shouldAutoFocus="true"
            numInputs={4}
            separator={<span className="ml-4 md:ml-8"> </span>}
          />
        </div>

        <div className="flex justify-between text-primaryText md:mb-6 px-4 md:px-0">
          {/* <p>{isResendOTP.toString()}</p> */}
          <button
            disabled={!isResendOTP}
            onClick={handleResendOTP}
            className={`${time.seconds > 0 ? "disabled-resend-otp-btn" : "cursor-pointer hover:text-secondaryText"
              } text-sm md:text-base `}
          >
            Resend OTP
          </button>
          <p>
            {time.minutes}:
            {time.seconds < 10 ? `0${time.seconds}` : time.seconds}
          </p>
        </div>

        <div className="p-5 md:p-0 w-full">
          <button
            onClick={handleSubmit}
            className="bg-gradient w-full font-bold rounded-xl tmv-shadow submit"
            type="submit"
          >
            Verify
          </button>
        </div>
      </div>

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

export default verify;

verify.getLayout = function getLayout(page) {
  return (
    <UnprotectedRoute>
      <Layout>
        <AuthLayout>{page}</AuthLayout>
      </Layout>
    </UnprotectedRoute>
  );
};
