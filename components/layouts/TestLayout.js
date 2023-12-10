import React, { useState } from "react";
import bgImg from "../../public/tmv-bg.jpeg";
import Topbar from "@/components/Topbar";
import MenuController from "@/svg/MenuControllerSVG";
import MainLogo2 from "@/svg/MainLogo2SVG";
import AnalyticsSummary from "@/svg/menu/AnalyticsSummary";
import Vehicles from "@/svg/menu/Vehicles";
import Link from "next/link";

const TestLayout = ({ children }) => {
  const [open, setOpen] = useState(true);

  const menus = [
    { name: "AnalyticsSummary", link: "/", icon: AnalyticsSummary },
    { name: "Vehicles", link: "/", icon: Vehicles },
  ];

  return (
    <div className="min-h-screen">
      <div
        className={`min-h-screen bg-white/30 fixed top-0 left-0  duration-500  p-4 rounded-[40px] z-50 ${
          open ? "w-[358px]" : "w-16"
        } `}
      >
        <div className="flex justify-end">
          <button onClick={() => setOpen(!open)}>
            <MenuController />
          </button>
        </div>

        <div>
          <MainLogo2 />
          <div className="mt-5">
            <p className="font-bold">Fazle Rabbi</p>
            <p className="font-light">user Id: 05162614</p>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
          {menus?.map((menu, i) => (
            <Link
              href={menu?.link}
              key={i}
              className={` ${
                menu?.margin && "mt-5"
              } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
            >
              <div>{React.createElement(menu?.icon, { size: "20" })}</div>
              <h2
                style={{
                  transitionDelay: `${i + 3}00ms`,
                }}
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>
              <h2
                className={`${
                  open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
              >
                {menu?.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>

      <div className="ml-[358px] bg-red-300">
        <main>{children}</main>
      </div>
    </div>
  );
};

export default TestLayout;
