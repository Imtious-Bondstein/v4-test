import React, { useEffect, useRef, useState } from "react";

const VehiclePeriodSelector = ({ selectedPeriod, setSelectedPeriod }) => {
    // transition effect start
    // const [activeTabIndex, setActiveTabIndex] = useState(0);
    // const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
    // const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

    // const tabsRef = useRef([]);
    // transition effect end
    const vehiclePeriods = ["Today", "Yesterday", "Last 7 Days"];

    // function setTabPosition() {
    //     const currentTab = tabsRef.current[activeTabIndex];
    //     console.log(currentTab?.offsetLeft, currentTab?.clientWidth);
    //     setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
    //     setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
    // }

    // useEffect(() => {
    //     // setSelectedPeriod('all')
    //     setTabPosition();
    //     window.addEventListener("resize", setTabPosition);

    //     return () => window.removeEventListener("resize", setTabPosition);
    // }, [activeTabIndex]);

    // useEffect(() => {
    //     // make selectedPeriod first letter uppercase
    //     const updateSelectedStatus = selectedPeriod ? selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1) : ''
    //     const statusIndex = vehicleStatus.indexOf(updateSelectedStatus)
    //     statusIndex !== -1 && setActiveTabIndex(statusIndex)
    // }, [selectedPeriod])
    return (
        // <div className="relative select-none">
        //     <div className="flex space-x-5 text-sm">
        //         {vehicleStatus.map((time, idx) => {
        //             return (
        //                 <button
        //                     key={idx}
        //                     ref={(el) => (tabsRef.current[idx] = el)}
        //                     className="p-[10px] cursor-pointer  hover:text-primaryText z-10"
        //                     onClick={() => {
        //                         setSelectedPeriod(time.toLowerCase());
        //                         setActiveTabIndex(idx);
        //                     }}
        //                 // onClick={() => setActiveTabIndex(idx)}
        //                 >
        //                     {time}
        //                 </button>
        //             );
        //         })}
        //     </div>
        //     <span
        //         className="absolute top-1.5 block h-8 shadow-md bg-primary shadow-primary/50 text-primaryText rounded-full"
        //         style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
        //     />
        // </div>
        <div className="flex items-center space-x-2 text-sm">
            {vehiclePeriods.map((period, idx) => {
                return (
                    <button
                        key={idx}
                        className="hover:bg-primary/20 hover:text-quaternary bg-gray-100 text-primaryText rounded-full py-1.5 px-3"
                        onClick={() => {
                            setSelectedPeriod(period.toLowerCase());
                        }}>
                        {period}
                    </button>
                )
            })}
        </div>
    );
};

export default VehiclePeriodSelector;
