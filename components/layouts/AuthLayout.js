import React from "react";
import bgImg from "../../public/tmv-bg.jpeg";
import "../../styles/pages/Home.css";
import AnimatedSVG from "@/components/AnimatedSVG";
import Footer from "@/components/Footer";
import animationImg from "../../public/login-animation.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div
        className="lg:h-screen min-h-screen backgroundImage"
        style={{
          backgroundImage: `url(${bgImg.src})`,
        }}
      >
        <div className="">
          <div className="grid lg:grid-cols-12 grid-cols-1">
            <div className="lg:col-span-7 col-span-1">
              {/* <AnimatedSVG /> */}
              <div
                className="lg:h-full h-[400px] lg:bg-right bg-center amimatedImg hidden md:block"
                style={{
                  backgroundImage: `url(${animationImg.src})`,
                }}
              ></div>
            </div>
            <div className="lg:col-span-5 md:ml-10 xl:ml-20 flex lg:justify-start justify-center lg:h-screen">
              {children}
            </div>
          </div>
        </div>
        {/* footer */}
        <div className="w-full lg:fixed static bottom-0">
          <Footer tacker={true} />
        </div>
      </div>
      {/* toast message */}
      <ToastContainer />
    </div>
  );
};

export default AuthLayout;
