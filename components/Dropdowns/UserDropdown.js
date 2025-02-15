import React, { useState, useRef, useEffect } from "react";
import { createPopper } from "@popperjs/core";
import apiClient from '../../actions/axiosInterceptor';
import baseURL from '../../url';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../actions/authActions';
const UserDropdown = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const refreshToken = useSelector((state) => state.auth.refreshToken);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout(refreshToken, accessToken)); // Logout action
    localStorage.clear()
    sessionStorage.clear()
    window.location.href = '/auth/login';
  };

  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    profile_image: null,
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    bank_name: '',
    account_holder_name: '',
    account_number: '',
    ifsc_code: '',
    branch_name: '',
    id_proof_type: 'Aadhaar',
    id_proof_number: '',
    id_proof_image: null,
    emergency_contact: '',
    notes: '',
  });

  // Fetch user data if access token is available
  const fetchUserData = async () => {
    try {
      const response = await apiClient.get(`/api/auth/${role}/me/`);
      if (response.status === 200) {

        const roomOwner = response?.data;
        setUserData({
          first_name: roomOwner?.first_name || '',
          last_name: roomOwner?.last_name || '',
          phone: roomOwner?.phone || '',
          email: roomOwner?.email || '',
          date_of_birth: roomOwner?.date_of_birth || '',
          profile_image: roomOwner?.profile_image || null,
          address_line1: roomOwner?.address_line1 || '',
          address_line2: roomOwner?.address_line2 || '',
          city: roomOwner?.city || '',
          state: roomOwner?.state || '',
          postal_code: roomOwner?.postal_code || '',
          country: roomOwner?.country || '',
          bank_name: roomOwner?.bank_name || '',
          account_holder_name: roomOwner?.account_holder_name || '',
          account_number: roomOwner?.account_number || '',
          ifsc_code: roomOwner?.ifsc_code || '',
          branch_name: roomOwner?.branch_name || '',
          id_proof_type: roomOwner?.id_proof_type || 'Aadhaar',
          id_proof_number: roomOwner?.id_proof_number || '',
          id_proof_image: roomOwner?.id_proof_image || null,
          emergency_contact: roomOwner?.emergency_contact || '',
          notes: roomOwner?.notes || '',
        });
      }
      else {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      handleLogout();
    }
  };

  useEffect(() => {
    if (role !== null) {
      fetchUserData();
    }
  }, [role]);

  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const btnDropdownRef = useRef(null);
  const popoverDropdownRef = useRef(null);

  // Toggle Dropdown
  const toggleDropdown = () => {
    setDropdownPopoverShow((prev) => !prev);
  };

  useEffect(() => {
    if (dropdownPopoverShow && btnDropdownRef.current && popoverDropdownRef.current) {
      createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
        placement: "bottom-start",
      });
    }
  }, [dropdownPopoverShow]);

  return (
    <>
      {/* Dropdown Trigger Button */}
      <button
        className="text-blueGray-500 block focus:outline-none"
        ref={btnDropdownRef}
        onClick={toggleDropdown}
      >
        <div className="items-center flex">
          <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
            <img
              alt="User"
              className="w-full rounded-full align-middle border-none shadow-lg"
              src={userData?.profile_image ? `${baseURL}${userData.profile_image}` : `${baseURL}/media/profile_picture/Sample_User_Icon.png`}
            />
          </span>
        </div>
      </button>

      {/* Dropdown Menu */}
      <div
        ref={popoverDropdownRef}
        className={`${dropdownPopoverShow ? "block" : "hidden"
          } bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48`}
      >
        <a
          href="#"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
        >
          {userData.first_name} {userData.last_name}
        </a>
        {/* <a
          href="#another-action"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
        >
          Another Action
        </a>
        <a
          href="#something-else"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
        >
          Something Else Here
        </a> */}
        <div className="h-0 my-2 border border-solid border-blueGray-100" />
        <a
          href="#logout" onClick={handleLogout}
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-red-500 font-bold"
        >
          Logout
        </a>
      </div>
    </>
  );
};

export default UserDropdown;
