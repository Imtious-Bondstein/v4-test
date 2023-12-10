import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import CloseSVG from "../SVG/CloseSVG";
import SearchCar from "../../components/SVG/SearchCarSVG";
// date-time-picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// import SVG
import RightArrowSVG from "../SVG/RightArrowSVG";
import Tik from "@/svg/TikSVG";

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
const selectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#F8F8FA",
    border: 0,
    padding: "5px 0",
    borderRadius: "8px",
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
  menuList: (provided) => ({
    ...provided,
    maxHeight: "210px",
    overflowY: "auto",
  }),
};

function AddNewVehicleGroupModal({
  isAddNewVehicleModal,
  setIsAddNewVehicleModal,
  groupName,
  groupId,
  handleAddNewVehicle,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState([]);

  const [vehicleOptions, setVehicleOptions] = useState([]);

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
    setIsAddNewVehicleModal(false);
  }

  const handleVehicleSelect = (selectedOption) => {
    setSelectedVehicle(selectedOption);
    console.log("Vehicle Select", selectedOption);
  };

  const handleReset = () => {
    setSelectedVehicle([]);
  };

  const getAllVehicles = async () => {
    await axios
      .get("/api/v4/vehicle-group/user-vehicle-list?param=0")
      .then((res) => {
        console.log("-- unassigned vehicle res--", res.data.data);

        let newVehicleOptions = [];
        res.data.data.forEach((element) => {
          const obj = {
            value: element.identifier,
            label: element.bst_id + " " + element.vrn,
          };
          newVehicleOptions.push(obj);
        });
        setVehicleOptions(newVehicleOptions);
      })
      .catch((err) => {
        console.log("unassigned vehicle error : ", err.response);
        // toast.error("err.response.data?.user_message");
      })
      .finally(() => setIsLoading(false));
  };

  // ===== vehicle list ====
  useEffect(() => {
    isAddNewVehicleModal && getAllVehicles();
    !isAddNewVehicleModal && setSelectedVehicle([]);
  }, [isAddNewVehicleModal]);

  return (
    <div>
      <Modal
        isOpen={isAddNewVehicleModal}
        ariaHideApp={false}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        className={`absolute sm:w-[600px] w-[320px] h-[500px]  p-5 bg-white overflow-auto`}
        contentLabel="Example Modal"
      >
        <h1 className="text-sm sm:text-2xl font-bold text-center mb-6">
          Add New Vehicle
        </h1>
        <h1 className="text-sm sm:text-lg font-bold text-center mb-6">
          {groupName}
        </h1>

        <button
          className=" fill-[#C9D1DA] hover:fill-quaternary absolute top-4 right-4"
          onClick={closeModal}
        >
          <CloseSVG />
        </button>

        <div className="">
          <div>
            <div className="mt-6">
              <Select
                id="vehicle"
                isMulti
                onChange={handleVehicleSelect}
                options={vehicleOptions}
                value={selectedVehicle}
                placeholder={"Select Vehicle"}
                styles={selectStyles}
              />
            </div>

            <div className="grid grid-cols-2 gap-5 items-center mt-8">
              <button
                onClick={() => handleAddNewVehicle(selectedVehicle)}
                className="flex items-center justify-center space-x-2 h-[50px] bg-primary rounded-xl text-primaryText  hover:shadow-lg hover:shadow-primary/60 duration-300"
              >
                <Tik />
                <span>Add</span>
              </button>
              <button
                onClick={handleReset}
                className=" h-[50px] bg-buttonGray rounded-xl text-primaryText hover:shadow-lg duration-300"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default AddNewVehicleGroupModal;
