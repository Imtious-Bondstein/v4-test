import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import CloseSVG from "../SVG/CloseSVG";
import SearchCar from "../SVG/SearchCarSVG";
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

const AddNewVehicleModal = ({
  setAddNewVehicleModalIsOpen,
  addNewVehicleModalIsOpen,
  selectedVehicle,
}) => {
  const [fuelLimit, setFuelLimit] = useState("");
  const [gasLimit, setGasLimit] = useState("");
  const [runLimit, setRunLimit] = useState("");
  const [period, setPeriod] = useState(null);
  const [active, setActive] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isEmptyFields, setIsEmptyFields] = useState(false);

  const [deviceID, setDeviceID] = useState("");
  const [emi, setEmi] = useState("");
  const [device, setDevice] = useState("");

  // const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setAddNewVehicleModalIsOpen(false);

    setDeviceID("");
    setEmi("");
    setDevice("");
  }

  const handleUpdate = () => {
    const data = {
      deviceID: deviceID,
      emi: emi,
      device: device,
      status: active,
    };
    setAddNewVehicleModalIsOpen(false);
    toast.success("New Vehicle Added");
  };

  const handleReset = () => {
    setDeviceID("");
    setEmi("");
    setDevice("");
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
    addNewVehicleModalIsOpen && getData();
  }, [addNewVehicleModalIsOpen]);

  useEffect(() => {
    if (deviceID && emi && device && active !== null) {
      setIsEmptyFields(false);
    } else {
      setIsEmptyFields(true);
    }
  }, [deviceID, emi, device, active]);

  return (
    <div>
      {/* <button onClick={openModal}>Open Modal</button> */}
      <Modal
        isOpen={addNewVehicleModalIsOpen}
        ariaHideApp={false}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        className={`absolute w-[320px] sm:h-[600px] sm:w-[448px] p-5 bg-white`}
        contentLabel="Example Modal"
      >
        <button
          className=" fill-[#C9D1DA] hover:fill-quaternary absolute top-4 right-4"
          onClick={closeModal}
        >
          <CloseSVG />
        </button>

        <h1 className="text-base sm:text-2xl font-bold text-center mb-6">
          Add New Vehicle
        </h1>

        {!isLoading ? (
          <div>
            {/* <div className="fill-quaternary flex items-center bg-secondary rounded-xl space-x-4 p-4 mb-3.5">
              <SearchCar />
              <p className="text-xs font-bold">{selectedVehicle.vehicleNo}</p>
            </div> */}

            <div className="">
              <div className="mb-4">
                <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                  Device ID
                </p>

                <input
                  onChange={(e) => setDeviceID(e.target.value)}
                  value={deviceID}
                  className="bg-[#F8F8FA] text-xs font-bold p-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                  type="text"
                  placeholder="Device ID EX 28286"
                />
              </div>

              <div className="mb-4">
                <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                  EMI
                </p>
                <input
                  onChange={(e) => setEmi(e.target.value)}
                  value={emi}
                  className="bg-[#F8F8FA] text-xs font-bold p-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                  type="text"
                  placeholder="IMEI EX 8351561837385"
                />
              </div>

              <div className="mb-4">
                <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                  Device
                </p>

                <input
                  onChange={(e) => setDevice(e.target.value)}
                  value={device}
                  className="bg-[#F8F8FA] text-xs font-bold p-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                  type="text"
                  placeholder="Device"
                />
              </div>
              <div className="mb-4">
                <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                  Panel
                </p>
                <select className="bg-[#F8F8FA] text-xs font-bold p-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary">
                  <option defaultValue>Panel</option>
                  <option>Track My Vehicle (TMV)</option>
                  <option>Robi Vehicle Tracker (RVT)</option>
                  <option>Runner Automobiles Limited (RAL)</option>
                  <option>Runner Motors Limited (RML)</option>
                </select>
              </div>

              <div className="mb-10 flex justify-center items-center space-x-4 pt-4">
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
                  onClick={() => handleUpdate()}
                  className={`flex justify-center items-center space-x-2 p-3 w-full rounded-xl  group duration-300 ${!isEmptyFields
                      ? "bg-primary hover:shadow-primary/80 hover:shadow-lg modal-button-shadow"
                      : "bg-primaryDisable"
                    }`}
                >
                  <div className="">
                    <TikSVG />
                  </div>
                  <span>Add</span>
                </button>

                <button
                  type="reset"
                  onClick={() => handleReset()}
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

export default AddNewVehicleModal;
