import React, { useEffect, useState } from "react";
import Modal from "react-modal";

// import SVG
import TikSVG from "../SVG/modal/TikSVG";
import ReloadSVG from "../SVG/modal/ReloadSVG";
import CloseSVG from "../SVG/CloseSVG";

// import custom css
import "../../styles/components/modal.css";

//==image
import car_1 from "../../public/images/car.png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const customStyles = {
  content: {
    top: "53%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "20px",
  },
  overlay: {
    background: "#1E1E1E40",
    zIndex: "2000",
  },
};

const GeoFenceAssignedVehiclesModal = ({
  assignedVehiclesModalIsOpen,
  setAssignedVehiclesModalIsOpen,
  assignedVehicles,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleList, setVehicleList] = useState([1, 2, 3]);

  const toggleClass = " transform translate-x-3";

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  const closeModal = async () => {
    setAssignedVehiclesModalIsOpen(false);
  };

  return (
    <div>
      <Modal
        isOpen={assignedVehiclesModalIsOpen}
        ariaHideApp={false}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        className={`outline-none absolute w-[320px] sm:w-[448px] p-5 bg-white h-[60vh]`}
        contentLabel="Settings Modal"
      >
        <div className="h-[100%] overflow-hidden">
          <h1 className="text-lg md:text-2xl font-bold text-center mb-6">
            Assigned Vehicles
          </h1>
          <button
            className=" fill-[#C9D1DA] hover:fill-quaternary absolute top-4 right-4"
            onClick={closeModal}
          >
            <CloseSVG />
          </button>
          <div className="h-[100%]">
            {isLoading ? (
              <div>
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
              <div
                className={`overflow-y-auto pr-3.5 select-none scrollGray h-[100%]`}
              >
                {assignedVehicles.map((vehicle, index) => (
                  <div
                    className="flex justify-between bg-[#FAFAFA] mb-2 rounded-xl p-4 cursor-pointer"
                    key={index}
                  >
                    <div className="flex items-center">
                      <img
                        className="w-10 h-10"
                        src={vehicle.vehicle_info.image}
                        alt=""
                      />
                      <div className="ml-5 ">
                        <p className="font-bold text-primaryText">
                          {vehicle.vehicle_info.bst_id}
                        </p>
                        <p className="font-light text-tertiaryText">
                          {vehicle.vehicle_info.vrn}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GeoFenceAssignedVehiclesModal;
