import React from "react";

import UserDropdown from "components/Dropdowns/UserDropdown.js";
import { useRouter } from "next/router";

export default function Navbar() {

  // Get the current router object
  const router = useRouter();

  // Extract and capitalize the last part of the URL
  const capitalizeLastSegment = (path) => {
    const segments = path.split("/").filter(Boolean); // Remove empty strings
    const lastSegment = segments.pop(); // Get the last segment
    return lastSegment ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) : "";
  };

  const pageTitle = capitalizeLastSegment(router.pathname);

  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center bg-red-500 p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <a
            className="text-black text-bold text-sm uppercase hidden lg:inline-block font-bold"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            {pageTitle}
          </a>
          {/* Form */}
          {/* <form className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
            <div className="relative flex w-full flex-wrap items-stretch">
              <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search here..."
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
              />
            </div>
          </form> */}
          {/* User */}
          <ul className="flex-col md:flex-row list-none hidden items-center md:flex">
            <UserDropdown />
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
