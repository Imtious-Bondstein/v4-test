// import { useState, useRef, useEffect } from "react";

// function dropdown() {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const excludedRef = useRef(null);

//   useEffect(() => {
//     // Close dropdown when user clicks outside of it
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
//         !excludedRef.current.contains(event.target)) {
//         setIsOpen(false);
//         console.log("click outside");
//       }
//     }

//     // Bind the event listener
//     document.addEventListener("mousedown", handleClickOutside);

//     // Unbind the event listener on cleanup
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [dropdownRef, excludedRef]);

//   return (
//     <div className="dropdown" ref={dropdownRef}>
//       <button ref={excludedRef} onClick={() => setIsOpen(!isOpen)}>Open Dropdown</button>
//       {isOpen && (
//         <ul>
//           <li>Option 1</li>
//           <li>Option 2</li>
//           <li>Option 3</li>
//         </ul>
//       )}
//     </div>
//   );
// }

// export default dropdown;


import React, { useRef, useState, useEffect } from "react";

function DropdownList() {
  const [data, setData] = useState([
    { options: ["Option 1", "Option 2", "Option 3"] },
    { options: ["Option A", "Option B"] },
    { options: ["Option X", "Option Y", "Option Z"] },
    { options: ["Option P", "Option Q", "Option R", "Option S"] },
  ]);
  const dropdownsRef = useRef([]);
  const [isOpen, setIsOpen] = useState(new Array(data.length).fill(false));

  function handleDropdownClick(index) {
    setIsOpen((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = !updatedState[index];
      return updatedState;
    });
  }

  function handleOutsideClick(e) {
    dropdownsRef.current.forEach((dropdownRef, index) => {
      if (dropdownRef && !dropdownRef.contains(e.target)) {
        setIsOpen((prevState) => {
          const updatedState = [...prevState];
          updatedState[index] = false;
          return updatedState;
        });
      }
    });
  }

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);

    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  }, []);

  return (
    <div>
      {data.map((item, index) => (
        <div key={index} ref={(el) => (dropdownsRef.current[index] = el)}>
          <button onClick={() => handleDropdownClick(index)}>
            Toggle Dropdown {index + 1}
          </button>
          {isOpen[index] && (
            <ul>
              {item.options.map((option, optionIndex) => (
                <li key={optionIndex}>{option}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default DropdownList;
