import Chat from "./Chat";
import Call from "./Call";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Contact from "./Contact";

const AuthContact = () => {
  const [contacts, setContacts] = useState(false);
  const { pathname } = useRouter()

  const handleContact = () => {
    {
      contacts === false ? setContacts(true) : setContacts(false)
    }
  }

  return (
    <div className="">
      <div onClick={() => handleContact()} className="fixed ease-in duration-300 left-0 bottom-14 right-0 z-[90px] pb-2 md:hidden">
        <Contact  />
      </div>
      <div className={`${contacts === true ? "-translate-y-14 translate-x-14" : ""} pb-2 fixed ease-in duration-300 left-0 bottom-14 right-0 z-40`}>
        <Chat />
      </div>
      <div className={`${contacts === true ? "-translate-y-14 -translate-x-14 -mt-1" : ""} pb-2 fixed ease-in duration-300 left-0 bottom-14 right-0 z-40 md:hidden`}>
        <Call />
      </div>
    </div>
  );
};

export default AuthContact;



