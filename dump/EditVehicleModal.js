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

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "20px",
        width: "448px",
    },
    overlay: {
        background: "#1E1E1E40",
        zIndex: "1100",
    },
};

const EditVehicleAlertModal = ({
    selectedVehicle,
    setEditModalIsOpen,
    editModalIsOpen,
}) => {
    const [isLoading, setIsLoading] = useState(false)

    const [overspeed, setOverspeed] = useState("");
    const [acceleration, setAcceleration] = useState("");
    const [brake, setBrake] = useState("");

    const [notificationEmailEngineOn, setNotificationEmailEngineOn] = useState(false);
    const [notificationSmsEngineOn, setNotificationSmsEngineOn] = useState(false);

    const [notificationEngineEmailOff, setNotificationEngineEmailOff] = useState(false);
    const [notificationEngineSmsOff, setNotificationEngineSmsOff] = useState(false);

    const [notificationEmailPanic, setNotificationEmailPanic] = useState(false);
    const [notificationSmsPanic, setNotificationSmsPanic] = useState(false);

    const [notificationEmailOverspeed, setNotificationEmailOverspeed] = useState(false);
    const [notificationSmsOverspeed, setNotificationSmsOverspeed] = useState(false);

    const [notificationEmailOffline, setNotificationEmailOffline] = useState(false);
    const [notificationSmsOffline, setNotificationSmsOffline] = useState(false);

    const [notificationEmailDisconnect, setNotificationEmailDisconnect] = useState(false);
    const [notificationSmsDisconnect, setNotificationSmsDisconnect] = useState(false);

    console.log("selectedVehicle", selectedVehicle);

    console.log("editModalIsOpen", editModalIsOpen);

    const toggleClass = " transform translate-x-3";

    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setEditModalIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        setEditModalIsOpen(false);
    }

    const handleNotificationEngineOn = (data, fieldName) => {
        if (fieldName === "email") {
            setNotificationEngineOn({
                ...notificationEngineOn,
                email: data,
            });
        } else if (fieldName === "sms") {
            setNotificationEngineOn({
                ...notificationEngineOn,
                sms: data,
            });
        }
    };

    const handleNotificationEngineOff = (data, fieldName) => {
        if (fieldName === "email") {
            setNotificationEngineOff({
                ...notificationEngineOff,
                email: data,
            });
        } else if (fieldName === "sms") {
            setNotificationEngineOff({
                ...notificationEngineOff,
                sms: data,
            });
        }
    };

    const handleNotificationPanic = (data, fieldName) => {
        if (fieldName === "email") {
            setNotificationPanic({
                ...notificationPanic,
                email: data,
            });
        } else if (fieldName === "sms") {
            setNotificationPanic({
                ...notificationPanic,
                sms: data,
            });
        }
    };

    const handleNotificationOverspeed = (data, fieldName) => {
        if (fieldName === "email") {
            setNotificationOverspeed({
                ...notificationOverspeed,
                email: data,
            });
        } else if (fieldName === "sms") {
            setNotificationOverspeed({
                ...notificationOverspeed,
                sms: data,
            });
        }
    };

    const handleNotificationOffline = (data, fieldName) => {
        if (fieldName === "email") {
            setNotificationOffline({
                ...notificationOffline,
                email: data,
            });
        } else if (fieldName === "sms") {
            setNotificationOffline({
                ...notificationOffline,
                sms: data,
            });
        }
    };

    const handleNotificationDisconnect = (data, fieldName) => {
        if (fieldName === "email") {
            setNotificationDisconnect({
                ...notificationDisconnect,
                email: data,
            });
        } else if (fieldName === "sms") {
            setNotificationDisconnect({
                ...notificationDisconnect,
                sms: data,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            overspeed: overspeed,
            acceleration: acceleration,
            brake: brake,
            notificationEngineOn: notificationEngineOn,
            notificationEngineOff: notificationEngineOff,
            notificationPanic: notificationPanic,
            notificationOverspeed: notificationOverspeed,
            notificationOffline: notificationOffline,
            notificationDisconnect: notificationDisconnect,
        };
        console.log("data:", data);
    };

    const clearForm = () => {
        // e.target.reset();
        console.log("calling");
        setName("");
        setRole("");
        setDateRange({
            startDate: null,
            startTime: null,
            endDate: null,
            endTime: null,
        });
        setActive(null);
    };

    //======load data single data=====
    const fetchSingleAlertData = (identifier) => {
        setIsLoading(true)
        axios
            .get(`/api/v4/alert-management/alert-settings-edit?identifier=${identifier}`)
            .then((res) => {
                const alertData = res.data.alertManagement;
                console.log("Alert Manage single data------", alertData);
                //=========set state=========
                setNotificationEmailEngineOn(alertData.engine_on_email)
                setNotificationSmsEngineOn(alertData.engine_on_sms)

                setNotificationEngineEmailOff(alertData.engine_off_email)
                setNotificationEngineSmsOff(alertData.engine_off_sms)

                setNotificationEmailPanic(alertData.engine_on_email)
                setNotificationSmsPanic(alertData.engine_on_email)

                setNotificationEmailOverspeed(alertData.engine_on_email)
                setNotificationSmsOverspeed(alertData.engine_on_email)

                setNotificationEmailOffline(alertData.engine_on_email)
                setNotificationSmsOffline(alertData.engine_on_email)

                setNotificationEmailDisconnect(alertData.engine_on_email)
                setNotificationSmsDisconnect(alertData.engine_on_email)

            })
            .catch((err) => {
                console.log(err.response.statusText);
                // errorNotify(err.response.statusText);
            })
            .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        console.log('props selected vehicle', selectedVehicle);
        fetchSingleAlertData(selectedVehicle?.identifier)
    }, [selectedVehicle])

    return (
        <div>
            {isLoading ?
                <div >
                    <LoadingScreen />
                </div>
                :
                <Modal
                    isOpen={editModalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    {/* <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2> */}
                    <h1 className="text-2xl font-bold text-center mb-6">
                        Edit Vehicle Alert
                    </h1>
                    <button
                        className=" fill-[#C9D1DA] hover:fill-quaternary absolute top-4 right-4"
                        onClick={closeModal}
                    >
                        <CloseSVG />
                    </button>
                    <div className="fill-quaternary flex items-center bg-secondary rounded-xl space-x-4 p-4 mb-3.5">
                        <SearchCar />
                        <p className="text-xs font-bold">TMV21541: DM LA 18-4479</p>
                    </div>
                    <form onSubmit={handleSubmit} className="">
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
                            <input
                                onChange={(e) => setOverspeed(e.target.value)}
                                value={overspeed}
                                className="bg-[#F8F8FA] text-xs font-bold p-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                                type="text"
                                placeholder="Harsh Acceleration EX: 3.300 M/S²"
                            />
                        </div>

                        <div className="mb-3.5">
                            <input
                                onChange={(e) => setAcceleration(e.target.value)}
                                value={acceleration}
                                className="bg-[#F8F8FA] text-xs font-bold p-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                                type="text"
                                placeholder="Harsh Acceleration EX: 3.300 M/S²"
                            />
                        </div>

                        <div className="mb-7">
                            <input
                                onChange={(e) => setBrake(e.target.value)}
                                value={brake}
                                className="bg-[#F8F8FA] text-xs font-bold p-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                                type="text"
                                placeholder="Harsh Break EX: 3.300 M/S²"
                            />
                        </div>

                        <div className="mb-8">
                            <h1 className="text-lg font-bold mb-5">Set Notification</h1>
                            {/* ==========engine on========== */}
                            <div className="flex  justify-between items-center mb-3.5">
                                <p className="font-semibold text-[#48525C] w-36">Engine on:</p>
                                <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                                    <p>Email</p>
                                    <div>
                                        {/* toggle button start */}
                                        <div
                                            className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        // onClick={() =>
                                        //   handleNotificationEngineOn(
                                        //     !notificationEngineOn.email,
                                        //     "email"
                                        //   )
                                        // }
                                        >
                                            {/* Switch */}
                                            <div
                                                className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${!notificationEmailEngineOn
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
                                        // onClick={() =>
                                        //   handleNotificationEngineOn(
                                        //     !notificationEngineOn.sms,
                                        //     "sms"
                                        //   )
                                        // }
                                        >
                                            {/* Switch */}
                                            <div
                                                className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${!notificationSmsEngineOn
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
                                <p className="font-semibold text-[#48525C] w-36">Engine off:</p>
                                <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                                    <p>Email</p>
                                    <div>
                                        {/* toggle button start */}
                                        <div
                                            className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        // onClick={() =>
                                        //   handleNotificationEngineOff(
                                        //     !notificationEngineOff.email,
                                        //     "email"
                                        //   )
                                        // }
                                        >
                                            {/* Switch */}
                                            <div
                                                className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${!notificationEngineEmailOff
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
                                        // onClick={() =>
                                        //   handleNotificationEngineOff(
                                        //     !notificationEngineOff.sms,
                                        //     "sms"
                                        //   )
                                        // }
                                        >
                                            {/* Switch */}
                                            <div
                                                className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${!notificationEngineSmsOff
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
                                <p className="font-semibold text-[#48525C] w-36">Panic:</p>
                                <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                                    <p>Email</p>
                                    <div>
                                        {/* toggle button start */}
                                        <div
                                            className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        // onClick={() =>
                                        //   handleNotificationPanic(!notificationPanic.email, "email")
                                        // }
                                        >
                                            {/* Switch */}
                                            <div
                                                className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${!notificationEmailPanic
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
                                        // onClick={() =>
                                        //   handleNotificationPanic(!notificationPanic.sms, "sms")
                                        // }
                                        >
                                            {/* Switch */}
                                            <div
                                                className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${!notificationSmsPanic
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
                                <p className="font-semibold text-[#48525C] w-36">Overspeed:</p>
                                <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                                    <p>Email</p>
                                    <div>
                                        {/* toggle button start */}
                                        <div
                                            className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        // onClick={() =>
                                        //   handleNotificationOverspeed(
                                        //     !notificationOverspeed.email,
                                        //     "email"
                                        //   )
                                        // }
                                        >
                                            {/* Switch */}
                                            <div
                                                className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${!notificationEmailOverspeed
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
                                        // onClick={() =>
                                        //   handleNotificationOverspeed(
                                        //     !notificationOverspeed.sms,
                                        //     "sms"
                                        //   )
                                        // }
                                        >
                                            {/* Switch */}
                                            <div
                                                className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${!notificationSmsOverspeed
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
                                <p className="font-semibold text-[#48525C] w-36">Offline:</p>
                                <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                                    <p>Email</p>
                                    <div>
                                        {/* toggle button start */}
                                        <div
                                            className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        // onClick={() =>
                                        //   handleNotificationOffline(
                                        //     !notificationOffline.email,
                                        //     "email"
                                        //   )
                                        // }
                                        >
                                            {/* Switch */}
                                            <div
                                                className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${!notificationEmailOffline
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
                                        // onClick={() =>
                                        //   handleNotificationOffline(!notificationOffline.sms, "sms")
                                        // }
                                        >
                                            {/* Switch */}
                                            <div
                                                className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${notificationSmsOffline
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
                                <p className="font-semibold text-[#48525C] w-36">Disconnect:</p>
                                <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                                    <p>Email</p>
                                    <div>
                                        {/* toggle button start */}
                                        <div
                                            className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        // onClick={() =>
                                        //   handleNotificationDisconnect(
                                        //     !notificationDisconnect.email,
                                        //     "email"
                                        //   )
                                        // }
                                        >
                                            {/* Switch */}
                                            <div
                                                className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${!notificationEmailDisconnect
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
                                        // onClick={() =>
                                        //   handleNotificationDisconnect(
                                        //     !notificationDisconnect.sms,
                                        //     "sms"
                                        //   )
                                        // }
                                        >
                                            {/* Switch */}
                                            <div
                                                className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${!notificationSmsDisconnect
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
                                className="flex justify-center items-center space-x-2 p-3 w-full bg-primary rounded-xl modal-button-shadow group hover:shadow-lg hover:shadow-primary/80 duration-300"
                            >
                                <div className="">
                                    <TikSVG />
                                </div>
                                <span>Update</span>
                            </button>
                            <button
                                onClick={clearForm}
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
                    </form>
                </Modal>
            }
        </div>
    );
};

export default EditVehicleAlertModal;
