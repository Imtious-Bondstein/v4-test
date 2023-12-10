import Message from "@/svg/MessageSVG";
import React from "react";
import { useRouter } from "next/router";

const Chat = () => {
  const { pathname } = useRouter();
  return (
    <>
    {
      pathname === "/signin" || pathname === "/signup" || pathname === "/verify" || pathname === "/sendotp" || pathname === "/resetpassword" ? 
      <div className="flex justify-center">
        <button className="md:fixed md:bottom-6 md:right-6 ease-in duration-300 tmv-shadow rounded-xl p-3 bg-gradient flex justify-center text-primaryText text-sm font-bold">
            <Message /> &nbsp; &nbsp;
            Chat
        </button>
      </div> :
      <div>
        <button className="fixed bottom-6 right-6 tmv-shadow rounded-xl w-28 py-4 bg-gradient flex justify-center items-center z-50">
          <Message />
          <p className="text-primaryText text-sm ml-3 font-bold">Chat</p>
        </button>
      </div>
      
      }
    </>
  );
};

export default Chat;
