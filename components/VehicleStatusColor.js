import React from "react";

const VehicleStatusColor = () => {
  return (
    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3 pb-4">
      <div className="h-full p-5 rounded-xl bg-white">
        <div className="w-20 h-20 p-2.5 bg-vehicleGreaterThanFive/20 rounded-full mx-auto">
          <div className="w-full h-full bg-vehicleGreaterThanFive  rounded-full"></div>
        </div>

        <p className="text-center text-xs text-tertiaryText mt-5">
          Mobile (Vehicle speed is greater than or equal to 5KM/H)
        </p>
      </div>

      <div className="h-full p-5 rounded-xl bg-white">
        <div className="w-20 h-20 p-2.5 bg-vehicleLessThanFive/20 rounded-full mx-auto">
          <div className="w-full h-full bg-vehicleLessThanFive  rounded-full"></div>
        </div>

        <p className="text-center text-xs text-tertiaryText mt-5">
          Slow (Vehicle speed is less than 5 KM/H)
        </p>
      </div>

      <div className="h-full p-5 rounded-xl bg-white">
        <div className="w-20 h-20 p-2.5 bg-vehicleRecentlyOff/20 rounded-full mx-auto">
          <div className="w-full h-full bg-vehicleRecentlyOff  rounded-full"></div>
        </div>

        <p className="text-center text-xs text-tertiaryText mt-5">
          Engine has been turned off recently
        </p>
      </div>

      <div className="h-full p-5 rounded-xl bg-white">
        <div className="w-20 h-20 p-2.5 bg-vehicleOff/20 rounded-full mx-auto">
          <div className="w-full h-full bg-vehicleOff  rounded-full"></div>
        </div>

        <p className="text-center text-xs text-tertiaryText mt-5">
          Off (Engine is currently at the moment turned off)
        </p>
      </div>

      <div className="h-full p-5 rounded-xl bg-white">
        <div className="w-20 h-20 p-2.5 bg-vehicleOffline/20 rounded-full mx-auto">
          <div className="w-full h-full bg-vehicleOffline  rounded-full"></div>
        </div>

        <p className="text-center text-xs text-tertiaryText mt-5">
          Offline (Vehicle is offline and data was received more than 24 hrs
          ago)
        </p>
      </div>
    </div>
  );
};

export default VehicleStatusColor;
