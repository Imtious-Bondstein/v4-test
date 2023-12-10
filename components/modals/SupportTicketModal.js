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
import { fetchVehicleLists } from "@/store/slices/vehicleSlice";

import ReloadSVG from "../SVG/modal/ReloadSVG";
import TikSmallSVG from "../SVG/modal/TikSmallSVG";
// import custom css
import "../../styles/components/modal.css";
import axios from "@/plugins/axios";
import { vehicleRouteDateTimePicker } from "@/utils/dateTimeConverter";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";

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

const SupportTicketModal = ({
  setSupportTicketModalIsOpen,
  supportTicketModalIsOpen,
  handleSubmitSupport,
}) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState();
  const [fileDetails, setFileDetails] = useState("Attach File");

  const [categoryOptions, setCategoryOptions] = useState([
    {
      value: "Alert",
      label: "Alert",
    },
    {
      value: "Android App",
      label: "Android App",
    },
    { value: "Billing", label: "Billing" },
    {
      value: "Device",
      label: "Device",
    },
    { value: "Hotline", label: "Hotline" },
    { value: "How To", label: "How To" },
    { value: "Information Change", label: "Information Change" },
    { value: "iOS App", label: "iOS App" },
    { value: "Location", label: "Location" },
    { value: "Login and Password", label: "Login and Password" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Panel Update", label: "Panel Update" },
    { value: "Reports and Data", label: "Reports and Data" },
    { value: "Sales", label: "Sales" },
    { value: "Service", label: "Service" },
    { value: "TDS", label: "TDS" },
    { value: "Web Panel V2", label: "Web Panel V2" },
    { value: "Web Panel V3", label: "Web Panel V3" },
    { value: "Web Panel V4", label: "Web Panel V4" },
    { value: "Workshop", label: "Workshop" },
    { value: "YBX", label: "YBX" },
    {
      value: "Others",
      label: "Others",
    },
  ]);

  const [vehicleOptions, setVehicleOptions] = useState([]);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setSupportTicketModalIsOpen(false);
    setSelectedCategory(null);
    setSubject("");
    setMessage("");
    setSelectedVehicle(null);
    setFile("");
  }

  const handleSubmit = () => {
    const formData = new FormData();

    formData.append("category", selectedCategory.value);
    formData.append("subject", subject);
    formData.append("message", message);
    formData.append("identifier", selectedVehicle.value);
    formData.append("input_file", file);

    const normalData = {
      category: selectedCategory.value,
      subject: subject,
      message: message,
      identifier: selectedVehicle.value,
      input_file: file,
    };

    file.length <= 5 && handleSubmitSupport(formData, normalData);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSubject("");
    setMessage("");
    setSelectedVehicle(null);
    setFile("");
    setFileDetails("Attach File");
  };

  // STORE ===============================================================
  const dispatch = useDispatch();
  const { storeVehicleLists, isStoreLoading } = useSelector(
    (state) => state.reducer.vehicle
  );

  // STYLE FOR THE VEHICLE SELECT FIELD ==================================
  const commonSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#F8F8FA",
      border: 0,
      padding: "5px 0",
      borderRadius: "12px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#8D96A1",
      fontSize: "12px",
      fontWeight: 600,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#1E1E1E",
      fontSize: "12px",
      fontWeight: 600,
    }),
  };

  const categorySelectStyles = {
    ...commonSelectStyles,
    menuList: (provided) => ({
      ...provided,
      maxHeight: "250px",
      overflowY: "auto",
    }),
  };
  const vehicleSelectStyles = {
    ...commonSelectStyles,
    menuList: (provided) => ({
      ...provided,
      maxHeight: "150px",
      overflowY: "auto",
    }),
  };

  // SELECTED VEHICLE ====================================================
  const handleVehicleSelect = (selectedOption) => {
    setSelectedVehicle(selectedOption);
    console.log("Vehicle Select", selectedOption);
  };

  // SELECTED VEHICLE ====================================================
  const handleCategorySelect = (selectedOption) => {
    setSelectedCategory(selectedOption);
    console.log("cat Select", selectedOption);
  };

  // FETCHING ALL VEHICLES ===============================================
  useEffect(() => {
    if (storeVehicleLists) {
      let newVehicleOptions = [];
      const allVehiclesArray = storeVehicleLists.flatMap(
        (group) => group.vehicles
      );
      allVehiclesArray.forEach((element) => {
        const obj = {
          value: element.v_identifier,
          label: element.bst_id + " " + element.v_vrn,
        };
        newVehicleOptions.push(obj);
      });
      setVehicleOptions(newVehicleOptions);
      // console.log("flat-storeVehicleLists", allVehiclesArray);
    }
  }, [storeVehicleLists]);

  useEffect(() => {
    if (!storeVehicleLists) {
      dispatch(fetchVehicleLists());
    }
  }, [isStoreLoading]);

  useEffect(() => {
    if (!supportTicketModalIsOpen) {
      setSelectedCategory(null);
      setSubject("");
      setMessage("");
      setSelectedVehicle(null);
      setFile("");
      setFileDetails("Attach File");
    }
  }, [supportTicketModalIsOpen]);

  // HANDLE FILES ==============================================================
  const handleFiles = (e) => {
    const file = e.target.files;
    setFile(file);
    if (file.length >= 1 && file[0].size > 10000000) {
      setFileDetails("Files can't be bigger then 10 MB");
      console.log("It's a heavy file bro");
    } else if (file.length >= 2 && file[1].size > 10000000) {
      setFileDetails("Files can't be bigger then 10 MB");
    } else if (file.length >= 3 && file[2].size > 10000000) {
      setFileDetails("Files can't be bigger then 10 MB");
    } else if (file.length >= 4 && file[3].size > 10000000) {
      setFileDetails("Files can't be bigger then 10 MB");
    } else if (file.length >= 5 && file[4].size > 10000000) {
      setFileDetails("Files can't be bigger then 10 MB");
    } else if (file.length > 5) {
      setFileDetails("Maximum 5 Files Allowed");
    } else {
      setFileDetails(file.length + " File Selected");
    }
  };

  return (
    <div>
      <Modal
        isOpen={supportTicketModalIsOpen}
        ariaHideApp={false}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        className={`absolute w-[320px] sm:h-[600px] sm:w-[448px] p-5 bg-white overflow-y-auto`}
        contentLabel="Example Modal"
      >
        <button
          className=" fill-[#C9D1DA] hover:fill-quaternary absolute top-4 right-4"
          onClick={closeModal}
        >
          <CloseSVG />
        </button>

        <h1 className="text-base sm:text-2xl font-bold text-center mb-6">
          Support Request
        </h1>

        <div>
          <div>
            <div className="mb-4">
              <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                Category
              </p>

              <Select
                id="category"
                onChange={handleCategorySelect}
                options={categoryOptions}
                value={selectedCategory}
                placeholder="Category"
                styles={categorySelectStyles}
              />
            </div>
            <div className="mb-4">
              <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                Subject
              </p>
              <input
                type="text"
                onChange={(e) => setSubject(e.target.value)}
                className="bg-[#F8F8FA] text-xs font-bold p-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                placeholder="Subject"
                value={subject}
              />
            </div>
            <div className="mb-4">
              <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                Message
              </p>
              <textarea
                type="text"
                onChange={(e) => setMessage(e.target.value)}
                className="bg-[#F8F8FA] text-xs max-h-[100px] font-bold p-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                placeholder="Type Your Message"
                value={message}
              />
            </div>
            <div className="mb-4">
              <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                Vehicle
              </p>
              <div>
                <Select
                  id="vehicle list"
                  onChange={handleVehicleSelect}
                  options={vehicleOptions}
                  value={selectedVehicle}
                  placeholder="Please Select A Vehicle"
                  styles={vehicleSelectStyles}
                />
              </div>
            </div>
            <div className="mb-4">
              <p className="text-xs font-bold mb-2 ml-0.5 text-tertiaryText">
                Attach File
              </p>
              <div className="bg-[#F8F8FA] flex items-center justify-between text-xs font-bold h-[48px] px-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary">
                <p className="text-xs font-bold text-tertiaryText">
                  {fileDetails}
                </p>
                <label
                  className="h-[30px] w-[99px] flex justify-center items-center bg-[#E7ECF3] rounded text-sm text-[#48525C] font-medium"
                  htmlFor="files"
                >
                  Choose File
                </label>
                <input
                  onChange={(e) => {
                    handleFiles(e);
                  }}
                  type="file"
                  id="files"
                  className="hidden"
                  multiple
                />
              </div>
            </div>

            {/* =============button========== */}
            <div className="flex items-center space-x-3.5">
              <button
                onClick={() => handleSubmit()}
                className={`flex justify-center items-center space-x-2 p-3 w-full rounded-xl  group duration-300 bg-primary hover:shadow-primary/80 hover:shadow-lg modal-button-shadow"
                  `}
              >
                <div className="">
                  <TikSVG />
                </div>
                <span>Submit</span>
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
      </Modal>
    </div>
  );
};

export default SupportTicketModal;
