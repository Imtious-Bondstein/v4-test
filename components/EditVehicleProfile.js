"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import carAvatar from "../public/images/carAvatar.png";
import ProfilePhotoSelector from "./SVG/ProfilePhotoSelector";
import TikSVG from "./SVG/modal/TikSVG";
import ReloadSVG from "./SVG/modal/ReloadSVG";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/components/datePicker.css";

import dotenv from "dotenv";
import axios from "@/plugins/axios";
dotenv.config();

import { useDispatch, useSelector } from "react-redux";
import { UPDATE_USER } from "../store/slices/authSlice.js";
import { toast } from "react-toastify";
import LoadingScreen from "./LoadingScreen";
import { stringify } from "postcss";
import {
  notificationDate,
  testdates,
  testdatesCheck,
} from "@/utils/dateTimeConverter";
const EditVehicleProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.reducer.auth.token);
  const [initialVehicleInfo, setInitialVehicleInfo] = useState({});
  const [vehicleInfo, setVehicleInfo] = useState({
    // identifier: "",
    // image: "",
    // popup_image: "",
    // marker_image: "",
    // // general
    // bst_id: "",
    // vrn: "",
    // // status: "",
    // general_active: "",
    // vehicle_type: "",
    // brand: "",
    // model: "",
    // color: "",
    // chassis_number: "",
    // engine_number: "",
    // manufacture_model: "",
    // vehicle_name: "",
    // // delivery
    // delivery_name: "",
    // delivery_date: "",
    // delivery_address: "",
    // // expiration
    // expire_registration: "",
    // expire_fitness: "",
    // expire_cng_system: "",
    // expire_tax: "",
    // expire_root_permit: "",
    // expire_contact_no: "",
    // // document
    // document_registration: "",
    // document_fitness: "",
    // document_route_permit: "",
    // document_cng_system: "",
    // // capacity
    // fuel_capacity: "",
    // fuel_consumption: "",
    // load_capacity: "",
    // // user
    // user_name: "",
    // user_designation: "",
    // user_department: "",
    // user_contact_no: "",
    // user_email: "",
    // // other
    // owner: "",
    // vendor: "",
    // phone: "",
    // driver: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedCarImageFile, setSelectedCarImageFile] = useState();
  const [selectedPopupImageFile, setSelectedPopupImageFile] = useState();
  const [selectedMarkerImageFile, setSelectedMarkerImageFile] = useState();

  const [docRegistration, setDocRegistration] = useState();
  const [docFitness, setDocFitness] = useState();
  const [docRoutePermit, setDocRoutePermit] = useState();
  const [docCng, setDocCng] = useState();

  const importImage = (fieldName) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg, image/png, image/jpg, image/gif, image/svg+xml";
    input.onchange = () => {
      const file = input.files[0];

      if (fieldName === "image") {
        setSelectedCarImageFile(file);
      } else if (fieldName === "popup_image") {
        setSelectedPopupImageFile(file);
      } else if (fieldName === "marker_image") {
        setSelectedMarkerImageFile(file);
      }

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setVehicleInfo((prevInfo) => ({
            ...prevInfo,
            [fieldName]: e.target.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleVehicleInfo = (value, fieldName) => {
    setVehicleInfo((prevInfo) => ({
      ...prevInfo,
      [fieldName]: value,
    }));
  };

  // HANDLE FILES ==============================================================
  const selectDoc = (e, fieldName) => {
    const file = e.target.files[0];
    fieldName === "document_registration" && setDocRegistration(file);
    fieldName === "document_fitness" && setDocFitness(file);
    fieldName === "document_route_permit" && setDocRoutePermit(file);
    fieldName === "document_cng_system" && setDocCng(file);

    setVehicleInfo((preValue) => ({
      ...preValue,
      [fieldName]: file.name,
    }));
  };

  // const handleSubmitForm = () => {
  //   console.log("submit");
  // };

  const handleResetForm = () => {
    console.log("Reset");
    setVehicleInfo(initialVehicleInfo);
  };

  const handleSubmitForm = async () => {
    console.log("--- vehicleInfo --", vehicleInfo);
    const formData = new FormData();

    selectedCarImageFile && formData.append("image", selectedCarImageFile);
    selectedPopupImageFile &&
      formData.append("popup_image", selectedPopupImageFile);
    selectedMarkerImageFile &&
      formData.append("marker_image", selectedMarkerImageFile);

    formData.append("identifier", vehicleInfo.identifier);
    formData.append("vehicle_name", vehicleInfo.vehicle_name);
    formData.append("bst_id", vehicleInfo.bst_id);
    formData.append("vrn", vehicleInfo.vrn);
    // formData.append("general_active", vehicleInfo.general_active);
    formData.append("vehicle_type", vehicleInfo.vehicle_type);
    formData.append("brand", vehicleInfo.brand);
    formData.append("model", vehicleInfo.model);
    formData.append("color", vehicleInfo.color);

    formData.append("chassis_number", vehicleInfo.chassis_number);
    formData.append("engine_number", vehicleInfo.engine_number);
    formData.append("manufacture_model", vehicleInfo.manufacture_model);

    formData.append("delivery_date", vehicleInfo.delivery_date);
    formData.append("delivery_name", vehicleInfo.delivery_name);
    formData.append("delivery_address", vehicleInfo.delivery_address);

    // formData.append(
    //   "expiration_registration",
    //   vehicleInfo.expiration_registration
    // );
    // formData.append("expiration_fitness", vehicleInfo.expiration_fitness);
    // formData.append("expiration_tax", vehicleInfo.expiration_tax);
    // formData.append("expiration_cng_system", vehicleInfo.expiration_cng_system);
    // formData.append(
    //   "expiration_root_permit",
    //   vehicleInfo.expiration_root_permit
    // );

    formData.append("document_registration", docRegistration);
    formData.append("document_fitness", docFitness);
    formData.append("document_route_permit", docRoutePermit);
    formData.append("document_cng_system", docCng);

    formData.append("fuel_capacity", vehicleInfo.fuel_capacity);
    formData.append("fuel_consumption", vehicleInfo.fuel_consumption);
    formData.append("load_capacity", vehicleInfo.load_capacity);

    // user
    formData.append("user_name", vehicleInfo.user_name);
    formData.append("user_designation", vehicleInfo.user_designation);
    formData.append("user_department", vehicleInfo.user_department);
    formData.append("user_contact_no", vehicleInfo.user_contact_no);
    formData.append("user_email", vehicleInfo.user_email);

    // Others
    formData.append("owner", vehicleInfo.owner);
    formData.append("vendor", vehicleInfo.vendor);
    // formData.append("phone", vehicleInfo.phone);

    try {
      const response = await fetch(
        `https://apiv4.singularitybd.co/api/v4/vehicle-profile/update-profile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("img update res: ", responseData);

        setVehicleInfo(responseData.data);
        toast.success(responseData.user_message);
        setTimeout(() => {
          router.push("/support/vehicle-profile");
        }, [2000]);
      } else {
        const errorResponse = await response.json();
        console.log("try profile update err: ", errorResponse);
        toast.error(errorResponse?.message);
      }
    } catch (error) {
      console.log("catch profile update error: ", error);
    }
  };

  const fetchProfileData = async (id) => {
    setIsLoading(true);
    await axios
      .get(`/api/v4/vehicle-profile/edit-profile?identifier=${id}`)
      .then((res) => {
        console.log("-- get edit profile--", res.data);

        console.log("-- dataObj--", res.data.data);
        setVehicleInfo(res.data.data);
        setInitialVehicleInfo(res.data.data);
      })
      .catch((err) => {
        console.log("edit profile error : ", err.response);
        toast.error(err.response?.data.user_message);
      })
      .finally(() => setIsLoading(false));
  };

  function getFileNameFromURL(url) {
    // Split the URL by slashes
    const parts = url.split("/");
    // Get the last part, which should be the file name
    const fileName = parts[parts.length - 1];
    return fileName;
  }

  useEffect(() => {
    console.log("router-----", router.query.id);
    router.query.id && fetchProfileData(router.query.id);
  }, [router.query.id]);
  useEffect(() => {
    console.log("--vehicleInfo-----", vehicleInfo);
  }, [vehicleInfo]);

  return (
    <div className="pb-20">
      <h1 className="text-lg md:text-[32px] text-primaryText font-bold mb-2.5">
        Edit Vehicle profile
      </h1>

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="bg-white px-4 py-4 md:py-10 rounded-xl shadow-lg ">
          <div>
            <h1 className="text-base md:text-[22px] text-primaryText font-bold mb-4 md:mb-6">
              Update Vehicle Info
            </h1>

            <hr />
            <div className="flex flex-wrap items-center md:space-x-6 mt-4">
              {/* ====  image ====  */}
              <div className="mr-6 md:mr-0">
                <p>Image</p>
                <div className="relative w-fit rounded-lg">
                  <div className="h-[130px] w-[130px] rounded-lg ">
                    {vehicleInfo.image ? (
                      <img
                        src={`${vehicleInfo.image}`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <img src={carAvatar.src} className="h-full w-full " />
                    )}
                  </div>
                  <div
                    onClick={() => importImage("image")}
                    className="w-[28px] h-[28px] absolute -top-3 -right-3 cursor-pointer shadow rounded-full"
                  >
                    <ProfilePhotoSelector />
                  </div>
                </div>
              </div>

              {/* ====  popup image ====  */}
              <div className="mr-6 md:mr-0">
                <p>Popup image</p>
                <div className="relative w-fit rounded-lg">
                  <div className="h-[130px] w-[130px] rounded-lg ">
                    {vehicleInfo.popup_image ? (
                      <img
                        src={`${vehicleInfo.popup_image}`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <img src={carAvatar.src} className="h-full w-full " />
                    )}
                  </div>
                  <div
                    onClick={() => importImage("popup_image")}
                    className="w-[28px] h-[28px] absolute -top-3 -right-3 cursor-pointer shadow rounded-full"
                  >
                    <ProfilePhotoSelector />
                  </div>
                </div>
              </div>

              {/* ====  marker image ====  */}
              <div className="">
                <p>Marker image</p>
                <div className="relative w-fit rounded-lg">
                  <div className="h-[130px] w-[130px] rounded-lg ">
                    {vehicleInfo.marker_image ? (
                      <img
                        src={`${vehicleInfo.marker_image}`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <img src={carAvatar.src} className="h-full w-full " />
                    )}
                  </div>
                  <div
                    onClick={() => importImage("marker_image")}
                    className="w-[28px] h-[28px] absolute -top-3 -right-3 cursor-pointer shadow rounded-full"
                  >
                    <ProfilePhotoSelector />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h1 className="mt-4 text-primaryText font-bold text-base md:text-[26px]">
              {vehicleInfo.bst_id}
            </h1>
            <h1 className="text-sm md:text-[26px]">{vehicleInfo.vrn} </h1>
          </div>

          {/* General   */}
          <div className="mt-6">
            <h1 className="text-base md:text-[22px] text-primaryText font-bold mb-4">
              General
            </h1>
            <hr />
            <div className="mt-4 md:mt-8">
              <div className="mt-4">
                <input
                  required
                  className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                  type="text"
                  placeholder="Registration"
                  value={vehicleInfo.vrn}
                  onChange={(event) =>
                    handleVehicleInfo(event.target.value, "vrn")
                  }
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="Active"
                    value={vehicleInfo.general_active}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "general_active")
                    }
                  />
                </div>
                <div>
                  <select
                    defaultValue={"car"}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "vehicle_type")
                    }
                    className={`p-2 w-full placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg`}
                  >
                    <option value="car">Type</option>
                    <option value="car">Car</option>
                    <option value="bus">Bus</option>
                    <option value="bike">Bike</option>
                    <option value="truck">Truck</option>
                    <option value="pickup">Pickup</option>
                  </select>
                  {/* <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="Type"
                    value={vehicleInfo.vehicle_type}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "vehicle_type")
                    }
                  /> */}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="Brand"
                    value={vehicleInfo.brand}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "brand")
                    }
                  />
                </div>
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="Model"
                    value={vehicleInfo.model}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "model")
                    }
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="Colour"
                    value={vehicleInfo.color}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "color")
                    }
                  />
                </div>
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="Chassis#*"
                    value={vehicleInfo.chassis_number}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "chassis_number")
                    }
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="Engine"
                    value={vehicleInfo.engine_number}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "engine_number")
                    }
                  />
                </div>
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="Manufacture model"
                    value={vehicleInfo.manufacture_model}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "manufacture_model")
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="mt-6">
            <h1 className="text-base md:text-[22px] text-primaryText font-bold mb-4">
              Delivery
            </h1>
            <hr />
            <div className="mt-8">
              <div className="mt-4 grid grid-cols-2 gap-6">
                {console.log(vehicleInfo)}
                <div>
                  <DatePicker
                    selected={
                      vehicleInfo.delivery_date === "null"
                        ? null
                        : vehicleInfo.delivery_date &&
                          new Date(vehicleInfo.delivery_date)
                    }
                    onChange={(date) =>
                      handleVehicleInfo(date, "delivery_date")
                    }
                    dateFormat="dd/mm/yyyy"
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    placeholderText="Delivery Date"
                  />
                </div>
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="Name"
                    value={vehicleInfo.delivery_name}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "delivery_name")
                    }
                  />
                </div>
              </div>

              <div className="mt-4">
                <input
                  required
                  className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                  type="text"
                  placeholder="Delivery Address"
                  value={vehicleInfo.delivery_address}
                  onChange={(event) =>
                    handleVehicleInfo(event.target.value, "delivery_address")
                  }
                />
              </div>
            </div>
          </div>

          {/* ===== Expiration ===== */}
          <div className="mt-6">
            <h1 className="text-base md:text-[22px] text-primaryText font-bold mb-4">
              Expiration
            </h1>
            <hr />
            <div className="mt-4 md:mt-8">
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <DatePicker
                    selected={
                      vehicleInfo.expiration_registration &&
                      new Date(vehicleInfo.expiration_registration)
                    }
                    onChange={(date) =>
                      handleVehicleInfo(date, "expiration_registration")
                    }
                    dateFormat="dd/MM/yyyy"
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    placeholderText="Expiry: Registration"
                  />
                </div>
                <div>
                  <DatePicker
                    selected={
                      vehicleInfo.expiration_fitness &&
                      new Date(vehicleInfo.expiration_fitness)
                    }
                    onChange={(date) =>
                      handleVehicleInfo(date, "expiration_fitness")
                    }
                    dateFormat="dd/MM/yyyy"
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    placeholderText="Fitness"
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <DatePicker
                    selected={
                      vehicleInfo.expiration_tax &&
                      new Date(vehicleInfo.expiration_tax)
                    }
                    onChange={(date) =>
                      handleVehicleInfo(date, "expiration_tax")
                    }
                    dateFormat="dd/MM/yyyy"
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    placeholderText="Expiry: Tax"
                  />
                </div>
                <div>
                  <DatePicker
                    selected={
                      vehicleInfo.expiration_cng_system &&
                      new Date(vehicleInfo.expiration_cng_system)
                    }
                    onChange={(date) =>
                      handleVehicleInfo(date, "expiration_cng_system")
                    }
                    dateFormat="dd/MM/yyyy"
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    placeholderText="CNG system"
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <DatePicker
                    selected={
                      vehicleInfo.expiration_root_permit &&
                      new Date(vehicleInfo.expiration_root_permit)
                    }
                    onChange={(date) =>
                      handleVehicleInfo(date, "expiration_root_permit")
                    }
                    dateFormat="dd/MM/yyyy"
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    placeholderText="Expiry: Route Permit"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===== Document ===== */}
          <div className="mt-6">
            <h1 className="text-base md:text-[22px] text-primaryText font-bold mb-4">
              Document
            </h1>
            <hr />
            <div className="mt-4 md:mt-8">
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div className="bg-[#F8F8FA] flex flex-wrap space-y-2 sm:space-y-0 items-center justify-between text-xs font-bold py-3.5 px-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary">
                  <p className="text-xs text-center sm:text-left font-bold text-tertiaryText">
                    {vehicleInfo.document_registration
                      ? getFileNameFromURL(vehicleInfo.document_registration)
                      : "Document: Registration"}
                  </p>
                  <label
                    className="h-[30px] w-[99px] flex justify-center items-center bg-[#E7ECF3] rounded text-sm text-[#48525C] font-medium"
                    htmlFor="document_registration"
                  >
                    Choose File
                  </label>
                  <input
                    onChange={(e) => {
                      selectDoc(e, "document_registration");
                    }}
                    type="file"
                    id="document_registration"
                    className="hidden"
                  />
                </div>
                <div className="bg-[#F8F8FA] flex flex-wrap space-y-2 sm:space-y-0 items-center justify-between text-xs font-bold py-3.5 px-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary">
                  <p className="text-xs text-center sm:text-left font-bold text-tertiaryText">
                    {vehicleInfo.document_fitness
                      ? getFileNameFromURL(vehicleInfo.document_fitness)
                      : "Fitness"}
                  </p>
                  <label
                    className="h-[30px] w-[99px] flex justify-center items-center bg-[#E7ECF3] rounded text-sm text-[#48525C] font-medium"
                    htmlFor="document_fitness"
                  >
                    Choose File
                  </label>
                  <input
                    onChange={(e) => {
                      selectDoc(e, "document_fitness");
                    }}
                    type="file"
                    id="document_fitness"
                    className="hidden"
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div className="bg-[#F8F8FA] flex flex-wrap space-y-2 sm:space-y-0 items-center justify-between text-xs font-bold py-3.5 px-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary">
                  <p className="text-xs text-center sm:text-left font-bold text-tertiaryText">
                    {vehicleInfo.document_route_permit
                      ? getFileNameFromURL(vehicleInfo.document_route_permit)
                      : "Document Route permit"}
                  </p>
                  <label
                    className="h-[30px] w-[99px] flex justify-center items-center bg-[#E7ECF3] rounded text-sm text-[#48525C] font-medium"
                    htmlFor="document_route_permit"
                  >
                    Choose File
                  </label>
                  <input
                    onChange={(e) => {
                      selectDoc(e, "document_route_permit");
                    }}
                    type="file"
                    id="document_route_permit"
                    className="hidden"
                  />
                </div>
                <div className="bg-[#F8F8FA] flex flex-wrap space-y-2 sm:space-y-0 items-center justify-between text-xs font-bold py-3.5 px-4 rounded-xl w-full placeholder:text-tertiaryText outline-quaternary">
                  <p className="text-xs text-center sm:text-left font-bold text-tertiaryText">
                    {vehicleInfo.document_cng_system
                      ? getFileNameFromURL(vehicleInfo.document_cng_system)
                      : "CNG system"}
                  </p>
                  <label
                    className="h-[30px] w-[99px] flex justify-center items-center bg-[#E7ECF3] rounded text-sm text-[#48525C] font-medium"
                    htmlFor="document_cng_system"
                  >
                    Choose File
                  </label>
                  <input
                    onChange={(e) => {
                      selectDoc(e, "document_cng_system");
                    }}
                    type="file"
                    id="document_cng_system"
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===== Capacity ===== */}
          <div className="mt-6">
            <h1 className="text-base md:text-[22px] text-primaryText font-bold mb-4">
              Capacity
            </h1>
            <hr />
            <div className="mt-4 md:mt-8">
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="Fuel Capacity (litre)"
                    value={vehicleInfo.fuel_capacity}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "fuel_capacity")
                    }
                  />
                </div>
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="Fuel Consumption rate Km/L"
                    value={vehicleInfo.fuel_consumption}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "fuel_consumption")
                    }
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="Load Capacity"
                    value={vehicleInfo.load_capacity}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "load_capacity")
                    }
                  />
                </div>

                <div></div>
              </div>
            </div>
          </div>

          {/* ===== User ===== */}
          <div className="mt-6">
            <h1 className="text-base md:text-[22px] text-primaryText font-bold mb-4">
              User
            </h1>
            <hr />
            <div className="mt-4 md:mt-8">
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="User: Name"
                    value={vehicleInfo.user_name}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "user_name")
                    }
                  />
                </div>
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="User: Designation"
                    value={vehicleInfo.user_designation}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "user_designation")
                    }
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="Department"
                    value={vehicleInfo.user_department}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "user_department")
                    }
                  />
                </div>
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="User: Contact Number"
                    value={vehicleInfo.user_contact_no}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "user_contact_no")
                    }
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="Email"
                    value={vehicleInfo.user_email}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "user_email")
                    }
                  />
                </div>
                <div></div>
              </div>
            </div>
          </div>

          {/* ===== Others ===== */}
          <div className="mt-6">
            <h1 className="text-base text-[22px] text-primaryText font-bold mb-4">
              Others
            </h1>
            <hr />
            <div className="mt-4 md:mt-8">
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="Owner"
                    value={vehicleInfo.owner}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "owner")
                    }
                  />
                </div>
                <div>
                  <input
                    required
                    className="w-full text-sm md:text-base placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="Vendor"
                    value={vehicleInfo.vendor}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "vendor")
                    }
                  />
                </div>
              </div>
              <div className="mt-4 text-sm md:text-base grid grid-cols-2 gap-6">
                <div>
                  <input
                    required
                    className="w-full placeholder:text-tmvGray font-semibold outline-none bg-inputGray py-4 px-3 rounded-lg"
                    type="text"
                    placeholder="Phone"
                    value={vehicleInfo.phone}
                    onChange={(event) =>
                      handleVehicleInfo(event.target.value, "phone")
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* =============button========== */}
          <div className="flex items-center justify-center md:justify-end space-x-3.5 mt-6">
            <button
              onClick={handleSubmitForm}
              className="w-[156px] h-[48px] flex justify-center items-center space-x-2  bg-primary rounded-xl modal-button-shadow group hover:shadow-lg hover:shadow-primary/80 duration-300"
            >
              <div className="">
                <TikSVG />
              </div>
              <span className="text-sm md:text-base">Update</span>
            </button>
            <button
              onClick={handleResetForm}
              className="w-[156px] h-[48px] flex justify-center items-center space-x-2 bg-[#e7ecf3] rounded-xl group hover:bg-[#1E1E1E]"
            >
              <div className=" group-hover:fill-[#e7ecf3] fill-[#1E1E1E] group-hover:animate-spinLeftOne">
                <ReloadSVG />
              </div>
              <span className="group-hover:text-[#e7ecf3] text-[#1E1E1E] text-sm md:text-base">
                Reset
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditVehicleProfile;
