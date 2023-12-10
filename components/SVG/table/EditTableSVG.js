import React from "react";

const EditTableSVG = ({ fillColor }) => {
  return (
    <div>
      <svg
        width="14"
        height="15"
        viewBox="0 0 14 15"
        xmlns="http://www.w3.org/2000/svg"
        className={`group-hover:fill-[url(#paint0_linear_1361_1258)] ${
          fillColor ? "fill-fillColor" : "fill-[#8D96A1]"
        }`}
      >
        <path d="M13.3659 0.624949C13.1705 0.426987 12.9377 0.269805 12.681 0.162524C12.4244 0.0552432 12.149 0 11.8708 0C11.5927 0 11.3173 0.0552432 11.0606 0.162524C10.804 0.269805 10.5712 0.426987 10.3758 0.624949L9.03125 1.99046L12.0004 4.95958L13.3449 3.61508C13.5442 3.42105 13.703 3.18937 13.8121 2.93348C13.9212 2.67759 13.9784 2.40257 13.9804 2.1244C13.9823 1.84623 13.929 1.57045 13.8235 1.31305C13.718 1.05564 13.5625 0.821754 13.3659 0.624949Z" />
        <path d="M8.0372 2.98438L2.16198 8.85959C2.10931 8.91374 2.06452 8.97503 2.02893 9.04166L0.0821944 12.9701C0.0257179 13.0762 -0.00252644 13.195 0.000177396 13.3151C0.00288123 13.4352 0.0364423 13.5526 0.0976333 13.656C0.158824 13.7594 0.245587 13.8453 0.349578 13.9054C0.453569 13.9656 0.571291 13.998 0.691424 13.9995C0.798123 14 0.903511 13.976 0.99954 13.9295L4.92802 11.9828C4.99465 11.9472 5.05594 11.9024 5.11009 11.8497L10.9853 5.9745L8.0372 2.98438Z" />
        <path d="M13.2966 14.0021H6.99421C6.80849 14.0021 6.63037 13.9283 6.49905 13.797C6.36772 13.6657 6.29395 13.4875 6.29395 13.3018C6.29395 13.1161 6.36772 12.938 6.49905 12.8067C6.63037 12.6753 6.80849 12.6016 6.99421 12.6016H13.2966C13.4823 12.6016 13.6604 12.6753 13.7917 12.8067C13.9231 12.938 13.9969 13.1161 13.9969 13.3018C13.9969 13.4875 13.9231 13.6657 13.7917 13.797C13.6604 13.9283 13.4823 14.0021 13.2966 14.0021Z" />
        <defs>
          <linearGradient
            id="paint0_linear_1361_1258"
            x1="20.6748"
            y1="9.81814"
            x2="0.674805"
            y2="9.81814"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.0104167" stopColor="#F36B24" />
            <stop offset="1" stopColor="#FDD10E" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default EditTableSVG;