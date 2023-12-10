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

const GasolineConsumption = ({
  gasolineModalIsOpen,
  setGasolineModalIsOpen,
  selectedVehicle,
}) => {
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [unit, setUnit] = useState(null);
  const [price, setPrice] = useState("");
  const [station, setStation] = useState(null);
  const [location, setLocation] = useState(null);
  const [active, setActive] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isEmptyFields, setIsEmptyFields] = useState(false);

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setGasolineModalIsOpen(false);

    setType("");
    setStartDate("");
    setUnit("");
    setPrice("");
    setStation("");
    setLocation("");
    setActive(null);

    setIsLoading(true);
  }

  const handleUpdate = () => {
    setIsLoading(true);
    const data = {
      type: type,
      start_date_time: vehicleRouteDateTimePicker(startDate),
      unit: unit,
      price: price,
      station: station,
      location: location,
      status: active,
    };
    console.log("data:", data);

    axios
      .post(
        `/api/v4/gasoline-consumption?identifier=${selectedVehicle.identifier}`,
        data
      )
      .then((res) => {
        console.log("---res", res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    setGasolineModalIsOpen(false);
    toast.success("Successfull");
  };

  const handleReset = () => {
    console.log("calling");
    setType("");
    setStartDate("");
    setUnit("");
    setPrice("");
    setStation("");
    setLocation("");
    setActive(null);
  };

  const getData = () => {
    setIsLoading(true);
    axios
      .get(
        `/api/v4/gasoline-consumption-edit?identifier=${selectedVehicle.identifier}`
      )
      .then((res) => {
        console.log("get gasoline res", res.data);
        const foundData = res.data.data;

        setType(foundData.type);
        setStartDate(new Date(foundData.start_date_time));

        setUnit(foundData.unit);
        setPrice(foundData.price);

        setStation(foundData.station);
        setLocation(foundData.location);
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
      type &&
      startDate &&
      unit &&
      price &&
      location &&
      station &&
      active !== null
    ) {
      setIsEmptyFields(false);
    } else {
      setIsEmptyFields(true);
    }
  }, [type, startDate, unit, price, location, station, active]);

  useEffect(() => {
    console.log("getData");
    gasolineModalIsOpen && getData();
  }, [gasolineModalIsOpen]);

  return (
    <div>
      <Modal
        isOpen={gasolineModalIsOpen}
        ariaHideApp={false}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        className={`absolute w-[320px] sm:h-[605px] sm:w-[448px] p-5 bg-white overflow-auto`}
        contentLabel="Example Modal"
      >
        <button
          className=" fill-[#C9D1DA] hover:fill-quaternary absolute top-4 right-4"
          onClick={closeModal}
        >
          <CloseSVG />
        </button>

        <h1 className="text-sm sm:text-2xl font-bold text-center mb-6">
          Gasoline Consumption
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
                Select Type
              </p>
              <div className="mb-3.5">
                <select
                  onChange={(e) => setType(e.target.value)}
                  value={type}
                  className={`w-full px-3 py-4 bg-[#F8F8FA] text-xs font-bold placeholder:text-tertiaryText rounded-xl z-40 outline-quaternary ${!type ? "text-tertiaryText" : ""
                    }`}
                >
                  <option value="" disabled selected hidden>
                    Select Type
                  </option>
                  <option value="Item 1">Item 1</option>
                  <option value="Item 2">Item 2</option>
                  <option value="Item 3">Item 3</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                {/* ======== start date and timepicker ======== */}

                <div>
                  <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                    Date
                  </p>
                  <div className="relative bg-[#F8F8FA] rounded-xl w-full">
                    <div className="h-[45px] flex items-center">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd/MM/yyyy"
                        showTimeInput
                        className="w-full p-3 bg-[#F8F8FA] text-xs font-bold placeholder:text-tertiaryText rounded-xl z-40 outline-quaternary"
                        placeholderText="Date"
                      />
                    </div>
                    <div className="absolute right-2 top-3.5">
                      <Calender />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                    Time
                  </p>
                  <div className="relative bg-[#F8F8FA] rounded-xl w-full">
                    <div className="h-[45px] flex items-center">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        showTimeInput
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        className="w-full p-3 bg-[#F8F8FA] text-xs font-bold placeholder:text-tertiaryText rounded-xl z-40 outline-quaternary"
                        placeholderText="Time"
                      />
                    </div>
                    <div className="absolute right-2 top-3.5">
                      <Timer />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                    Unit(Ltr)
                  </p>
                  <input
                    onChange={(e) => setUnit(e.target.value)}
                    value={unit}
                    className="bg-[#F8F8FA] text-xs font-bold p-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                    type="text"
                    placeholder="Unit(Ltr)"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                    Price
                  </p>
                  <input
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    className="bg-[#F8F8FA] text-xs font-bold p-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                    type="number"
                    step="2"
                    placeholder="Price"
                  />
                </div>
              </div>

              <div className="mb-3.5">
                <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                  Station
                </p>
                <input
                  onChange={(e) => setStation(e.target.value)}
                  value={station}
                  className="bg-[#F8F8FA] text-xs font-bold p-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                  type="text"
                  placeholder="Station"
                />
              </div>

              <div className="mb-3.5">
                <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                  Location
                </p>
                <input
                  onChange={(e) => setLocation(e.target.value)}
                  value={location}
                  className="bg-[#F8F8FA] text-xs font-bold p-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                  type="text"
                  placeholder="Location"
                />
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

export default GasolineConsumption;
