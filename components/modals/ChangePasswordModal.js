import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import CloseSVG from "../SVG/CloseSVG";
// import custom css
import "../../styles/components/modal.css";
import axios from "@/plugins/axios";
import { vehicleRouteDateTimePicker } from "@/utils/dateTimeConverter";
import { ToastContainer, toast } from "react-toastify";

import TikSVG from "../SVG/modal/TikSVG";
import ReloadSVG from "../SVG/modal/ReloadSVG";
import { UPDATE_USER_NEW } from "@/store/slices/authSlice";
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

const ChangePasswordModal = ({
  changePasswordModalIsOpen,
  setChangePasswordModalIsOpen,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.reducer.auth.user);

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setChangePasswordModalIsOpen(false);
  }
  const handleUpdate = async () => {
    const data =
      user.is_first_login === true
        ? {
            password: newPassword,
            password_confirmation: confirmPassword,
          }
        : {
            old_password: currentPassword,
            password: newPassword,
            password_confirmation: confirmPassword,
          };
    await axios
      .post("/api/v4/update-profile", data)
      .then((res) => {
        console.log("password change res : ", res.data.user_message);
        toast.success(res.data.user_message);
        res.data.code === 200
          ? dispatch(UPDATE_USER_NEW({ is_first_login: false }))
          : "";
        closeModal();
        handleReset();
      })
      .catch((err) => {
        console.log("password change err : ", err.response.data.user_message);
        toast.error(err.response.data.user_message);
      })
      .finally(() => {});
  };
  function handleReset() {
    setConfirmPassword("");
    setNewPassword("");
    setCurrentPassword("");
  }

  return (
    <div>
      <Modal
        isOpen={changePasswordModalIsOpen}
        ariaHideApp={false}
        onAfterOpen={afterOpenModal}
        onRequestClose={user.is_first_login ? "" : closeModal}
        style={customStyles}
        className={`absolute sm:w-[450px] w-[320px] h-[360px]  p-5 bg-white overflow-auto`}
        contentLabel="Example Modal"
      >
        {user.is_first_login === true ? (
          ""
        ) : (
          <div className="">
            <button
              className=" fill-[#C9D1DA] hover:fill-quaternary absolute top-4 right-4"
              onClick={closeModal}
            >
              <CloseSVG />
            </button>
          </div>
        )}
        <h1 className="text-sm sm:text-2xl font-bold text-center mb-6">
          Change Password
        </h1>

        {user.is_first_login === true ? (
          ""
        ) : (
          <div className="">
            <input
              onChange={(event) => setCurrentPassword(event.target.value)}
              value={currentPassword}
              className="text-sm py-[15px] px-[20px] w-full placeholder:text-tmvGray font-semibold outline-none bg-inputGray rounded-xl"
              type="password"
              placeholder="Current Password*"
            />
          </div>
        )}
        <div className="mt-[15px]">
          <input
            onChange={(event) => setNewPassword(event.target.value)}
            value={newPassword}
            className="text-sm py-[15px] px-[20px] w-full placeholder:text-tmvGray font-semibold outline-none bg-inputGray rounded-xl"
            type="password"
            placeholder="New Password*"
          />
        </div>
        <div className="mt-[15px]">
          <input
            onChange={(event) => setConfirmPassword(event.target.value)}
            value={confirmPassword}
            className="text-sm py-[15px] px-[20px] w-full placeholder:text-tmvGray font-semibold outline-none bg-inputGray rounded-xl"
            type="password"
            placeholder="Confirm Password*"
          />
        </div>

        {/* =============button========== */}
        <div className="flex items-center space-x-3.5 mt-[15px]">
          <button
            onClick={() => handleUpdate()}
            className={` flex justify-center items-center space-x-2 p-3 w-full rounded-xl  group duration-300 bg-primary hover:shadow-primary/80 hover:shadow-lg modal-button-shadow`}
          >
            <div className="">
              <TikSVG />
            </div>
            <span>Update</span>
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
      </Modal>
    </div>
  );
};

export default ChangePasswordModal;
