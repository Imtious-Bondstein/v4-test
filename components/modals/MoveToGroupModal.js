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

import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";

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

function MoveToGroupModal({
  isMoveToModal,
  setIsMoveToModal,
  handleMoveTo,
  groupId,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupsList, setGroupsList] = useState([]);

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
    setIsMoveToModal(false);
  }

  const handleCancel = () => {
    setSelectedGroup(null);
    setGroupName("");
  };
  const handleCreate = () => {
    console.log("create group");
  };

  const handleGroupSelect = (id) => {
    setSelectedGroup(id);
    handleMoveTo(id);
  };

  // get group list
  const getGroupList = async (id) => {
    await axios
      .get(`/api/v4/vehicle-group/list`)
      .then((res) => {
        console.log(" group detail res--", res.data.data);
        setGroupsList(res.data.data);
      })
      .catch((err) => {
        console.log("group detail error : ", err.response);
        // toast.error("err.response.data?.user_message");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    isMoveToModal && getGroupList();
    !isMoveToModal && setSelectedGroup(groupId);

    setSelectedGroup(groupId);
  }, [isMoveToModal]);

  return (
    <div className="overflow-hidden">
      <Modal
        isOpen={isMoveToModal}
        ariaHideApp={false}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        className={`absolute sm:w-[450px] w-[320px] h-[430px]  p-5 bg-white overflow-auto`}
        contentLabel="Example Modal"
      >
        <h1 className="text-sm sm:text-2xl font-bold text-center mb-6">
          Move To
        </h1>

        <button
          className=" fill-[#C9D1DA] hover:fill-quaternary absolute top-4 right-4"
          onClick={closeModal}
        >
          <CloseSVG />
        </button>

        <div className="">
          <div>
            <div className="mt-4 h-[330px] overflow-auto">
              {groupsList.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => handleGroupSelect(item.id)}
                    className={`w-full  p-5 rounded-xl mt-3 cursor-pointer duration-200 ${
                      selectedGroup == item.id ? "bg-gray-300" : "bg-inputGray"
                    } `}
                  >
                    <h1 className="font-bold text-primaryText">{item.group}</h1>
                    <p className="text-sm font-light">
                      Total Vehicles {item.t_vehicles} <br></br>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default MoveToGroupModal;
