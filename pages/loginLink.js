import Layout from "@/components/layouts/Layout";
import axios from "@/plugins/axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { SIGNIN } from "@/store/slices/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "@/components/LoadingScreen";

const loginLink = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { email, password } = router.query;

  const handleInput = async () => {
    const data = {
      identifier: email,
      password: password,
    };
    await axios
      .post("/api/v4/login", data)
      .then((res) => {
        const user = res.data;
        dispatch(SIGNIN({ token: user.access_token, user: user.data }));
        res.data.code === 200 ? location.replace("/analytics-and-summary") : "";
        console.log(res.data.code);
        console.log(res.data);
      })
      .catch((err) => {
        console.log("Something is wrong");
        // errorNotify("Something is wrong");
      });
  };

  const errorNotify = (mgs) => {
    toast.error(mgs, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  useEffect(() => {
    handleInput();
  }, [email, password]);

  return (
    <>
      <ToastContainer />
      <LoadingScreen />
    </>
  );
};

export default loginLink;

loginLink.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
