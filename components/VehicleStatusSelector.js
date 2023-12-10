import React, { useEffect, useRef, useState } from "react";

const VehicleStatusSelector = ({
  selectedStatus,
  setSelectedStatus,
  showMap,
  setShowMap,
}) => {
  // transition effect start
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

  const tabsRef = useRef([]);
  // transition effect end
  const vehicleStatus = ["All", "Offline", "Online", "Suspended"];

  function setTabPosition() {
    const currentTab = tabsRef.current[activeTabIndex];
    console.log(currentTab?.offsetLeft, currentTab?.clientWidth);
    setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
    setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
  }

  useEffect(() => {
    // setSelectedStatus('all')
    setTabPosition();
    window.addEventListener("resize", setTabPosition);

    return () => window.removeEventListener("resize", setTabPosition);
  }, [activeTabIndex]);

  useEffect(() => {
    // make selectedStatus first letter uppercase
    const updateSelectedStatus = selectedStatus
      ? selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)
      : "";
    const statusIndex = vehicleStatus.indexOf(updateSelectedStatus);
    statusIndex !== -1 && setActiveTabIndex(statusIndex);
  }, [selectedStatus]);
  return (
    <div className="relative select-none">
      <div className="flex space-x-2">
        {vehicleStatus.map((status, idx) => {
          return (
            <button
              key={idx}
              ref={(el) => (tabsRef.current[idx] = el)}
              className="p-[10px] cursor-pointer  hover:text-primaryText z-10"
              onClick={() => {
                // setShowMap(false);
                setSelectedStatus(status.toLowerCase());
                setActiveTabIndex(idx);
              }}
              // onClick={() => setActiveTabIndex(idx)}
            >
              {status}
            </button>
          );
        })}
      </div>
      <span
        className="absolute bottom-0 block h-12 shadow-md bg-primary shadow-primary/50 text-primaryText rounded-[10px] transition-all duration-300"
        style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
      />
    </div>
  );
};

export default VehicleStatusSelector;
