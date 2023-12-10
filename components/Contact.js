import Contacts from "@/svg/ContactSVG";
import React from "react";

const Contact = () => {
  return (
    <div className="flex justify-center">
        <button className="tmv-shadow rounded-xl p-3 bg-gradient flex justify-center items-center text-primaryText text-sm font-bold">
            <Contacts /> &nbsp;
            Contact Us
        </button>
    </div>
  );
};

export default Contact;
