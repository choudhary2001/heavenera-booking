import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
// components
import apiClient from '../../actions/axiosInterceptor';

import CardSettings from "components/Cards/CardSettings.js";
import CardProfile from "components/Cards/CardProfile.js";

// layout for page
import User from "layouts/User.js";

export default function Profile() {

  const authState = useSelector((state) => state.auth);
  const isAuthenticated = useSelector((state) => !!state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);

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

  const [loading, setLoading] = useState(true); // State to manage loading

  // Fetch user data if access token is available
  const fetchUserData = async () => {
    try {
      const response = await apiClient.get(`/api/auth/${role}/me/`);
      const roomOwner = response?.data;
      console.log(roomOwner);
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
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Display loader if data is loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-solid rounded-full border-blue-600 border-t-transparent" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-8/12 px-4">
          <CardSettings userData={userData} role={role} />
        </div>
        <div className="w-full lg:w-4/12 px-4">
          <CardProfile userData={userData} />
        </div>
      </div>
    </>
  );
}

Profile.layout = User;
