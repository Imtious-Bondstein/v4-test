import React from "react";
const Best = ({ isDropdownShow, toggleDropdown }) => {
  const handleButtonClick = () => {
    console.log("click", isDropdownShow);
    toggleDropdown();
  };
  return (
    <div>
      <button onClick={handleButtonClick} className="bg-white">
        click me bro!
      </button>
      {isDropdownShow && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col p-2 absolute top-16 right-0 shadow-md rounded-md w-28 bg-white duration-300 ease-in"
        >
          <p
            className="border-b p-1 hover:bg-gray-100 rounded-md cursor-pointer"
            // onClick={test}
          >
            My Session
          </p>
          <p
            className="border-b p-1 hover:bg-gray-100 rounded-md cursor-pointer"
            // onClick={test2}
          >
            Edit Profile
          </p>
          <p className="p-1 hover:bg-gray-100 rounded-md cursor-pointer">
            Sign Out
          </p>
        </div>
      )}
    </div>
  );
};
export default Best;
