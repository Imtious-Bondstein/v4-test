"use client";
import React, { useEffect, useRef, useState } from "react";
import profileFrame from "../public/images/UserProfileFrame.png";
import userImg from "../public/user.jpg";
import ProfilePhotoSelector from "./SVG/ProfilePhotoSelector";
import EditTableSVG from "./SVG/table/EditTableSVG";
import Select from "react-select";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "@/plugins/axios";
import ChangePasswordModal from "./modals/ChangePasswordModal";
import { getYearMonthDay } from "@/utils/dateTimeConverter";
import { serverBaseUrl } from "@/utils/serverBaseUrl";
import { ToastContainer, toast } from "react-toastify";
import userAvatar from "../public/images/user-avatar.png";

import dotenv from "dotenv";
dotenv.config();

import { useDispatch, useSelector } from "react-redux";
import authSlice, {
  UPDATE_USER,
  UPDATE_USER_NEW,
} from "../store/slices/authSlice.js";

const UserProfile = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.reducer.auth.token);
  const user = useSelector((state) => state.reducer.auth.user);

  const [selectedImage, setSelectedImage] = useState(
    "https://i.ibb.co/khdKPw2/user.jpg"
  );

  const [isLoading, setIsLoading] = useState(false);
  const [changePasswordModalIsOpen, setChangePasswordModalIsOpen] =
    useState(false);

  const [isGeneralInfoEdit, setIsGeneralInfoEdit] = useState(false);
  const [isContactInfoEdit, setIsContactInfoEdit] = useState(false);
  const [isAddressInfoEdit, setIsAddressInfoEdit] = useState(false);
  const [isOtherInfoEdit, setIsOtherInfoEdit] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const requiredFields = useRef([]);

  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];
  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Bengali", label: "Bengali" },
    { value: "Other", label: "Other" },
  ];
  const countryOptions = [{ value: "Bangladesh", label: "Bangladesh" }];

  const [userInfo, setUserInfo] = useState({
    userName: "",
    email: "",
    image: "",

    firstName: "",
    middleName: "",
    lastName: "",
    gender: null,
    dob: null,
    language: null,

    phoneNumberMobile: "",
    phoneNumberWork: "",
    phoneNumberHome: "",
    phoneNumberOther: "",

    street: "",
    state: "",
    country: null,
    city: "",
    zip: "",

    url: "",
    quote: "",
  });

  const handleUserInfo = (event, fieldName, isDropdowon) => {
    if (isDropdowon) {
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        [fieldName]: fieldName === "dob" ? new Date(event) : event,
      }));
    } else {
      const { value } = event.target;

      setUserInfo((prevInfo) => ({
        ...prevInfo,
        [fieldName]: value,
      }));
    }
  };

  useEffect(() => {
    // console.log("userInfo effect : ", userInfo);
  }, [userInfo]);

  const importImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg, image/png, image/jpg, image/gif, image/svg+xml";
    input.onchange = () => {
      const file = input.files[0];

      setSelectedImageFile(file);
      updateImage(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target.result);
          setUserInfo((prevInfo) => ({
            ...prevInfo,
            image: e.target.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const selectStyle = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "white",
      border: 0,
      padding: "5px 0",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#8D96A1",
      fontSize: "14px",
      fontWeight: 600,
      border: 0,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#1E1E1E",
      fontSize: "16px",
      fontWeight: 600,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "250px",
      overflowY: "auto",
    }),
  };

  const textareaRef = useRef(null);

  const handleQuoteInput = (event) => {
    handleUserInfo(event, "quote", false);

    const { current } = textareaRef;
    current.style.height = "auto";
    current.style.height = current.scrollHeight + "px";
  };

  const handleTextareaKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      textareaRef.current.style.height = "auto";
    }
  };

  const checkRequiredFields = () => {
    const emptyFields = [];

    // Step 2: Check each input field individually
    if (!userInfo.firstName) {
      emptyFields.push("First Name");
    }

    if (!userInfo.lastName) {
      emptyFields.push("Last Name");
    }

    if (!userInfo.gender) {
      emptyFields.push("Gender");
    }

    if (!userInfo.language) {
      emptyFields.push("Language");
    }

    if (!userInfo.phoneNumberMobile) {
      emptyFields.push("Phone Number");
    }

    // Step 3: Display an alert message if any fields are empty
    if (emptyFields.length > 0) {
      const errorMessage = `The following fields are required: ${emptyFields.join(
        ", "
      )}`;
      return errorMessage;
    } else {
      return null;
    }
  };

  const updateGeneralInfo = () => {
    if (checkRequiredFields()) {
      toast.error(checkRequiredFields);
    } else {
      const formData = {
        first_name: userInfo.firstName,
        middle_name: userInfo.middleName,
        last_name: userInfo.lastName,
        gender: userInfo.gender ? userInfo.gender.value : null,
        date_of_birth: userInfo.dob ? getYearMonthDay(userInfo.dob) : null,
        language: userInfo.language ? userInfo.language.value : null,
      };

      updateUserInfo(formData);
    }

    setIsGeneralInfoEdit(false);
  };
  const updateContactInfo = () => {
    if (checkRequiredFields()) {
      toast.error(checkRequiredFields);
    } else {
      const formData = {
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,

        gender: userInfo.gender ? userInfo.gender.value : null,
        language: userInfo.language ? userInfo.language.value : null,

        phone_number: userInfo.phoneNumberMobile,
        phone_number_home: userInfo.phoneNumberHome,
        phone_number_work: userInfo.phoneNumberWork,
        phone_number_other: userInfo.phoneNumberOther,
      };

      updateUserInfo(formData);
    }

    setIsContactInfoEdit(false);
  };

  const updateAddressInfo = () => {
    if (checkRequiredFields()) {
      toast.error(checkRequiredFields);
    } else {
      const formData = {
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,

        gender: userInfo.gender ? userInfo.gender.value : null,
        language: userInfo.language ? userInfo.language.value : null,

        street: userInfo.street,
        city: userInfo.city,
        state: userInfo.state,
        zip: userInfo.zip,
        country: userInfo.country ? userInfo.country.value : null,
      };
      updateUserInfo(formData);
    }
    setIsAddressInfoEdit(false);
  };

  const updateOtherInfo = () => {
    if (checkRequiredFields()) {
      toast.error(checkRequiredFields);
    } else {
      const formData = {
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,

        gender: userInfo.gender ? userInfo.gender.value : null,
        language: userInfo.language ? userInfo.language.value : null,

        url: userInfo.url,
        quote: userInfo.quote,
      };

      updateUserInfo(formData);
    }
    setIsOtherInfoEdit(false);
  };

  // ===== getUserProfile
  const getUserProfile = async () => {
    setIsLoading(true);

    await axios
      .get("/api/v4/edit-profile")
      .then((res) => {
        console.log(" user profile------", res.data.data);
        const user = res.data.data;

        const newData = {
          userName: user.username,
          email: user.email,
          image: `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/assets/user/${user.image}`,

          firstName: user.first_name,
          middleName: user.middle_name,
          lastName: user.last_name,
          gender: user.gender
            ? { value: user.gender, label: user.gender }
            : null,
          dob: user.date_of_birth ? new Date(user.date_of_birth) : null,

          language: user.language
            ? { value: user.language, label: user.language }
            : null,

          phoneNumberMobile: user.phone_number,
          phoneNumberWork: user.phone_number_work,
          phoneNumberHome: user.phone_number_home,
          phoneNumberOther: user.phone_number_other,

          street: user.street,
          state: user.state,
          country: user.country
            ? { value: user.country, label: user.country }
            : null,
          city: user.city,
          zip: user.zip,

          url: user.url,
          quote: user.quote,
        };
        setUserInfo(newData);
      })
      .catch((err) => {
        console.log("profile error :: ", err);
        // errorNotify(err.response.data?.user_message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateImage = async (file) => {
    // const jsonString = JSON.parse(localStorage.getItem("persist:root"))?.auth;
    // const data = JSON.parse(jsonString);
    // const token = data.token;

    const formData = new FormData();

    formData.append("first_name", userInfo.firstName);
    formData.append("last_name", userInfo.lastName);
    formData.append("gender", userInfo.gender.value);
    formData.append("language", userInfo.language.value);
    formData.append("image", file);
    // formData.append("image", file);

    console.log("user.token", token);

    try {
      const response = await fetch(
        `https://apiv4.singularitybd.co/api/v4/update-profile`,
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
        setUserInfo((prevInfo) => ({
          ...prevInfo,
          image: `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/assets/user/${responseData.data.image}`,
        }));
        toast.success(responseData.user_message);
        dispatch(UPDATE_USER(responseData.data));
      } else {
        const errorResponse = await response.json();
        console.log("try img update err: ", errorResponse);
        if (errorResponse.errors.image?.length) {
          const errorMessage = errorResponse.errors.image.join(" ");
          toast.error(errorMessage);
        } else {
          toast.error(errorResponse.message);
        }
      }
    } catch (error) {
      console.log("catch img update error: ", error);
    }
  };

  // ===== update User info
  const updateUserInfo = async (formData) => {
    setIsLoading(true);

    console.log("formData", formData);
    await axios
      .post("/api/v4/update-profile", formData)
      .then((res) => {
        console.log("profile update res : ", res.data);
        toast.success(res.data.user_message);
        dispatch(UPDATE_USER(res.data.data));
      })
      .catch((err) => {
        console.log("profile update err : ", err.response);
        toast.error(err.response.data.message);
      })
      .finally(() => {});
  };

  useEffect(() => {
    console.log("serverBaseUrl", process.env.NEXT_PUBLIC_SERVER_BASE_URL);
    getUserProfile();
  }, []);

  useEffect(() => {
    user.is_first_login === true ? setChangePasswordModalIsOpen(true) : "";
  }, []);

  return (
    <div>
      <ChangePasswordModal
        setChangePasswordModalIsOpen={setChangePasswordModalIsOpen}
        changePasswordModalIsOpen={changePasswordModalIsOpen}
      />
      <h1 className="text-[32px] text-primaryText font-bold mb-2.5">
        User Profile
      </h1>
      <div className="bg-white p-4 rounded-xl">
        {/* ==== banner frame ==== */}
        <div>
          <img
            className="w-full min-h-[165px] object-cover rounded-[10px]"
            src={profileFrame.src}
            alt=""
          />
        </div>

        {/* ==== user info ====  */}
        <div className="md:flex items-center md:space-x-4 -mt-[40px] sm:px-10">
          {/* ==== user image ====  */}
          <div className="relative w-fit  ">
            <div className="h-[172px] w-[172px] rounded-full p-1.5 bg-gradient ">
              {userInfo.image ? (
                <img
                  src={userInfo.image}
                  className="h-full w-full rounded-full"
                />
              ) : (
                <img
                  src={userAvatar.src}
                  className="h-full w-full rounded-full"
                />
              )}
            </div>
            <div
              onClick={importImage}
              className="w-fit absolute bottom-1.5 right-6 cursor-pointer"
            >
              <ProfilePhotoSelector />
            </div>
          </div>

          {/* ==== user details ====  */}
          <div className="md:pt-8 pt-3">
            <h1 className="text-[26px] text-primaryText font-bold">
              {user && user.customer_name}
            </h1>
            <p className=" text-primaryText font-light ">{userInfo.email}</p>
            <p className=" text-primaryText font-light">
              User Name: {user && user?.username}
            </p>
          </div>
        </div>

        {/* ====== general info ====  */}
        <div className="sm:px-10 pt-[35px]">
          <div className="flex justify-between items-center border-b pb-2">
            <h1 className="text-[22px] text-primaryText font-bold">
              General Info
            </h1>

            {isGeneralInfoEdit ? (
              <button
                onClick={updateGeneralInfo}
                className="w-[68px] h-[32px] flex items-center justify-center rounded-lg bg-primary font-medium hover:shadow-lg hover:shadow-primary/60 duration-200 "
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsGeneralInfoEdit(true)}
                className="w-[68px] h-[32px] rounded-lg bg-buttonGray text-sm flex items-center justify-center space-x-2 hover:shadow-lg "
              >
                <EditTableSVG fillColor={"black"} />
                <span>Edit</span>
              </button>
            )}
          </div>

          <div className="xl:grid grid-cols-2 2xl:gap-x-14 gap-x-8 pt-4">
            <div className="pt-1">
              <div className="sm:flex items-center sm:mb-0 mb-3">
                <p className="text-tmvDarkGray font-light w-[190px] ">
                  First Name
                </p>
                <div className="grow border-b px-2 pb-2 pt-3">
                  <input
                    required
                    className=" w-full placeholder:text-tmvGray font-semibold outline-none"
                    type="text"
                    placeholder="Enter Your First Name*"
                    value={userInfo.firstName}
                    onChange={(event) =>
                      handleUserInfo(event, "firstName", false)
                    }
                    readOnly={!isGeneralInfoEdit}
                  />
                </div>
              </div>
              <div className="sm:flex items-center sm:mb-0 mb-3">
                <p className="text-tmvDarkGray font-light w-[190px] ">
                  Middle Name
                </p>
                <div className="grow border-b px-2 pb-2 pt-3">
                  <input
                    className=" w-full placeholder:text-tmvGray font-semibold outline-none "
                    type="text"
                    placeholder="Enter Your Middle Name"
                    value={userInfo.middleName}
                    onChange={(event) =>
                      handleUserInfo(event, "middleName", false)
                    }
                    readOnly={!isGeneralInfoEdit}
                  />
                </div>
              </div>
              <div className="sm:flex items-center sm:mb-0 mb-3">
                <p className="text-tmvDarkGray font-light w-[190px] ">
                  Last Name
                </p>
                <div className="grow border-b px-2 pb-2 pt-3">
                  <input
                    required
                    className=" w-full placeholder:text-tmvGray font-semibold outline-none"
                    type="text"
                    placeholder="Enter Your Last Name*"
                    value={userInfo.lastName}
                    onChange={(event) =>
                      handleUserInfo(event, "lastName", false)
                    }
                    readOnly={!isGeneralInfoEdit}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="sm:flex items-center sm:mb-0 mb-3">
                <p className="text-tmvDarkGray font-light w-[190px]">Gender</p>
                <div className="grow border-b  min-w-[204px]">
                  <Select
                    id="gender"
                    required
                    onChange={(event) => handleUserInfo(event, "gender", true)}
                    options={genderOptions}
                    value={userInfo.gender}
                    placeholder={"Select Gender"}
                    styles={selectStyle}
                    isDisabled={!isGeneralInfoEdit}
                  />
                  {/* onChange={handleGenderSelect}  */}
                  {/* value={selectedGender}  */}
                </div>
              </div>

              <div className="sm:flex items-center sm:mb-0 mb-3">
                <p className="text-tmvDarkGray font-light w-[190px] ">
                  Date of Birth
                </p>
                <div className="grow border-b  py-3 pl-2">
                  <DatePicker
                    selected={userInfo.dob}
                    onChange={(event) => handleUserInfo(event, "dob", true)}
                    dateFormat="dd/MM/yyyy"
                    className="outline-none"
                    placeholderText="Select Date of Birth"
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    isDisabled={!isGeneralInfoEdit}
                  />
                  {/* onChange={(date) => handleTimeSelect(date)}  */}
                </div>
              </div>

              <div className="sm:flex items-center sm:mb-0 mb-3">
                <p className="text-tmvDarkGray font-light w-[190px] pb-2">
                  Language
                </p>
                <div className="grow border-b min-w-[204px]">
                  <Select
                    id="language"
                    required
                    onChange={(event) =>
                      handleUserInfo(event, "language", true)
                    }
                    options={languageOptions}
                    value={userInfo.language}
                    placeholder={"Select Language"}
                    styles={selectStyle}
                    isDisabled={!isGeneralInfoEdit}
                  />
                  {/* onChange={handleLanguageSelect}  */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====== contact ====  */}
        <div className="sm:px-10 pt-[35px]">
          <div className="flex justify-between items-center border-b pb-2">
            <h1 className="text-[22px] text-primaryText font-bold">Contact</h1>

            {isContactInfoEdit ? (
              <button
                onClick={updateContactInfo}
                className="w-[68px] h-[32px] flex items-center justify-center rounded-lg bg-primary font-medium hover:shadow-lg hover:shadow-primary/60 duration-200 "
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsContactInfoEdit(true)}
                className="w-[68px] h-[32px] rounded-lg bg-buttonGray text-sm flex items-center justify-center space-x-2 hover:shadow-lg "
              >
                <EditTableSVG fillColor={"black"} />
                <span>Edit</span>
              </button>
            )}
          </div>

          <div className="xl:grid grid-cols-2 2xl:gap-x-14 gap-x-8 pt-4">
            <div className="pt-1">
              <div className="sm:flex items-center sm:mb-0 mb-3">
                <p className="text-tmvDarkGray font-light w-[190px] ">
                  Phone Number (Mobile)
                </p>
                <div className="grow border-b px-2 pb-2 pt-3">
                  <input
                    required
                    onChange={(event) =>
                      handleUserInfo(event, "phoneNumberMobile", false)
                    }
                    value={userInfo.phoneNumberMobile}
                    className=" w-full placeholder:text-tmvGray font-semibold outline-none"
                    type="text"
                    placeholder="Enter Your Number (Mobile)*"
                    readOnly={!isContactInfoEdit}
                  />
                </div>
              </div>
              <div className="sm:flex items-center sm:mb-0 mb-3">
                <p className="text-tmvDarkGray font-light w-[190px] ">
                  Phone Number (Work)
                </p>
                <div className="grow border-b px-2 pb-2 pt-3">
                  <input
                    onChange={(event) =>
                      handleUserInfo(event, "phoneNumberWork", false)
                    }
                    value={userInfo.phoneNumberWork}
                    className=" w-full placeholder:text-tmvGray font-semibold outline-none "
                    type="text"
                    placeholder="Enter Your Number (Work)"
                    readOnly={!isContactInfoEdit}
                  />
                </div>
              </div>
            </div>

            <div className="pt-1">
              <div className="sm:flex items-center sm:mb-0 mb-3">
                <p className="text-tmvDarkGray font-light w-[190px] ">
                  Phone Number (Home)
                </p>
                <div className="grow border-b px-2 pb-2 pt-3">
                  <input
                    onChange={(event) =>
                      handleUserInfo(event, "phoneNumberHome", false)
                    }
                    value={userInfo.phoneNumberHome}
                    className=" w-full placeholder:text-tmvGray font-semibold outline-none"
                    type="text"
                    placeholder="Enter Your Number (Home)"
                    readOnly={!isContactInfoEdit}
                  />
                </div>
              </div>
              <div className="sm:flex items-center sm:mb-0 mb-3">
                <p className="text-tmvDarkGray font-light w-[190px] ">
                  Phone Number (Other)
                </p>
                <div className="grow border-b px-2 pb-2 pt-3">
                  <input
                    onChange={(event) =>
                      handleUserInfo(event, "phoneNumberOther", false)
                    }
                    value={userInfo.phoneNumberOther}
                    className=" w-full placeholder:text-tmvGray font-semibold outline-none "
                    type="text"
                    placeholder="Enter Your Number (Other)"
                    readOnly={!isContactInfoEdit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====== Address ====  */}
        <div className="sm:px-10 pt-[35px]">
          <div className="flex justify-between items-center border-b pb-2">
            <h1 className="text-[22px] text-primaryText font-bold">Address</h1>

            {isAddressInfoEdit ? (
              <button
                onClick={updateAddressInfo}
                className="w-[68px] h-[32px] flex items-center justify-center rounded-lg bg-primary font-medium hover:shadow-lg hover:shadow-primary/60 duration-200 "
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsAddressInfoEdit(true)}
                className="w-[68px] h-[32px] rounded-lg bg-buttonGray text-sm flex items-center justify-center space-x-2 hover:shadow-lg "
              >
                <EditTableSVG fillColor={"black"} />
                <span>Edit</span>
              </button>
            )}
          </div>

          <div className="xl:grid grid-cols-2 2xl:gap-x-14 gap-x-8 pt-4">
            <div className="pt-1">
              <div className="sm:flex items-center sm:mb-0 mb-3">
                <p className="text-tmvDarkGray font-light w-[190px] ">Street</p>
                <div className="grow border-b px-2 pb-2 pt-3">
                  <input
                    onChange={(event) => handleUserInfo(event, "street", false)}
                    value={userInfo.street}
                    className=" w-full placeholder:text-tmvGray font-semibold outline-none"
                    type="text"
                    placeholder="Street"
                    readOnly={!isAddressInfoEdit}
                  />
                </div>
              </div>
              <div className="sm:flex items-center sm:mb-0 mb-3">
                <p className="text-tmvDarkGray font-light w-[190px] ">State</p>
                <div className="grow border-b px-2 pb-2 pt-3">
                  <input
                    onChange={(event) => handleUserInfo(event, "state", false)}
                    value={userInfo.state}
                    className=" w-full placeholder:text-tmvGray font-semibold outline-none "
                    type="text"
                    placeholder="State"
                    readOnly={!isAddressInfoEdit}
                  />
                </div>
              </div>

              <div className="sm:flex items-center sm:mb-0 mb-3">
                <p className="text-tmvDarkGray font-light w-[190px]">Country</p>
                <div className="grow border-b min-w-[204px]">
                  <Select
                    id="country"
                    onChange={(event) => handleUserInfo(event, "country", true)}
                    value={userInfo.country}
                    options={countryOptions}
                    placeholder={"Select Your Country"}
                    styles={selectStyle}
                    isDisabled={!isAddressInfoEdit}
                  />
                </div>
              </div>
            </div>

            <div className="pt-1">
              <div className="sm:flex items-center sm:mb-0 mb-3">
                <p className="text-tmvDarkGray font-light w-[190px] ">City</p>
                <div className="grow border-b px-2 pb-2 pt-3">
                  <input
                    onChange={(event) => handleUserInfo(event, "city", false)}
                    value={userInfo.city}
                    className=" w-full placeholder:text-tmvGray font-semibold outline-none"
                    type="text"
                    placeholder="City"
                    readOnly={!isAddressInfoEdit}
                  />
                </div>
              </div>
              <div className="sm:flex items-center sm:mb-0 mb-3">
                <p className="text-tmvDarkGray font-light w-[190px] ">Zip</p>
                <div className="grow border-b px-2 pb-2 pt-3">
                  <input
                    onChange={(event) => handleUserInfo(event, "zip", false)}
                    value={userInfo.zip}
                    className=" w-full placeholder:text-tmvGray font-semibold outline-none "
                    type="text"
                    placeholder="Zip"
                    readOnly={!isAddressInfoEdit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====== Change Password ======  */}
        <div className="px-10 pt-[35px]">
          <button
            onClick={() => setChangePasswordModalIsOpen(true)}
            className="w-[190px] h-[50px] rounded-lg bg-primary text-center font-medium hover:shadow-lg hover:shadow-primary/60 duration-200 "
          >
            Change Password
          </button>
        </div>

        {/* ====== other ====  */}
        <div className="sm:px-10 pt-[35px]">
          <div className="flex justify-between items-center border-b pb-2">
            <h1 className="text-[22px] text-primaryText font-bold">Other</h1>

            {isOtherInfoEdit ? (
              <button
                onClick={updateOtherInfo}
                className="w-[68px] h-[32px] flex items-center justify-center rounded-lg bg-primary font-medium hover:shadow-lg hover:shadow-primary/60 duration-200 "
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsOtherInfoEdit(true)}
                className="w-[68px] h-[32px] rounded-lg bg-buttonGray text-sm flex items-center justify-center space-x-2 hover:shadow-lg "
              >
                <EditTableSVG fillColor={"black"} />
                <span>Edit</span>
              </button>
            )}
          </div>

          <div className=" pt-4">
            <div className="pt-1">
              <div className="sm:flex items-center sm:mb-0 mb-3">
                <p className="text-tmvDarkGray font-light w-[190px] ">Url</p>
                <div className="grow border-b px-2 pb-2 pt-3">
                  <input
                    onChange={(event) => handleUserInfo(event, "url", false)}
                    value={userInfo.url}
                    className=" w-full placeholder:text-tmvGray font-semibold outline-none"
                    type="text"
                    placeholder="Enter Url"
                    readOnly={!isOtherInfoEdit}
                  />
                </div>
              </div>
              <div className="sm:flex items-center sm:mb-0 mb-3 ">
                <p className="text-tmvDarkGray font-light w-[190px] ">Quote</p>
                <div className="grow border-b px-2 pb-2 pt-3">
                  <textarea
                    value={userInfo.quote}
                    ref={textareaRef}
                    onChange={handleQuoteInput}
                    onKeyDown={handleTextareaKeyDown}
                    rows={1}
                    className="w-full placeholder:text-tmvGray font-semibold outline-none "
                    placeholder="Type here"
                    readOnly={!isOtherInfoEdit}
                  />
                </div>
              </div>
              <div className="h-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
