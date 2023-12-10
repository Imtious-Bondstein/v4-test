import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import CloseSVG from "../SVG/CloseSVG";
import SearchCar from "../SVG/SearchCarSVG";
// date-time-picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import SVG
import RightArrowSVG from "../SVG/RightArrowSVG";

// import custom css
import "../../styles/components/modal.css";
import axios from "@/plugins/axios";
import {
  shareLinkDateTime,
  vehicleRouteDateTimePicker,
} from "@/utils/dateTimeConverter";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";

import Select from "react-select";
// ====== store =======
import { useDispatch, useSelector } from "react-redux";

//=====utils
import { clientBaseUrl } from "@/utils/clientBaseUrl";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "20px",
  },
  overlay: {
    background: "#1E1E1E40",
    zIndex: "1100",
  },
};

function ShareVehicleRouteModal({
  selectedVehicle,
  startDate,
  endDate,
  shareVehicleRouteModalIsOpen,
  setShareVehicleRouteModalIsOpen,
  isBack,
  setIsBack,
  selectedDuration,
  setSelectedDuration,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const [isLinkShareOn, setIsLinkShareOn] = useState(false);

  const [isCopied, setIsCopied] = useState(false);

  // const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [vehicleOptions, setVehicleOptions] = useState([]);

  const [linkExpireTime, setLinkExpireTime] = useState(null);

  const [generatedLink, setGeneratedLink] = useState(null);

  const timeOptions = [
    { value: 1, label: "1 Minute" },
    { value: 10, label: "10 Minutes" },
    { value: 30, label: "30 Minutes" },
    { value: 60, label: "1 hour" },
    { value: 120, label: "2 hours" },
    { value: 360, label: "6 hours" },
    { value: 720, label: "12 hours" },
    { value: 1440, label: "1 Day" },
    { value: 4320, label: "3 Days" },
    { value: 10080, label: "1 Week" },
    { value: 43200, label: "1 month" },
  ];

  const clientBaseURL = clientBaseUrl(window.location.hostname);

  //=========store========
  const dispatch = useDispatch();
  const { storeVehicleLists, isStoreLoading } = useSelector(
    (state) => state.reducer.vehicle
  );

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setShareVehicleRouteModalIsOpen(false);
  }

  const handleLinkShareToggle = () => {
    setIsLinkShareOn(!isLinkShareOn);
  };

  const handleBack = () => {
    setIsBack(false);
  };

  const startSharing = () => {
    setIsBack(true);
  };

  const handleVehicleSelect = (selectedOption) => {
    // setSelectedVehicle(selectedOption);
    console.log("Vehicle Select", selectedOption);
  };

  const handleDurationSelect = (selectedOption) => {
    setSelectedDuration(selectedOption);
    console.log("Duration Select", selectedOption);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  };

  const handleReset = () => {
    // setSelectedVehicle(null);
    setSelectedDuration(null);
  };

  //==========handle generate token
  const generateShareToken = async () => {
    console.log("duration", selectedDuration.value);
    console.log("vehicle", selectedVehicle.v_identifier);
    console.log("star", startDate);
    console.log("end", endDate);
    setIsLoading(true);
    await axios
      .get(
        `/api/v4/generate-token-vehicle-route?duration=${
          selectedDuration.value
        }&identifier=${
          selectedVehicle.v_identifier
        }&start_date_time=${vehicleRouteDateTimePicker(
          startDate
        )}&end_date_time=${vehicleRouteDateTimePicker(endDate)}`
      )
      .then((res) => {
        console.log("token data", res);
        setLinkExpireTime(res.data.expires_at);
        setGeneratedLink(
          `${clientBaseURL}/location/share-vehicle-route?access=${res.data.token}`
        );
      })
      .then(() => {
        startSharing();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  // ===== format vehicle list for dropdown ====
  // useEffect(() => {
  //     if (storeVehicleLists) {
  //         let newVehicleOptions = [];
  //         const allVehiclesArray = storeVehicleLists.flatMap(
  //             (group) => group.vehicles
  //         );
  //         allVehiclesArray.forEach((element) => {
  //             const obj = {
  //                 value: element.v_identifier,
  //                 label: element.bst_id + " " + element.v_vrn,
  //             };
  //             newVehicleOptions.push(obj);
  //         });
  //         setVehicleOptions(newVehicleOptions);
  //         console.log("flat-storeVehicleLists", allVehiclesArray);
  //     }
  // }, [storeVehicleLists]);

  // ==== set selected vehicle if only one vehicle selected from sidebar
  // useEffect(() => {
  //     if (selectedVehicles.length === 1) {
  //         console.log("------ if", selectedVehicles);
  //         setSelectedVehicle({
  //             value: selectedVehicles[0].v_identifier,
  //             label: selectedVehicles[0].bst_id + " " + selectedVehicles[0].v_vrn,
  //         });
  //     } else {
  //         console.log("----- else", selectedVehicles);
  //         setSelectedVehicle(null);
  //     }
  // }, [selectedVehicles.length]);

  // ==== styles ===
  const toggleClass = "transform translate-x-10";
  const commonSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#F8F8FA",
      border: 0,
      padding: "5px 0",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#8D96A1",
      fontSize: "14px",
      fontWeight: 600,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#8D96A1",
      fontSize: "14px",
      fontWeight: 600,
    }),
  };

  const vehicleSelectStyle = {
    ...commonSelectStyles,
    menuList: (provided) => ({
      ...provided,
      maxHeight: "230px",
      overflowY: "auto",
    }),
  };

  const durationSelectStyle = {
    ...commonSelectStyles,
    menuList: (provided) => ({
      ...provided,
      maxHeight: "180px",
      overflowY: "auto",
    }),
  };

  return (
    <div>
      <Modal
        isOpen={shareVehicleRouteModalIsOpen}
        ariaHideApp={false}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        className={`absolute sm:w-[450px] w-[320px] h-[385px]  p-5 bg-white overflow-auto`}
        contentLabel="Example Modal"
      >
        <div className="">
          <button
            className={`fill-[#C9D1DA] hover:fill-quaternary absolute top-4 left-4 rotate-180 bg-buttonGray w-[25px] h-[25px] rounded-full flex items-center justify-center ${
              isBack ? "block" : "hidden"
            } `}
            onClick={handleBack}
          >
            <RightArrowSVG fillColor="#C9D0DA" />
          </button>
          <button
            className=" fill-[#C9D1DA] hover:fill-quaternary absolute top-4 right-4"
            onClick={closeModal}
          >
            <CloseSVG />
          </button>
        </div>
        <h1 className="text-sm sm:text-2xl font-bold text-center mb-6">
          Share Route
        </h1>

        <div className="">
          {!isBack ? (
            <div>
              {/* ===== input part =====  */}
              {/* <div className="mt-4">
                                <Select
                                    id="vehicle"
                                    onChange={handleVehicleSelect}
                                    options={vehicleOptions}
                                    value={selectedVehicle}
                                    placeholder={"Select Vehicle"}
                                    styles={vehicleSelectStyle}
                                />
                            </div> */}
              <div className="mt-4">
                <Select
                  id="time"
                  onChange={handleDurationSelect}
                  options={timeOptions}
                  value={selectedDuration}
                  placeholder={"Select Duration"}
                  styles={durationSelectStyle}
                />
              </div>

              <div className="mt-6">
                <button
                  onClick={generateShareToken}
                  disabled={isLoading || !selectedVehicle || !selectedDuration}
                  className={`${
                    isLoading || !selectedVehicle || !selectedDuration
                      ? "bg-primary/40"
                      : "bg-primary hover:shadow-lg hover:shadow-primary/80"
                  } w-full h-[50px] modal-button-shadow duration-300 rounded-xl text-primaryText`}
                >
                  {isLoading ? "Loading..." : "Start Sharing"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-5 items-center mt-6">
                <button className=" h-[50px] bg-buttonGray rounded-xl text-primaryText hover:shadow-lg duration-300">
                  Stop
                </button>
                <button
                  onClick={handleReset}
                  className=" h-[50px] bg-buttonGray rounded-xl text-primaryText hover:shadow-lg duration-300"
                >
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* ===== generated part =====  */}

              {/* ===== toggle button start =====  */}
              <div className="flex items-center justify-center space-x-3 ">
                {/* <p className="">Link Share</p> */}

                {/* <div
                  className="w-16 h-7  flex items-center bg-white rounded-[10px] cursor-pointer lg:tmv-shadow relative z-0 text-[10px] font-normal"
                  onClick={handleLinkShareToggle}
                >
                  
                  <div className="w-16 h-7 flex justify-center items-center absolute top-0 left-0 px-3 text-tertiaryText">
                    <p className="w-full text-left text-[10px]">Off</p>
                    <p className="w-full text-right text-[10px] -mr-0.5 ">On</p>
                  </div>
                  <div
                    className={
                      "bg-primary primary-shadow z-10 w-8 h-7  flex justify-center items-center rounded-[10px] shadow-md transform duration-300 ease-in-out" +
                      (!isLinkShareOn ? null : toggleClass)
                    }
                  >
                    <p>{isLinkShareOn ? "On" : "Off"}</p>
                  </div>
                </div> */}
                {/* toggle button end */}
              </div>

              {/* ===== link ===== */}
              <p className="bg-inputGray rounded-xl p-4 text-blue-400 mt-8 overflow-auto">
                <Link
                  className="hover:underline"
                  href={`${generatedLink}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {generatedLink}
                </Link>
              </p>
              <p className=" text-tmvDarkGray text-center mt-4">
                <span className="text-orange-500  font-bold text-lg ">* </span>
                Link will be expired on
                <span className="text-orange-500">
                  {" "}
                  {shareLinkDateTime(linkExpireTime)}
                </span>
              </p>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleCopyLink}
                  className=" w-[135px] h-[50px] bg-primary modal-button-shadow hover:shadow-lg hover:shadow-primary/80 duration-300 rounded-xl text-primaryText"
                >
                  {isCopied ? "Copied" : "Copy Link"}
                </button>
              </div>
            </div>
          )}
        </div>
        {/* {!isLoading ? (
          <div>
            <h1>Hello</h1>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[80%]">
            <div className="w-16 h-16 border-4 border-dashed rounded-full border-primary animate-spin "></div>
          </div>
        )} */}
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default ShareVehicleRouteModal;
