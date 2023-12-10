import React from "react";
import "../../styles/pages/Home.css";

const FavoriteIcon = ({ isFavorite }) => {
  return (
    <div>
      <svg
        className={`favourite-icon duration-300 ease-in-out
          ${
            isFavorite
              ? "stroke-[#FF6B6B] fill-[#FF6B6B]"
              : "stroke-[#8D96A1] fill-white"
          }`}
        viewBox="0 0 18 18"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.1891 2.42752C12.9875 1.07705 11.0659 1.62127 9.9116 2.48816C9.4383 2.8436 9.20165 3.02132 9.06242 3.02132C8.92318 3.02132 8.68653 2.8436 8.21323 2.48816C7.05889 1.62127 5.13734 1.07705 2.93574 2.42752C0.0463855 4.19985 -0.607406 10.0469 6.05721 14.9798C7.32662 15.9193 7.96132 16.3891 9.06242 16.3891C10.1635 16.3891 10.7982 15.9193 12.0676 14.9798C18.7322 10.0469 18.0784 4.19985 15.1891 2.42752Z"
          strokeWidth="1.23148"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default FavoriteIcon;
