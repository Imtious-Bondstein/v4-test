import React from "react";
import bgImg from "../public/tmv-bg.jpeg";
import { useRouter } from 'next/router';

import NotFound404SVG from "@/components/SVG/NotFound404SVG";

const Custom404 = () => {
  const router = useRouter();

  const handleHomeRedirect = () => {
    router.push('/');
  };

  return (
    <div
      className="lg:h-screen min-h-screen backgroundImage flex flex-col justify-center items-center px-10 bg-cover"
      style={{
        backgroundImage: `url(${bgImg.src})`,
      }}
    >
      <NotFound404SVG />
      <div className="text-[#6A7077] mt-5 mb-5">
        <p className="text-base sm:text-[20px] text-center">
          <span className="font-semibold">Oops!</span> Something went wrong, the
          page could not be found!
        </p>
      </div>

      <button onClick={handleHomeRedirect} className="w-32 md:w-48 h-[35px] md:h-[45px] bg-gradient tmv-shadow rounded-xl hover:shadow-primary/60 hover:shadow-xl text-sm md:text-base">
        Go Back Home
      </button>
    </div>
  );
};

export default Custom404;

// Custom404.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>;
// };
