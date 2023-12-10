import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

const Recapcha = () => {
  // google capcha
  function onChange(value) {
    console.log("Captcha value:", value);
  }

  return (
    <div>
      <ReCAPTCHA
        style={{ width: "100%" }}
        sitekey="Your client site key"
        onChange={onChange}
      />
    </div>
  );
};

export default Recapcha;
