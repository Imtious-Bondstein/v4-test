import React, { useEffect, useMemo, useState } from "react";
import "../styles/pages/Home.css";
import "../styles/components/sidebarSelectors.css";

import CarImg from '../public/images/Car-Icon.png'

const SelectedVehicles = ({ selectedVehicles, isLoading }) => {
  return (
    <div className="selected-vehicles rounded-xl bg-white p-4 overflow-hidden">
      {/* ======== img ====== */}
      <div className="mb-4 image">
        <img src={CarImg.src} alt="" className="h-full w-full rounded-xl" />
      </div>
      {/* ======= vehicle list ======= */}
      <div
        className={`min-h-80 overflow-y-auto select-none scrollGray calc-height-260 `}
      >
        {isLoading ? (
          <div className={`h-[440px] overflow-hidden mt-5`}>
            <div className="w-full h-20 border-[3px] skeleton-border rounded-2xl p-1 mb-3">
              <div className="w-full h-full skeleton rounded-2xl "></div>
            </div>
            <div className="w-full h-20 border-[3px] skeleton-border rounded-2xl p-1 mb-3">
              <div className="w-full h-full skeleton rounded-2xl "></div>
            </div>
            <div className="w-full h-20 border-[3px] skeleton-border rounded-2xl p-1 mb-3">
              <div className="w-full h-full skeleton rounded-2xl "></div>
            </div>
            <div className="w-full h-20 border-[3px] skeleton-border rounded-2xl p-1 mb-3">
              <div className="w-full h-full skeleton rounded-2xl "></div>
            </div>
          </div>
        ) : (
          <div className="pr-1 h-[350px] md:h-auto">
            {selectedVehicles.map((vehicle) => (
              <div
                className="flex justify-between bg-[#FAFAFA] mb-2 rounded-xl p-4 "
                key={vehicle.v_identifier}
              >
                <div className="flex items-center">
                  <div className="">
                    <p className="font-bold text-primaryText">
                      {vehicle.bst_id}
                    </p>
                    <p className="font-light text-tertiaryText text-sm">
                      {vehicle.vehicle_name}
                    </p>
                    <p className="font-light text-tertiaryText text-sm">
                      {vehicle.nearby_l_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedVehicles;
