import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import CloseSVG from "../SVG/CloseSVG";
import SearchCar from "../../components/SVG/SearchCarSVG";
// date-time-picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import SVG
import Calender from "@/svg/CalenderSVG";
import Timer from "@/svg/TimerSVG";
import TikSVG from "../SVG/modal/TikSVG";
import ReloadSVG from "../SVG/modal/ReloadSVG";
import TikSmallSVG from "../SVG/modal/TikSmallSVG";
// import custom css
import "../../styles/components/modal.css";
import axios from "@/plugins/axios";
import { vehicleRouteDateTimePicker } from "@/utils/dateTimeConverter";
import { ToastContainer, toast } from "react-toastify";

const customStyles = {
  content: {
    top: "55%",
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

const AuthorizationModal = ({
  setAuthorizationModalIsOpen,
  authorizationModalIsOpen,
  selectedVehicle,
}) => {
  const [fuelLimit, setFuelLimit] = useState("");
  const [gasLimit, setGasLimit] = useState("");
  const [runLimit, setRunLimit] = useState("");
  const [period, setPeriod] = useState(null);
  const [active, setActive] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isEmptyFields, setIsEmptyFields] = useState(false);

  // const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setAuthorizationModalIsOpen(false);

    setFuelLimit("");
    setGasLimit("");
    setRunLimit("");
    setPeriod(null);
    setActive(null);

    setIsEmptyFields(false);
    setIsLoading(true);
  }

  const handleUpdate = () => {
    setIsLoading(true);
    const data = {
      fuel_limit: fuelLimit,
      gas_limit: gasLimit,
      run_limit: runLimit,
      period: vehicleRouteDateTimePicker(period),
      status: active,
    };

    console.log("data:", data);

    axios
      .post(
        `/api/v4/profile-authorization?identifier=${selectedVehicle.identifier}`,
        data
      )
      .then((res) => {
        console.log("--- res", res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    setAuthorizationModalIsOpen(false);
    toast.success("Successfully Authorized");
  };

  const handleReset = () => {
    console.log("reset");

    setFuelLimit("");
    setGasLimit("");
    setRunLimit("");
    setPeriod(null);
    setActive(null);
  };

  const getData = () => {
    setIsLoading(true);
    axios
      .get(
        `/api/v4/profile-authorization-edit?identifier=${selectedVehicle.identifier}`
      )
      .then((res) => {
        console.log("get auth res", res.data);
        const foundData = res.data.data;

        setFuelLimit(foundData.fuel_limit);
        setGasLimit(foundData.gas_limit);
        setRunLimit(foundData.run_limit);
        setPeriod(new Date(foundData.period));
        setActive(foundData.status);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    console.log("getData");
    authorizationModalIsOpen && getData();
  }, [authorizationModalIsOpen]);

  useEffect(() => {
    if (fuelLimit && gasLimit && runLimit && period && active !== null) {
      setIsEmptyFields(false);
    } else {
      setIsEmptyFields(true);
    }
  }, [fuelLimit, gasLimit, runLimit, period, active]);

  return (
    <div>
      {/* <button onClick={openModal}>Open Modal</button> */}
      <Modal
        isOpen={authorizationModalIsOpen}
        ariaHideApp={false}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        className={`absolute w-[320px] sm:w-[448px] p-5 bg-white`}
        contentLabel="Example Modal"
      >
        <button
          className=" fill-[#C9D1DA] hover:fill-quaternary absolute top-4 right-4"
          onClick={closeModal}
        >
          <CloseSVG />
        </button>

        <h1 className="text-base sm:text-2xl font-bold text-center mb-6">
          Authorization
        </h1>

        {!isLoading ? (
          <div>
            <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
              Vehicle No
            </p>
            <div className="fill-quaternary flex items-center bg-secondary rounded-xl space-x-4 p-4 mb-3.5">
              <SearchCar />
              <p className="text-xs font-bold">{selectedVehicle.vehicleNo}</p>
            </div>

            <div className="">
              <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                Fuel Limit
              </p>
              <div className="mb-3.5">
                <input
                  onChange={(e) => setFuelLimit(e.target.value)}
                  value={fuelLimit}
                  className="bg-[#F8F8FA] text-xs font-bold p-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                  type="text"
                  placeholder="Fuel Limit (Liter) EX: 33.22 M/S²"
                />
              </div>

              <div className="mb-3.5">
                <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                  Gas Limit
                </p>
                <input
                  onChange={(e) => setGasLimit(e.target.value)}
                  value={gasLimit}
                  className="bg-[#F8F8FA] text-xs font-bold p-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                  type="text"
                  placeholder="Gas Limit (Liter) EX 33.22 M/S²"
                />
              </div>

              <div className="mb-3.5">
                <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                  Run Limit
                </p>
                <input
                  onChange={(e) => setRunLimit(e.target.value)}
                  value={runLimit}
                  className="bg-[#F8F8FA] text-xs font-bold p-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                  type="text"
                  placeholder="Run Limit (Km) EX 100 km"
                />
              </div>

              <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                Period
              </p>
              <div className="relative bg-[#F8F8FA] rounded-xl w-full mb-3.5">
                <div className="h-[45px] flex items-center">
                  <DatePicker
                    selected={period}
                    onChange={(date) => setPeriod(date)}
                    dateFormat="dd/MM/yyyy"
                    className="w-full p-3 bg-[#F8F8FA] text-xs font-bold placeholder:text-tertiaryText rounded-xl z-40 outline-quaternary"
                    placeholderText="Period"
                  />
                </div>
                <div className="absolute right-2 top-3.5">
                  <Calender />
                </div>
              </div>

              <div className="mb-5 flex justify-center items-center space-x-4 pt-4">
                <p className="text-sm text-tertiaryText font-bold">Active:</p>
                <div
                  onClick={() => setActive(true)}
                  className="flex items-center space-x-1"
                >
                  <div className="h-[21px] w-[21px] flex justify-center items-center modal-active-shadow rounded-md cursor-pointer">
                    {active === true && <TikSmallSVG />}
                  </div>
                  <span>Yes</span>
                </div>
                <div
                  onClick={() => setActive(false)}
                  className="flex items-center space-x-1"
                >
                  <div className="h-[21px] w-[21px] flex justify-center items-center modal-active-shadow rounded-md cursor-pointer">
                    {active === false && <TikSmallSVG />}
                  </div>
                  <span>No</span>
                </div>
              </div>

              {/* =============button========== */}
              <div className="flex items-center space-x-3.5">
                <button
                  disabled={isEmptyFields ? true : false}
                  onClick={handleUpdate}
                  className={`flex justify-center items-center space-x-2 p-3 w-full rounded-xl  group duration-300 ${!isEmptyFields
                      ? "bg-primary hover:shadow-primary/80 hover:shadow-lg modal-button-shadow"
                      : "bg-primaryDisable"
                    }`}
                >
                  <div className="">
                    <TikSVG />
                  </div>
                  <span>Update</span>
                </button>

                <button
                  onClick={handleReset}
                  type="reset"
                  className="flex justify-center items-center space-x-2 p-3 w-full bg-[#e7ecf3] rounded-xl group hover:bg-[#1E1E1E]"
                >
                  <div className=" group-hover:fill-[#e7ecf3] fill-[#1E1E1E] group-hover:animate-spinLeftOne">
                    <ReloadSVG />
                  </div>
                  <span className="group-hover:text-[#e7ecf3] text-[#1E1E1E]">
                    Reset
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[80%]">
            <div className="w-16 h-16 border-4 border-dashed rounded-full border-primary animate-spin "></div>
          </div>
        )}
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default AuthorizationModal;
