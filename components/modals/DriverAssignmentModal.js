import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import CloseSVG from "../SVG/CloseSVG";
import SearchCarSVG from "../../components/SVG/SearchCarSVG";
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

const DriverAssignmentModal = ({
  driverModalIsOpen,
  setDriverModalIsOpen,
  selectedVehicle,
}) => {
  const [name, setName] = useState("");
  const [duty, setDuty] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const [active, setActive] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmptyFields, setIsEmptyFields] = useState(false);

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setDriverModalIsOpen(false);
    setName("");
    setDuty("");
    setDateRange({
      startDate: null,
      endDate: null,
    });
    setActive(null);
    setIsEmptyFields(false);
    setIsLoading(true);
  }

  // ========== handle time picker ========
  const handleStartTime = (date, fieldName) => {
    if (fieldName === "startDate") {
      setDateRange({
        ...dateRange,
        startDate: date,
        startTime: date,
      });
    }
    if (fieldName === "startTime") {
      setDateRange({
        ...dateRange,
        startDate: date,
        startTime: date,
      });
    }
    if (fieldName === "endDate") {
      setDateRange({
        ...dateRange,
        endDate: date,
        endTime: date,
      });
    }
    if (fieldName === "endTime") {
      setDateRange({
        ...dateRange,
        endDate: date,
        endTime: date,
      });
    }

    console.log(fieldName, "==== date ====", date);
  };

  const handleUpdate = () => {
    setIsLoading(true);

    const data = {
      driver_name: name,
      start_date_time: vehicleRouteDateTimePicker(dateRange.startDate),
      end_date_time: vehicleRouteDateTimePicker(dateRange.endDate),
      duty: duty,
      status: active,
    };
    console.log("data:", data);
    axios
      .post(
        `/api/v4/driver-assign?identifier=${selectedVehicle.identifier}`,
        data
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    setDriverModalIsOpen(false);
    toast.success("Successfully Assigned");
  };

  const handleReset = () => {
    setName("");
    setDuty("");
    setDateRange({
      startDate: null,
      endDate: null,
    });
    setActive(null);
  };

  const getData = () => {
    setIsLoading(true);
    axios
      .get(
        `/api/v4/driver-assign-edit?identifier=${selectedVehicle.identifier}`
      )
      .then((res) => {
        console.log("get driver res", res.data);
        const foundData = res.data.data;
        setName(foundData.driver_name);
        setDuty(foundData.duty);
        setDateRange({
          startDate: new Date(foundData.start_date_time),
          endDate: new Date(foundData.end_date_time),
        });
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
    if (
      name &&
      duty &&
      dateRange.startDate &&
      dateRange.endDate &&
      active !== null
    ) {
      setIsEmptyFields(false);
    } else {
      setIsEmptyFields(true);
    }
  }, [name, duty, dateRange, active]);

  useEffect(() => {
    console.log("getData");
    driverModalIsOpen && getData();
  }, [driverModalIsOpen]);

  return (
    <div className="">
      {/* <button onClick={openModal}>Open Modal</button> */}
      <Modal
        isOpen={driverModalIsOpen}
        ariaHideApp={false}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        className={`absolute w-[320px] sm:w-[448px] p-5 bg-white`}
        contentLabel="Example Modal"
      >
        {/* ==== cross button ====  */}
        <button
          className=" fill-[#C9D1DA] hover:fill-quaternary absolute top-4 right-4"
          onClick={closeModal}
        >
          <CloseSVG />
        </button>
        <h1 className="text-base sm:text-2xl font-bold text-center mb-6">
          New Driver Assignment
        </h1>

        {!isLoading ? (
          <div>
            <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
              Vehicle No
            </p>
            <div className="fill-quaternary flex items-center bg-secondary rounded-xl space-x-4 p-4 mb-3.5">
              <SearchCarSVG />
              <p className="text-xs font-bold">{selectedVehicle.vehicleNo}</p>
            </div>
            <div className="">
              <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                Driver
              </p>
              <div className="mb-3.5">
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="bg-[#F8F8FA] text-xs font-bold p-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                  type="text"
                  placeholder="Driver"
                />
              </div>
              <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                {/* ======== start date ======== */}

                <div>
                  <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                    From
                  </p>
                  <div className="relative bg-[#F8F8FA] rounded-xl w-full">
                    <div className="h-[45px] flex items-center">
                      <DatePicker
                        selected={dateRange.startDate}
                        onChange={(date) => handleStartTime(date, "startDate")}
                        dateFormat="dd/MM/yyyy"
                        showTimeInput
                        className="w-full p-3 bg-[#F8F8FA] text-xs font-bold placeholder:text-tertiaryText rounded-xl z-[40] outline-quaternary "
                        placeholderText="From"
                      />
                    </div>
                    <div className="absolute right-2 top-3.5">
                      <Calender />
                    </div>
                  </div>
                </div>

                {/* ======== end date ======== */}
                <div>
                  <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                    To
                  </p>
                  <div className="relative bg-[#F8F8FA] rounded-xl w-full">
                    <div className="h-[45px] flex items-center">
                      <DatePicker
                        selected={dateRange.endDate}
                        onChange={(date) => handleStartTime(date, "endDate")}
                        dateFormat="dd/MM/yyyy"
                        showTimeInput
                        className="w-full p-3 bg-[#F8F8FA] text-xs font-bold placeholder:text-tertiaryText rounded-xl z-40 outline-quaternary"
                        placeholderText="To"
                      />
                    </div>
                    <div className="absolute right-2 top-3.5">
                      <Calender />
                    </div>
                  </div>
                </div>

                {/* ======== start timepicker ======== */}

                <div className="relative bg-[#F8F8FA] rounded-xl w-full">
                  <div className="h-[45px] flex items-center">
                    <DatePicker
                      selected={dateRange.startDate}
                      onChange={(date) => handleStartTime(date, "startTime")}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className="w-full p-3 bg-[#F8F8FA] text-xs font-bold placeholder:text-tertiaryText rounded-xl z-40 outline-quaternary"
                      placeholderText="From"
                    />
                  </div>
                  <div className="absolute right-2 top-3.5">
                    <Timer />
                  </div>
                </div>

                {/* ======== end time picker ======== */}
                <div className="relative bg-[#F8F8FA] rounded-xl w-full">
                  <div className="h-[45px] flex items-center">
                    <DatePicker
                      selected={dateRange.endDate}
                      onChange={(date) => handleStartTime(date, "endTime")}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className="w-full p-3 bg-[#F8F8FA] text-xs font-bold placeholder:text-tertiaryText rounded-xl z-40 outline-quaternary"
                      placeholderText="To"
                    />
                  </div>
                  <div className="absolute right-2 top-3.5">
                    <Timer />
                  </div>
                </div>
              </div>

              <div className="mb-3.5">
                <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                  Duty
                </p>
                <select
                  onChange={(e) => setDuty(e.target.value)}
                  value={duty}
                  className={`w-full px-3 py-4 bg-[#F8F8FA] text-xs font-bold  rounded-xl z-40 outline-quaternary ${duty === "" ? "text-tertiaryText" : ""
                    }`}
                >
                  <option value="" disabled selected hidden>
                    Duty
                  </option>
                  <option value="Item 1">Item 1</option>
                  <option value="Item 2">Item 2</option>
                  <option value="Item 3">Item 3</option>
                </select>
              </div>

              <div className="flex justify-center items-center space-x-4 pt-4">
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
              <div className="flex items-center space-x-3.5 pt-6">
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
      <ToastContainer theme="light" />
    </div>
  );
};

export default DriverAssignmentModal;
