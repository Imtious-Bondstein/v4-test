//========SVG

import Timer from "@/svg/TimerSVG";
import GeoFenceSettingsSVG from "@/components/SVG/GeoFenceSettingsSVG";
import SearchCarSVG from "@/components/SVG/SearchCarSVG";
import LeftArrowPagination from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";

import GeoFenceMultipleVehicleSelector from "@/components/vehicleSelectors/GeoFenceMultipleVehicleSelector";

import { geofenceTableData } from "@/utils/geofenceTableData";
import React, { useEffect, useRef, useState } from "react";

// router
import { useRouter } from "next/router";

// date-time-picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GeoFenceMap from "@/components/maps/GeoFenceMap";
import { set } from "date-fns";
import GeoFenceTable from "@/components/tables/GeoFenceTable";
import GeoFenceSettingsModal from "@/components/modals/GeoFenceSettingsModal";
import GeoFenceAssignedVehiclesModal from "@/components/modals/GeoFenceAssignedVehiclesModal";

//====== toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "@/plugins/axios";
import { geoFenceTime24 } from "@/utils/dateTimeConverter";
import GeoFenceTableRecent from "@/components/tables/GeoFenceTableRecent";
import PlusSVG from "@/components/SVG/PlusSVG";
import SubAdminMultipleVehicleSelector from "@/components/vehicleSelectors/SubAdminMultipleVehicleSelector";
import Tik from "@/svg/TikSVG";
import EyeSVG from "@/components/SVG/EyeSVG";

const create = () => {
  // this exceptional vehicle selector
  const [vehicleLists, setVehicleLists] = useState([]);

  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [geoFenceTableData, setGeoFenceTableData] = useState([]);

  const [fenceName, setFenceName] = useState("");

  const previousDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  const [startTime, setStartTime] = useState(
    new Date(
      previousDay.getFullYear(),
      previousDay.getMonth(),
      previousDay.getDate(),
      0,
      0,
      0,
      0
    )
  );
  const [endTime, setEndTime] = useState(
    new Date(
      previousDay.getFullYear(),
      previousDay.getMonth(),
      previousDay.getDate(),
      23,
      59,
      59,
      999
    )
  );

  const [polygonPaths, setPolygonPaths] = useState([]);
  const [eventData, setEventData] = useState({
    entry: {
      message: "",
      active: true,
    },
    exit: {
      message: "",
      active: true,
    },
  });

  const [clicked, setClicked] = useState(false);
  const [areaClicked, setAreaClicked] = useState(false);
  const [openAreas, setOpenAreas] = useState(false);
  const [xlScreen, setXlScreen] = useState(false);
  const router = useRouter();

  //=====modal
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false);
  const [assignedVehiclesModalIsOpen, setAssignedVehiclesModalIsOpen] =
    useState(false);

  // ROLE
  const [roleData, setRoleData] = useState([]);
  const [rolePermissionData, setRolePermissionData] = useState([]);
  const [singleRolePermissionData, setSingleRolePermissionData] = useState([]);
  const [vehicleIdentifiers, setVehicleIdentifiers] = useState([]);
  const [isSelect, setIsSelect] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedPermissionsID, setSelectedPermissionsID] = useState([]);
  const [createSubadminFormDetails, setCreateSubadminFormDetails] = useState({
    customer_name: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    sub_role_id: "",
    identifier: "",
  });
  const [showPassword, setShowPassword] = useState(true);

  // HANDLE INPUT FIELD DETAILS
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateSubadminFormDetails({
      ...createSubadminFormDetails,
      [name]: value,
    });
  };

  // HANDLE COMAPNY SELECT OPTION DETAILS
  const handleCreateFormSelect = (e) => {
    setCreateSubadminFormDetails({
      ...createSubadminFormDetails,
      sub_role_id: e.target.value,
    });
  };

  const getSingleSelectedVehicle = (vehicle) => {
    console.log("getSingleSelectedVehicle", vehicle);
    if (vehicle.selected) {
      setSelectedVehicles([...selectedVehicles, vehicle]);
    } else {
      setSelectedVehicles(
        selectedVehicles.filter(
          (selectedVehicle) =>
            selectedVehicle.v_identifier !== vehicle.v_identifier
        )
      );
    }
  };

  const getMultipleSelectedVehicles = (allVehicles) => {
    console.log("all vehicle", allVehicles);
    if (allVehicles.length) {
      setSelectedVehicles([...selectedVehicles, ...allVehicles]);
    } else {
      setSelectedVehicles([]);
    }
  };

  // CHECK FOR OUTSIDE CLICK FOR SELECTOR
  const handleOutsideSelectorClick = () => {
    setClicked(false);
    setAreaClicked(false);
  };

  // deselect all vehicle from vehicleList
  const handleDeselectAll = () => {
    vehicleLists.map((group) => {
      group.vehicles.map((vehicle) => {
        vehicle["selected"] = false;
      });
    });
    setSelectedVehicles([]);
  };
  // fence save and reset end

  // geo json to map data start
  const convertToStringData = (data) => {
    // return data.map(({ name, coordinates }) => ({
    //   name,
    //   coordinates: [coordinates.map(({ lat, lng }) => [lat, lng])],
    // }));
    const newData = data.map((item) => {
      const coordinates = item.coordinates
        .map((coord) => {
          return `${coord.lat},${coord.lng}`;
        })
        .join(";");

      return { name: item.name, coordinates };
    });

    return newData;
  };

  const convertToMapData = (data) => {
    return data.map(({ name, coordinates }) => ({
      name,
      coordinates: coordinates[0].map(([lat, lng]) => ({ lat, lng })),
    }));
  };
  // geo json to map data end

  const fetchGeoFenceTableData = async () => {
    setIsLoadingTable(true);
    await axios
      .get(`/api/v4/virtual-fence/list`)
      .then((res) => {
        const allData = res.data.data.data.slice(0, 5);
        console.log("-- get geo-fence res--", allData);

        const newData = allData.map((item, index) => ({
          ...item,
          sl: index + 1,
          checkbox: false,
          displayDropdownInfo: false,
        }));
        setGeoFenceTableData(newData);
      })
      .catch((err) => {
        console.log("geo-fence error : ", err.response);
        toast.error(err.response?.data?.user_message);
      })
      .finally(() => setIsLoadingTable(false));
  };
  // --------- 02
  useEffect(() => {
    fetchGeoFenceTableData();
  }, []);

  // FETCH ROLES LIST
  const fetchRolesData = async () => {
    await axios
      .get(`/api/v4/sub-admin/roles`)
      .then((res) => {
        const data = res.data.data;
        setRoleData(data);
        console.log("ROLE DATA", res.data.data);
      })
      .catch((err) => {
        console.log("Role Data Error : ", err.response);
        // toast.error(err.response?.data?.user_message);
      });
  };

  // FETCH ROLES PERMISSIONS LIST
  const fetchRolesPermissionData = async () => {
    await axios
      .get(`/api/v4/sub-admin/permissions`)
      .then((res) => {
        const data = res.data.data;
        setRolePermissionData(data);
        console.log("ROLE PERMISSION DATA", res.data.data);
      })
      .catch((err) => {
        console.log("Role Data Error : ", err.response);
        // toast.error(err.response?.data?.user_message);
      });
  };

  // FETCH ROLES PERMISSIONS LIST
  const createSubAdmin = async (e) => {
    e.preventDefault();
    const data = {
      customer_name: createSubadminFormDetails.customer_name,
      username: createSubadminFormDetails.username,
      email: createSubadminFormDetails.email,
      phone_number: createSubadminFormDetails.phone_number,
      password: createSubadminFormDetails.password,
      sub_role_id: createSubadminFormDetails.sub_role_id,
      identifier: selectedVehicles.map((item) => item.v_identifier).join(","),
    };
    console.log(data, "SUBADMIN FORM DATA FOR CREATING SUBADMIN");

    await axios
      .post("/api/v4/sub-admin/store", data)
      .then((res) => {
        const data = res.data;
        data.code === 200
          ? setTimeout(() => {
              router.push("/subadmin");
            }, 2000) && toast.success(data.user_message)
          : "";
        console.log("CREATE SUBADMIN", res.data);
      })
      .catch((err) => {
        const allError = err.response.data.message.split(",");
        allError.map((err) => {
          toast.error(err);
        });
        console.log("Create Subadmin Error : ", err.response.data.message);
      });
  };

  // FETCH SINGLE ROLE CURRENT PERMISSIONS LIST
  const fetchSingleRolePermissionData = async () => {
    await axios
      .get(`/api/v4/sub-admin/single-role-permission?role_id=${selectedRoleId}`)
      .then((res) => {
        const data = res.data.data;
        setSingleRolePermissionData(data);
        console.log("SINGLE ROLE PERMISSION DATA", res.data.data);
      })
      .catch((err) => {
        console.log("Single Role Data Error : ", err.response);
        // toast.error(err.response?.data?.user_message);
      });
  };

  // SHOW BSTID
  const vehicleObjectToIdentifiBstArray = (vehicleObject) => {
    return vehicleObject.map((vehicle) => vehicle.bst_id);
  };

  // GET CURRENT SELECTED ROLE ID
  const handleRoleChange = (e) => {
    const selectedID = e.target.value;
    setSelectedRoleId(selectedID);
  };

  // ROLE SELECT TOOGLE
  const handleSelect = () => {
    setIsSelect(!isSelect);
  };

  // SET THE CURRENT SELECTED PERMISSIONS CHECKED
  useEffect(() => {
    const getSingleRolePermissionsID = singleRolePermissionData.map(
      (item) => item.permission_id
    );

    const matchedData = rolePermissionData.map((role) => ({
      ...role,
      checked: getSingleRolePermissionsID.includes(role.id),
    }));

    setRolePermissionData(matchedData);
  }, [singleRolePermissionData]);

  // GET SINGLE ROLE CURRENT SELECTED PERMISSIONS ID
  useEffect(() => {
    const selectedPermissionID = rolePermissionData
      .filter((role) => role.checked === true)
      .map((role) => role.id);

    setSelectedPermissionsID(selectedPermissionID);
  }, [rolePermissionData]);

  useEffect(() => {
    fetchRolesData();
    fetchRolesPermissionData();
  }, []);

  useEffect(() => {
    fetchSingleRolePermissionData();
  }, [selectedRoleId]);

  useEffect(() => {
    setVehicleIdentifiers(vehicleObjectToIdentifiBstArray(selectedVehicles));
  }, [selectedVehicles]);

  useEffect(() => {
    setCreateSubadminFormDetails({
      ...createSubadminFormDetails,
      identifier: vehicleIdentifiers,
    });
  }, [vehicleIdentifiers]);

  return (
    <>
      <ToastContainer />
      <GeoFenceSettingsModal
        isUpdating={false}
        settingsModalIsOpen={settingsModalIsOpen}
        setSettingsModalIsOpen={setSettingsModalIsOpen}
        eventData={eventData}
        setEventData={setEventData}
      />
      <div className="relative w-full bg-green-600 xl:hidden">
        <div
          onClick={() => setAreaClicked(!areaClicked)}
          className={`cursor-pointer ${
            areaClicked === true
              ? "right-[293px] xs:right-[343px] mr-[7px] h-max-[65px] top-28 z-[3006]"
              : "right-0 h-[40px] top-40 z-[3005]"
          } search-toggle-button ease-in-out duration-700 fixed flex justify-center items-center gap-1 xs:gap-2  xl:z-0 -mt-2.5 p-2 text-white`}
        >
          Roles
        </div>
      </div>
      <div className="overflow-hidden mb-20">
        <section>
          {/* TITLE & BUTTONS */}
          <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0">
            {/* PAGE TITLE */}
            <div className="flex flex-grow items-center justify-between pb-4 md:pb-7 w-full">
              <h1 className="text-[#1E1E1E] text-xl md:text-[32px] font-bold md:pt-5">
                Create Subadmin
              </h1>
            </div>
          </div>
        </section>
        <section className="flex pb-6">
          {/* CREATE ROLE & DETAILS */}
          <div className="h-[77vh]">
            <div
              className={`${
                areaClicked === true ? "right-0 z-[3005]" : "-right-96 z-[3004]"
              } ${
                xlScreen === true
                  ? "xl:z-40 xl:right-10 xl:shadow-none xl:flex-none xl:block xl:static xl:ml-4"
                  : "xl:z-40 xl:right-10 xl:shadow-none xl:static"
              } flex-none fixed top-16 xl:top-40 ease-in-out duration-700 rounded-3xl lg:mt-0`}
            >
              <div className="bg-white p-3 h-[77vh] w-[300px] xs:w-[350px] rounded-[20px] overflow-y-auto">
                <div className="">
                  <button
                    // onClick={handleCreateSquare}
                    className="flex justify-center items-center space-x-3 w-full bg-primary h-[56px] rounded-xl mt-3"
                  >
                    <PlusSVG />
                    <p className="primaryText font-bold text-base">
                      Create Role
                    </p>
                  </button>
                </div>
                {/* Role Select */}
                <div className="flex items-center space-x-4 my-5">
                  <p className="w-[180px] font-bold">Select Role:</p>
                  <select
                    onChange={handleRoleChange}
                    className="w-full text-sm px-5 font-bold tmv-shadow rounded-xl outline-quaternary input "
                  >
                    <option>Select Role</option>
                    {roleData?.map(({ name, id }, index) => {
                      return (
                        <>
                          <option key={index} value={id}>
                            {name}
                          </option>
                        </>
                      );
                    })}
                  </select>
                </div>
                {/* Role Permissions */}
                <div className="px-4">
                  {rolePermissionData?.map(({ name, checked }, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between pb-2"
                      >
                        <p>
                          {index + 1}
                          {":"} &nbsp;{name}
                        </p>
                        <div>
                          <div
                            onClick={() => handleSelect()}
                            className="w-6 h-6 rounded tmv-shadow bg-white flex justify-center items-center cursor-pointer z-10"
                          >
                            {/* {isSelect || checked ? <Tik /> : ""} */}
                            {checked ? <Tik /> : ""}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {/* FORM */}
          <div className="grow overflow-scroll md:ms-4 p-5 rounded-xl h-[77vh] bg-white">
            <form>
              <div className="flex items-center space-x-4 mb-5">
                <p className="w-[230px] text-sm md:text-base font-bold">
                  Subadmin Name:
                </p>
                <input
                  className="w-full text-sm px-5 py-3 md:py-4 font-bold tmv-shadow rounded-xl outline-quaternary"
                  type="text"
                  name="customer_name"
                  value={createSubadminFormDetails.customer_name}
                  placeholder="Subadmin Name"
                  onChange={(e) => handleInputChange(e)}
                  required
                />
              </div>
              <div className="flex items-center space-x-4 mb-3 md:mb-5">
                <p className="w-[230px] text-sm md:text-base font-bold">
                  Username:
                </p>
                <input
                  className="w-full text-sm px-5 py-3 md:py-4 font-bold tmv-shadow rounded-xl outline-quaternary"
                  type="text"
                  name="username"
                  value={createSubadminFormDetails.username}
                  placeholder="Input Username"
                  onChange={(e) => handleInputChange(e)}
                  required
                />
              </div>
              <div className="flex items-center space-x-4 mb-3 md:mb-5">
                <p className="w-[230px] text-sm md:text-base font-bold">
                  Email:
                </p>
                <input
                  className="w-full text-sm px-5 py-3 md:py-4 font-bold tmv-shadow rounded-xl outline-quaternary input"
                  type="email"
                  name="email"
                  value={createSubadminFormDetails.email}
                  placeholder="Email"
                  onChange={(e) => handleInputChange(e)}
                  required
                />
              </div>
              <div className="flex items-center space-x-4 mb-3 md:mb-5 relative">
                <p className="w-[230px] text-sm md:text-base font-bold">
                  Password:
                </p>
                <input
                  className="w-full text-sm px-5 py-3 md:py-4 font-bold tmv-shadow rounded-xl outline-quaternary"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={createSubadminFormDetails.password}
                  placeholder="Password"
                  onChange={(e) => handleInputChange(e)}
                  required
                />
                {createSubadminFormDetails.password.length > 0 ? (
                  <div
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    className="absolute right-4 top-4"
                  >
                    <EyeSVG />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="flex items-center space-x-4 mb-3 md:mb-5">
                <p className="w-[230px] text-sm md:text-base font-bold">
                  Phone:
                </p>
                <input
                  className="w-full text-sm px-5 py-3 md:py-4 font-bold tmv-shadow rounded-xl outline-quaternary input"
                  type="text"
                  name="phone_number"
                  value={createSubadminFormDetails.phone_number}
                  placeholder="Phone"
                  onChange={(e) => handleInputChange(e)}
                  required
                />
              </div>
              <div className="flex items-center space-x-4 mb-3 md:mb-5">
                <p className="w-[230px] text-sm md:text-base font-bold">
                  Subadmin Role:
                </p>
                <select
                  onChange={(e) => handleCreateFormSelect(e)}
                  className="w-full text-sm px-5 font-bold tmv-shadow rounded-xl outline-quaternary input "
                >
                  <option>Select Role</option>
                  {roleData?.map(({ name, id }, index) => {
                    return (
                      <option key={index} value={id}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex items-center space-x-4 mb-3 md:mb-5">
                <p className="w-[230px] text-sm md:text-base font-bold">
                  Assign Vehicle:
                </p>
                <div className="w-full h-[90px] text-sm px-5 font-bold tmv-shadow rounded-xl outline-quaternary flex flex-wrap items-center overflow-auto">
                  {vehicleIdentifiers?.map((identifier, index) => {
                    return (
                      <p key={index} className="w-[92px]">
                        {identifier}
                        {","} &nbsp;
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end space-x-4 md:space-x-2 xl:space-x-4 pt-[30px] w-full">
                <button
                  onClick={() =>
                    setCreateSubadminFormDetails({
                      customer_name: "",
                      username: "",
                      email: "",
                      phone_number: "",
                      password: "",
                      sub_role_id: "",
                      identifier: "",
                    })
                  }
                  className="flex justify-center items-center h-[48px] w-1/3 sm:w-[93px] rounded-xl text-sm duration-300 bg-[#FFFAE6] shadow-lg hover:shadow-xl"
                >
                  <p>Reset</p>
                </button>
                <button
                  onClick={createSubAdmin}
                  // disabled={isLoading}
                  className="flex justify-center items-center h-[48px] w-1/3 sm:w-[93px] rounded-xl text-sm duration-300 bg-primary primary-shadow hover:shadow-xl hover:shadow-primary/60"
                >
                  <p>{!isLoading ? "Create" : "Saving..."}</p>
                </button>
              </div>
            </form>
          </div>
          {/* MULTIPLE VEHICLE SELECTOR */}
          <div
            className={`${
              clicked === true ? "right-0 z-[3005]" : "-right-96 z-[3004]"
            } ${
              xlScreen === true
                ? "xl:z-40 xl:right-10 xl:shadow-none xl:flex-none xl:block xl:static xl:ml-4"
                : "xl:z-40 xl:right-10 xl:shadow-none xl:static xl:ml-4"
            } flex-none fixed top-16 lg:top-10 xl:top-40 ml-0 ease-in-out duration-700 rounded-3xl lg:mt-0`}
          >
            <SubAdminMultipleVehicleSelector
              vehicleLists={vehicleLists}
              setVehicleLists={setVehicleLists}
              isSelected={false}
              getMultipleSelectedVehicles={getMultipleSelectedVehicles}
              getSingleSelectedVehicle={getSingleSelectedVehicle}
              clicked={clicked}
              setClicked={setClicked}
              areaClicked={areaClicked}
              setAreaClicked={setAreaClicked}
              top={true}
              height={530}
              xlScreen={true}
            />
          </div>
        </section>
        {/* BLUR EFFECT FOR SELECTOR & ROLE */}
        {!clicked ? (
          ""
        ) : (
          <div
            onClick={() => handleOutsideSelectorClick()}
            className="xl:hidden blur-filter-subadmin"
          ></div>
        )}
        {areaClicked === false ? (
          ""
        ) : (
          <div
            onClick={() => handleOutsideSelectorClick()}
            className="xl:hidden blur-filter-subadmin"
          ></div>
        )}
      </div>
    </>
  );
};

export default create;

create.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page}</DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
