import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Chat from "../Chat";
import findUrlName from "@/utils/urlMapper";
import AuthContact from "../AuthContacts";

const Layout = ({ children }) => {
  const { pathname } = useRouter();
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle("Track My Vehicle | ".concat(findUrlName(pathname)));
  }, [pathname]);
  return (
    <>
      {/* ========head======== */}
      <Head>
        <title>{title}</title>
      </Head>
      {/* ========body======== */}
      {pathname === "/signin" ||
      pathname === "/signup" ||
      pathname === "/verify" ||
      pathname === "/sendotp" ||
      pathname === "/resetpassword" ? (
        <AuthContact />
      ) : (
        <Chat />
      )}
      <main>{children}</main>
    </>
  );
};
export default Layout;
