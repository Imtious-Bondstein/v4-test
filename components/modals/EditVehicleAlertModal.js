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
import LoadingScreen from "../LoadingScreen";
import { async } from "regenerator-runtime";

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

const EditVehicleAlertModal = ({
  editModalIsOpen,
  setEditModalIsOpen,
  selectedVehicle,
  fetchTableData,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [initialData, setInitialData] = useState({});

  const [bstId, setBstId] = useState("");
  const [overspeed, setOverspeed] = useState("");
  const [acceleration, setAcceleration] = useState("");
  const [brake, setBrake] = useState("");

  const [notificationEmailEngineOn, setNotificationEmailEngineOn] =
    useState(false);
  const [notificationSmsEngineOn, setNotificationSmsEngineOn] = useState(false);

  const [notificationEmailEngineOff, setNotificationEmailEngineOff] =
    useState(false);
  const [notificationSmsEngineOff, setNotificationSmsEngineOff] =
    useState(false);

  const [notificationEmailPanic, setNotificationEmailPanic] = useState(false);
  const [notificationSmsPanic, setNotificationSmsPanic] = useState(false);

  const [notificationEmailOverspeed, setNotificationEmailOverspeed] =
    useState(false);
  const [notificationSmsOverspeed, setNotificationSmsOverspeed] =
    useState(false);

  const [notificationEmailOffline, setNotificationEmailOffline] =
    useState(false);
  const [notificationSmsOffline, setNotificationSmsOffline] = useState(false);

  const [notificationEmailDisconnect, setNotificationEmailDisconnect] =
    useState(false);
  const [notificationSmsDisconnect, setNotificationSmsDisconnect] =
    useState(false);

  // console.log("--- selectedVehicle", selectedVehicle);

  // console.log("editModalIsOpen", editModalIsOpen);

  const toggleClass = " transform translate-x-3";

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setEditModalIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  const closeModal = async () => {
    setEditModalIsOpen(false);
  };

  //=========update Alert Management=========
  const updateAlertManagement = async (identifier, data) => {
    await axios
      .post(
        `/api/v4/alert-management/alert-settings-update?identifier=${identifier}`,
        data
      )
      .then((res) => {
        console.log("update Alert Management res------", res);
        closeModal();
        fetchTableData();
      })
      .catch((err) => {
        console.log(err.response.statusText);
        errorNotify(err.response.statusText);
      });
  };

  const updateVehicle = async (e) => {
    e.preventDefault();

    const data = {
      speed: overspeed,
      harsh_acceleration: acceleration,
      harsh_break: brake,

      engine_on_email: notificationEmailEngineOn,
      engine_on_sms: notificationSmsEngineOn,
      engine_off_email: notificationEmailEngineOff,
      engine_off_sms: notificationSmsEngineOff,
      panic_email: notificationEmailPanic,
      panic_sms: notificationSmsPanic,
      disconnect_email: notificationEmailDisconnect,
      disconnect_sms: notificationSmsDisconnect,
      offline_email: notificationEmailOffline,
      offline_sms: notificationSmsOffline,
      overspeed_email: notificationEmailOverspeed,
      overspeed_sms: notificationSmsOverspeed,
    };
    console.log(" update:", data);
    await updateAlertManagement(selectedVehicle?.identifier, data);
    // await closeModal();
  };

  const resetVehicle = async (e) => {
    e.preventDefault();

    setOverspeed(initialData.speed);
    setAcceleration(initialData.harsh_acceleration);
    setBrake(initialData.harsh_break);

    setNotificationEmailEngineOn(initialData.engine_on_email);
    setNotificationSmsEngineOn(initialData.engine_on_sms);

    setNotificationEmailEngineOff(initialData.engine_off_email);
    setNotificationSmsEngineOff(initialData.engine_off_sms);

    setNotificationEmailPanic(initialData.panic_email);
    setNotificationSmsPanic(initialData.panic_sms);

    setNotificationEmailOverspeed(initialData.overspeed_email);
    setNotificationSmsOverspeed(initialData.overspeed_sms);

    setNotificationEmailOffline(initialData.offline_email);
    setNotificationSmsOffline(initialData.offline_sms);

    setNotificationEmailDisconnect(initialData.disconnect_email);
    setNotificationSmsDisconnect(initialData.disconnect_sms);
  };

  //======load data single data=====
  const fetchSingleAlertData = (identifier) => {
    setInitialData();
    setIsLoading(true);
    axios
      .get(
        `/api/v4/alert-management/alert-settings-edit?identifier=${identifier}`
      )
      .then((res) => {
        const alertData = res.data.alertManagement;
        setInitialData(alertData);
        console.log("--get data------", alertData);

        //=========set state=========
        setBstId(alertData.bst_id);
        setOverspeed(alertData.speed);
        setAcceleration(alertData.harsh_acceleration);
        setBrake(alertData.harsh_break);

        setNotificationEmailEngineOn(alertData.engine_on_email);
        setNotificationSmsEngineOn(alertData.engine_on_sms);

        setNotificationEmailEngineOff(alertData.engine_off_email);
        setNotificationSmsEngineOff(alertData.engine_off_sms);

        setNotificationEmailPanic(alertData.panic_email);
        setNotificationSmsPanic(alertData.panic_sms);

        setNotificationEmailOverspeed(alertData.overspeed_email);
        setNotificationSmsOverspeed(alertData.overspeed_sms);

        setNotificationEmailOffline(alertData.offline_email);
        setNotificationSmsOffline(alertData.offline_sms);

        setNotificationEmailDisconnect(alertData.disconnect_email);
        setNotificationSmsDisconnect(alertData.disconnect_sms);
      })
      .catch((err) => {
        console.log(err.response);
        errorNotify(err.response.statusText);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    console.log("props selected vehicle", selectedVehicle);
    if (selectedVehicle.identifier) {
      fetchSingleAlertData(selectedVehicle.identifier);
    }
  }, [selectedVehicle]);

  useEffect(() => {
    console.log("-->> initialData:", initialData);
  }, [initialData]);

  const errorNotify = (mgs) => {
    toast.error(mgs, {
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <div>
      <ToastContainer />

      <Modal
        isOpen={editModalIsOpen}
        ariaHideApp={false}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        className={`absolute w-[320px] sm:w-[448px] p-5 bg-white overflow-y-scroll h-[75vh] md:h-[85vh]`}
        contentLabel="Example Modal"
      >
        {isLoading ? (
          <div>
            <LoadingScreen />
          </div>
        ) : (
          <div className="">
            <h1 className="text-lg md:text-2xl font-bold text-center mb-6">
              Edit Vehicle Alert
            </h1>
            <button
              className=" fill-[#C9D1DA] hover:fill-quaternary absolute top-4 right-4"
              onClick={closeModal}
            >
              <CloseSVG />
            </button>
            <div className="fill-quaternary flex items-center bg-secondary rounded-xl space-x-4 py-3 md:py-4 px-4 mb-3.5">
              <SearchCar />
              <p className="text-xs font-bold">{bstId}</p>
            </div>
            <form className="">
              <div className="mb-3.5">
                {/* <select
              onChange={(e) => setOverspeed(e.target.value)}
              value={overspeed}
              className="w-full px-3 py-4 bg-[#F8F8FA] text-xs font-bold placeholder:text-tertiaryText rounded-xl z-40 outline-quaternary"
            >
              <option value="">Overspeed EX: 00 Km/h</option>
              <option value="duty">Duty</option>
              <option value="duty">Duty</option>
            </select> */}
                <label className="font-semibold text-tmvDarkGray text-sm ">
                  Overspeed
                </label>
                <input
                  onChange={(e) => setOverspeed(e.target.value)}
                  value={overspeed}
                  className="bg-[#F8F8FA] text-xs font-bold py-3 md:py-4 px-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                  type="text"
                  placeholder="Overspeed EX: 00 Km/h"
                />
              </div>

              <div className="mb-3.5">
                <label className="font-semibold text-tmvDarkGray text-sm ">
                  Harsh Acceleration
                </label>
                <input
                  onChange={(e) => setAcceleration(e.target.value)}
                  value={acceleration}
                  className="bg-[#F8F8FA] text-xs font-bold py-3 md:py-4 px-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                  type="text"
                  placeholder="Harsh Acceleration EX: 3.300 M/S²"
                />
              </div>

              <div className="mb-7">
                <label className="font-semibold text-tmvDarkGray text-sm ">
                  Harsh Break
                </label>
                <input
                  onChange={(e) => setBrake(e.target.value)}
                  value={brake}
                  className="bg-[#F8F8FA] text-xs font-bold py-3 md:py-4 px-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                  type="text"
                  placeholder="Harsh Break EX: 3.300 M/S²"
                />
              </div>

              <div className="mb-8">
                <h1 className="text-lg font-bold mb-5">Set Notification</h1>
                {/* ==========engine on========== */}
                <div className="flex  justify-between items-center mb-3.5">
                  <p className="font-semibold text-tmvDarkGray w-36">
                    Engine on:
                  </p>
                  <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                    <p>Email</p>
                    <div>
                      {/* toggle button start */}
                      <div
                        className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                        onClick={() =>
                          setNotificationEmailEngineOn(
                            !notificationEmailEngineOn
                          )
                        }
                      >
                        {/* Switch */}
                        <div
                          className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                            !notificationEmailEngineOn
                              ? "bg-[#C9D1DA]"
                              : `${toggleClass} bg-primary`
                          }`}
                        ></div>
                      </div>
                      {/* toggle button end */}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                    <p>Sms</p>
                    <div>
                      {/* toggle button start */}
                      <div
                        className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                        onClick={() =>
                          setNotificationSmsEngineOn(!notificationSmsEngineOn)
                        }
                      >
                        {/* Switch */}
                        <div
                          className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                            !notificationSmsEngineOn
                              ? "bg-[#C9D1DA]"
                              : `${toggleClass} bg-primary`
                          }`}
                        ></div>
                      </div>
                      {/* toggle button end */}
                    </div>
                  </div>
                </div>
                {/* ========engine off======== */}
                <div className="flex  justify-between items-center mb-3.5">
                  <p className="font-semibold text-tmvDarkGray w-36">
                    Engine off:
                  </p>
                  <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                    <p>Email</p>
                    <div>
                      {/* toggle button start */}
                      <div
                        className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                        onClick={() =>
                          setNotificationEmailEngineOff(
                            !notificationEmailEngineOff
                          )
                        }
                      >
                        {/* Switch */}
                        <div
                          className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                            !notificationEmailEngineOff
                              ? "bg-[#C9D1DA]"
                              : `${toggleClass} bg-primary`
                          }`}
                        ></div>
                      </div>
                      {/* toggle button end */}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                    <p>Sms</p>
                    <div>
                      {/* toggle button start */}
                      <div
                        className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                        onClick={() =>
                          setNotificationSmsEngineOff(!notificationSmsEngineOff)
                        }
                      >
                        {/* Switch */}
                        <div
                          className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                            !notificationSmsEngineOff
                              ? "bg-[#C9D1DA]"
                              : `${toggleClass} bg-primary`
                          }`}
                        ></div>
                      </div>
                      {/* toggle button end */}
                    </div>
                  </div>
                </div>
                {/* ===============panic=========== */}
                <div className="flex  justify-between items-center mb-3.5">
                  <p className="font-semibold text-tmvDarkGray w-36">Panic:</p>
                  <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                    <p>Email</p>
                    <div>
                      {/* toggle button start */}
                      <div
                        className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                        onClick={() =>
                          setNotificationEmailPanic(!notificationEmailPanic)
                        }
                      >
                        {/* Switch */}
                        <div
                          className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                            !notificationEmailPanic
                              ? "bg-[#C9D1DA]"
                              : `${toggleClass} bg-primary`
                          }`}
                        ></div>
                      </div>
                      {/* toggle button end */}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                    <p>Sms</p>
                    <div>
                      {/* toggle button start */}
                      <div
                        className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                        onClick={() =>
                          setNotificationSmsPanic(!notificationSmsPanic)
                        }
                      >
                        {/* Switch */}
                        <div
                          className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                            !notificationSmsPanic
                              ? "bg-[#C9D1DA]"
                              : `${toggleClass} bg-primary`
                          }`}
                        ></div>
                      </div>
                      {/* toggle button end */}
                    </div>
                  </div>
                </div>
                {/* ============overspeed=========== */}
                <div className="flex  justify-between items-center mb-3.5">
                  <p className="font-semibold text-tmvDarkGray w-36">
                    Overspeed:
                  </p>
                  <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                    <p>Email</p>
                    <div>
                      {/* toggle button start */}
                      <div
                        className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                        onClick={() =>
                          setNotificationEmailOverspeed(
                            !notificationEmailOverspeed
                          )
                        }
                      >
                        {/* Switch */}
                        <div
                          className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                            !notificationEmailOverspeed
                              ? "bg-[#C9D1DA]"
                              : `${toggleClass} bg-primary`
                          }`}
                        ></div>
                      </div>
                      {/* toggle button end */}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                    <p>Sms</p>
                    <div>
                      {/* toggle button start */}
                      <div
                        className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                        onClick={() =>
                          setNotificationSmsOverspeed(!notificationSmsOverspeed)
                        }
                      >
                        {/* Switch */}
                        <div
                          className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                            !notificationSmsOverspeed
                              ? "bg-[#C9D1DA]"
                              : `${toggleClass} bg-primary`
                          }`}
                        ></div>
                      </div>
                      {/* toggle button end */}
                    </div>
                  </div>
                </div>
                {/* ================offline============= */}
                <div className="flex  justify-between items-center mb-3.5">
                  <p className="font-semibold text-tmvDarkGray w-36">
                    Offline:
                  </p>
                  <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                    <p>Email</p>
                    <div>
                      {/* toggle button start */}
                      <div
                        className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                        onClick={() =>
                          setNotificationEmailOffline(!notificationEmailOffline)
                        }
                      >
                        {/* Switch */}
                        <div
                          className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                            !notificationEmailOffline
                              ? "bg-[#C9D1DA]"
                              : `${toggleClass} bg-primary`
                          }`}
                        ></div>
                      </div>
                      {/* toggle button end */}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                    <p>Sms</p>
                    <div>
                      {/* toggle button start */}
                      <div
                        className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                        onClick={() =>
                          setNotificationSmsOffline(!notificationSmsOffline)
                        }
                      >
                        {/* Switch */}
                        <div
                          className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                            !notificationSmsOffline
                              ? "bg-[#C9D1DA]"
                              : `${toggleClass} bg-primary`
                          }`}
                        ></div>
                      </div>
                      {/* toggle button end */}
                    </div>
                  </div>
                </div>
                {/* =========disconnect======== */}
                <div className="flex  justify-between items-center mb-3.5">
                  <p className="font-semibold text-dartmvDarkGraykGray w-36">
                    Disconnect:
                  </p>
                  <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                    <p>Email</p>
                    <div>
                      {/* toggle button start */}
                      <div
                        className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                        onClick={() =>
                          setNotificationEmailDisconnect(
                            !notificationEmailDisconnect
                          )
                        }
                      >
                        {/* Switch */}
                        <div
                          className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                            !notificationEmailDisconnect
                              ? "bg-[#C9D1DA]"
                              : `${toggleClass} bg-primary`
                          }`}
                        ></div>
                      </div>
                      {/* toggle button end */}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                    <p>Sms</p>
                    <div>
                      {/* toggle button start */}
                      <div
                        className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                        onClick={() =>
                          setNotificationSmsDisconnect(
                            !notificationSmsDisconnect
                          )
                        }
                      >
                        {/* Switch */}
                        <div
                          className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                            !notificationSmsDisconnect
                              ? "bg-[#C9D1DA]"
                              : `${toggleClass} bg-primary`
                          }`}
                        ></div>
                      </div>
                      {/* toggle button end */}
                    </div>
                  </div>
                </div>
              </div>

              {/* =============button========== */}
              <div className="flex items-center space-x-3.5">
                <button
                  type="submit"
                  onClick={updateVehicle}
                  className="flex justify-center items-center space-x-2 p-3 w-full bg-primary rounded-xl modal-button-shadow group hover:shadow-lg hover:shadow-primary/80 duration-300"
                >
                  <div className="">
                    <TikSVG />
                  </div>
                  <span className="text-sm md:text-base">Update</span>
                </button>
                <button
                  type="submit"
                  onClick={resetVehicle}
                  className="flex justify-center items-center space-x-2 p-3 w-full bg-[#e7ecf3] rounded-xl group hover:bg-[#1E1E1E]"
                >
                  <div className=" group-hover:fill-[#e7ecf3] fill-[#1E1E1E] group-hover:animate-spinLeftOne">
                    <ReloadSVG />
                  </div>
                  <span className="group-hover:text-[#e7ecf3] text-[#1E1E1E] text-sm md:text-base">
                    Reset
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EditVehicleAlertModal;
