import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import MainLogo from "@/svg/MainLogoSVG";
import Headphone from "@/svg/HeadphoneSVG";
import bgImg from "../public/tmv-bg.jpeg";
import "../styles/pages/Home.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import AnimatedSVG from "@/components/AnimatedSVG";
import AuthLayout from "@/components/layouts/AuthLayout";
import animationImg from "../public/login-animation.png";
import Layout from "@/components/layouts/Layout";
import { useSelector } from "react-redux";
import axios from "@/plugins/axios";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
import baseUrl from "@/plugins/baseUrl";
import UnprotectedRoute from "@/components/authentication/UnprotectedRoute";
import EyeSVG from "@/components/SVG/EyeSVG";

const resetpassword = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [keepMeLogin, setKeepMeLogin] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const storePhone = useSelector((state) => state.reducer.auth.phone);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(phone, confirmPassword, password);
    const data = {
      phone_number: storePhone,
      password: password,
      password_confirmation: confirmPassword,
    };

    axios
      .post("/api/v4/reset-password", data)
      .then((res) => {
        console.log(res.data);
        router.push("/signin");
        clearForm(e);
        notifyPassChange()
      })
      .catch((err) => {
        // errorNotify()
        let allErrors = Object.values(err.response.data.errors);
        allErrors.map((error) => {
          errorNotify(error[0]);
        });
        console.log("err.....", allErrors);
      });
    // clearForm(e);
  };

  const clearForm = (e) => {
    e.target.reset();
    console.log("calling");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    // setKeepMeLogin(false);
  };

  const notifyPassChange = () => {
    toast.success("Your password has been changed. You can now login to your account with your new credentials.", {
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
    storePhone ? setPhone("88" + storePhone) : "";
  }, []);
  return (
    <>
      <div className="w-[450px] p-6 text-center">
        {/* <div className='md:max-w-[450px] p-6 w-full text-center'> */}
        <div className="flex justify-center pt-20 md:py-0">
          <MainLogo />
        </div>
        <div className="text-center mb-11">
          <p className="text-sm md:text-2xl font-bold pb-4 md:pb-0 pt-2 md:pt-0">Password Reset</p>
          <p className="text-sm md:text-base">Create a new password and secure your account.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-16 text-left">
            <PhoneInput
              inputClass="input text-sm font-bold tmv-shadow"
              inputStyle={{
                backgroundColor: "#FFFAE6",
                border: "none",
                width: "100%",
                height: "50px",
                paddingLeft: "50px",
                borderRadius: "12px",
              }}
              buttonStyle={{
                backgroundColor: "#FFFAE6",
                border: "none",
                paddingLeft: "10px",
                borderRadius: "12px",
              }}
              country={"bd"}
              value={phone}
              onChange={(e) => setPhone(e)}
            />
            {/* <input onChange={e => setPhone(e.target.value)} className='w-full text-sm px-5 py-4 font-bold tmv-shadow rounded-xl' type="text" placeholder='Phone Number' autoComplete="phone" /> */}
          </div>

          <div className="mt-4 relative">
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm px-5 py-4 font-bold tmv-shadow rounded-xl input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="new-password"
            />
            {password.length ? <div onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)} className="absolute right-4 top-4">
              <EyeSVG />
            </div> : ''}
          </div>

          <div className="mt-4 relative">
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full text-sm px-5 py-4 font-bold tmv-shadow rounded-xl input"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              autoComplete="new-password"
            />
            {confirmPassword.length ? <div onMouseDown={() => setShowConfirmPassword(true)} onMouseUp={() => setShowConfirmPassword(false)} className="absolute right-4 top-4">
              <EyeSVG />
            </div> : ''}
          </div>

          {/* <div className="my-6 flex items-center justify-center">
            <input
              onChange={() => setKeepMeLogin(!keepMeLogin)}
              className="checkbox"
              type="checkbox"
              id="loginCheckbox"
            />
            <label
              className="font-normal text-tertiaryText ml-3"
              htmlFor="loginCheckbox"
            >
              {" "}
              Keep me logged in
            </label>
          </div> */}

          <button
            className="bg-gradient w-full my-4 font-bold rounded-xl tmv-shadow submit"
            type="submit"
          >
            Submit
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
      </div>
      <div className="h-20 md:hidden"></div>
      {/* toast message */}
      <ToastContainer />
    </>
  );
};

export default resetpassword;

resetpassword.getLayout = function getLayout(page) {
  return (
    <UnprotectedRoute>
      <Layout>
        <AuthLayout>{page}</AuthLayout>
      </Layout>
    </UnprotectedRoute>
  );
};
