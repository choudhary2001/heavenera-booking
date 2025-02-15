import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { useSelector, useDispatch } from 'react-redux';
import { createPopper } from "@popperjs/core";
import { logout } from '../../actions/authActions';
import PagesDropdown from "components/Dropdowns/PagesDropdown.js";
import axios from 'axios'; // Ensure axios is imported

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const [isClient, setIsClient] = useState(false); // Track if it's client-side
  const [weather, setWeather] = useState(null); // Store weather data

  const dispatch = useDispatch();
  const btnDropdownRef = useRef();
  const popoverDropdownRef = useRef();

  // State from Redux
  const lat = useSelector((state) => state.auth.lat);
  const lng = useSelector((state) => state.auth.lng);

  const isAuthenticated = useSelector((state) => !!state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const refreshToken = useSelector((state) => state.auth.refreshToken);

  const weatherFetched = useRef(false);

  // Only run on client side
  useEffect(() => {
    setIsClient(true); // Set client flag
  }, []);

  // Handle dropdown popover
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };

  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout(refreshToken, accessToken)); // Logout action
  };

  useEffect(() => {
    if (lat && lng) {
      const fetchWeather = async () => {
        const apiKey = 'bd5e378503939ddaee76f12ad7a97608'; // Replace with your OpenWeatherMap API key
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

        try {
          const response = await axios.get(url);
          setWeather(response.data);
        } catch (error) {
          console.error("Error fetching weather:", error);
          setWeather(null);
        }

        weatherFetched.current = true; // Mark weather as fetched
      };

      fetchWeather();
    }
  }, [lat, lng]);

  if (!isClient) {
    return null; // Prevent rendering on the server-side
  }

  return (
    <nav className="top-0 relative  w-full flex flex-wrap items-center justify-between px-2 py-3 bg-red-500 navbar-expand-lg sticky z-9999" style={{ zIndex: 9999 }}>
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <Link href="/" className='flex items-center'>
            {/* <p className="text-black text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase">
              Heavenera
            </p> */}
            <img src='/img/logo.jpeg' style={{ height: "60px", borderRadius: "100%" }} />
            &nbsp;
            {weather && (
              <p className='bg-white p-1 rounded'>
                {weather.main.temp}°C
              </p>
            )}
          </Link>
          <button
            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <i className="text-white fas fa-bars"></i>
          </button>
        </div>

        <div
          className={
            "lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" +
            (navbarOpen ? " block rounded shadow-lg" : " hidden")
          }
          id="navbar-collapse"
        >
          <ul className="flex flex-col lg:flex-row list-none lg:ml-auto p-2">
            {!user ? (
              <li className="flex items-center">
                <Link href="/auth/login">
                  <button
                    className="bg-white text-blueGray-700 active:bg-blueGray-50 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                    type="button"
                  >
                    <i className="fas fa-user"></i> Login
                  </button>
                </Link>
              </li>
            ) : (
              <>
                <li className="flex items-center">
                  <button
                    className="bg-white text-blueGray-700 active:bg-blueGray-50 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150 cursor-pointer"
                    ref={btnDropdownRef}
                    onClick={(e) => {
                      e.preventDefault();
                      dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
                    }}
                  >
                    <i className="fas fa-user"></i> {user?.first_name}
                  </button>

                  <div
                    ref={popoverDropdownRef}
                    className={
                      (dropdownPopoverShow ? "block" : "hidden") +
                      " bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
                    }
                  >
                    {role === 'admin' ? (
                      <>
                        <span className="text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400">
                          Room Owner
                        </span>
                        <Link href="/admin/dashboard">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Dashboard
                          </p>
                        </Link>
                        <Link href="/admin/bookings">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Bokkings
                          </p>
                        </Link>
                        <Link href="/admin/profile">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Profile
                          </p>
                        </Link>
                        <Link href="/admin/maps">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Maps
                          </p>
                        </Link>
                        <h6 className="md:min-w-full text-blueGray-700 text-xs uppercase font-bold block pt-1  no-underline pl-4">
                          Customer Support
                        </h6>
                        <Link href="#">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Live Chat
                          </p>
                        </Link>
                        <Link href="/faq">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Faq Question
                          </p>
                        </Link>
                        <Link href="/contact-us">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Contact
                          </p>
                        </Link>
                      </>
                    ) : null}
                    {role === 'owner' ? (
                      <>
                        <span className="text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400">
                          Room Owner
                        </span>
                        <Link href="/owner/dashboard">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Dashboard
                          </p>
                        </Link>
                        <Link href="/owner/bookings">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Bokkings
                          </p>
                        </Link>
                        <Link href="/owner/profile">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Profile
                          </p>
                        </Link>
                        <Link href="/owner/maps">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Maps
                          </p>
                        </Link>
                        <h6 className="md:min-w-full text-blueGray-700 text-xs uppercase font-bold block pt-1  no-underline pl-4">
                          Customer Support
                        </h6>
                        <Link href="#">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Live Chat
                          </p>
                        </Link>
                        <Link href="/faq">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Faq Question
                          </p>
                        </Link>
                        <Link href="/contact-us">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Contact
                          </p>
                        </Link>
                      </>
                    ) : null}
                    {role === 'user' ? (
                      <>

                        <Link href="/user/dashboard">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Dashboard
                          </p>
                        </Link>
                        <Link href="/user/bookings">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Bokkings
                          </p>
                        </Link>
                        <Link href="/user/profile">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Profile
                          </p>
                        </Link>
                        <Link href="/user/maps">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Maps
                          </p>
                        </Link>
                        <h6 className="md:min-w-full text-blueGray-700 text-xs uppercase font-bold block pt-1  no-underline pl-4">
                          Customer Support
                        </h6>
                        <Link href="#">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Live Chat
                          </p>
                        </Link>
                        <Link href="/faq">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Faq Question
                          </p>
                        </Link>
                        <Link href="/contact-us">
                          <p className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
                            Contact
                          </p>
                        </Link>
                      </>
                    ) : null}

                    <button
                      onClick={handleLogout}
                      className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-left text-red-500 font-bold"
                    >
                      Logout
                    </button>
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
