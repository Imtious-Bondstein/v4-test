import React, { useEffect, useState } from "react";
import Modal from "react-modal";

// import SVG
import TikSVG from "../SVG/modal/TikSVG";
import ReloadSVG from "../SVG/modal/ReloadSVG";
import CloseSVG from "../SVG/CloseSVG";

// import custom css
import "../../styles/components/modal.css";

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

const GeoFenceSettingsModal = ({
    isUpdating,
    settingsModalIsOpen,
    setSettingsModalIsOpen,
    eventData,
    setEventData,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    // const [exitCaption, setExitCaption] = useState('')
    // const [isEntry, setIsEntry] = useState(true)

    // const [entryCaption, setEntryCaption] = useState('')
    // const [isExit, setIsExit] = useState(true)

    const toggleClass = " transform translate-x-3";

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    const closeModal = async () => {
        setSettingsModalIsOpen(false);
    };

    const handleSubmitForm = () => {
        closeModal()
        if (!isUpdating) {
            setEventData({
                entry: {
                    message: '',
                    active: true
                },
                exit: {
                    message: '',
                    active: true
                },
            })
        }
    }

    const handleResetForm = () => {
        setExitCaption('')
        setEntryCaption('')
        setIsEntry('')
        setIsExit('')
    }

    // implement handleEventSet function
    const handleEventSet = (type, key, value) => {
        // if (type === 'entry') {
        //     setEntryCaption(value)
        // } else if (type === 'exit') {
        //     setExitCaption(value)
        // }
        setEventData({
            ...eventData,
            [type]: {
                ...eventData[type],
                [key]: value
                // [key]: value
            }

        })
    }

    return (
        <div>
            <Modal
                isOpen={settingsModalIsOpen}
                ariaHideApp={false}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                className={`absolute w-[320px] sm:w-[448px] p-5 bg-white h-[60vh]`}
                contentLabel="Settings Modal"
            >
                <div className="">
                    <h1 className="text-lg md:text-2xl font-bold text-center mb-6">
                        Settings
                    </h1>
                    <button
                        className=" fill-[#C9D1DA] hover:fill-quaternary absolute top-4 right-4"
                        onClick={closeModal}
                    >
                        <CloseSVG />
                    </button>
                    <form className="">
                        <div className="mb-8">
                            <h4 className="text-center md:text-lg text-base font-bold mb-3">Caption</h4>
                            <div className="mb-3.5">
                                <input
                                    onChange={(e) => handleEventSet('exit', 'message', e.target.value)}
                                    value={eventData.exit.message}
                                    className="bg-[#F8F8FA] text-xs font-bold py-3 md:py-4 px-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary mb-4"
                                    type="text"
                                    placeholder="Exit: Highway alert "
                                />
                                <input
                                    onChange={(e) => handleEventSet('entry', 'message', e.target.value)}
                                    value={eventData.entry.message}
                                    className="bg-[#F8F8FA] text-xs font-bold py-3 md:py-4 px-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary"
                                    type="text"
                                    placeholder="Entry: Green zone entry"
                                />
                            </div>
                        </div>

                        <div className="mb-8">
                            <h4 className="text-center md:text-lg text-base font-bold mb-3">Alert</h4>

                            <div className="flex justify-between px-10 items-center mb-3.5">

                                <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                                    <div>
                                        {/* toggle button start */}
                                        <div
                                            className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                            onClick={() => handleEventSet('exit', 'active', !eventData.exit.active)}
                                        >
                                            {/* Switch */}
                                            <div
                                                className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${!eventData.exit.active
                                                    ? "bg-[#C9D1DA]"
                                                    : `${toggleClass} bg-primary`
                                                    }`}
                                            ></div>
                                        </div>
                                        {/* toggle button end */}
                                    </div>
                                    <p>Geofence Entry</p>
                                </div>
                                <div className="flex items-center space-x-2 mr-4 text-sm text-[#8D96A1]">
                                    <div>
                                        {/* toggle button start */}
                                        <div
                                            className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                            onClick={() => handleEventSet('entry', 'active', !eventData.entry.active)}
                                        >
                                            {/* Switch */}
                                            <div
                                                className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${!eventData.entry.active
                                                    ? "bg-[#C9D1DA]"
                                                    : `${toggleClass} bg-primary`
                                                    }`}
                                            ></div>
                                        </div>
                                        {/* toggle button end */}
                                    </div>
                                    <p>Geofence Exit</p>
                                </div>
                            </div>
                        </div>

                        {/* =============button========== */}
                        <div className="flex items-center space-x-3.5">
                            <button
                                onClick={handleSubmitForm}
                                className="flex justify-center items-center space-x-2 p-3 w-full bg-primary rounded-xl modal-button-shadow group hover:shadow-lg hover:shadow-primary/80 duration-300"
                            >
                                <div className="">
                                    <TikSVG />
                                </div>
                                <span className="text-sm md:text-base">Update</span>
                            </button>
                            <button
                                onClick={handleResetForm}
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
            </Modal>
        </div>
    );
};

export default GeoFenceSettingsModal;