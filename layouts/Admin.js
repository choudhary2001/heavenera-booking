import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import { clearMessage } from './../actions/authActions';

export default function Admin({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const isAuthenticated = useSelector((state) => !!state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const refreshToken = useSelector((state) => state.auth.refreshToken);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
    if (role !== 'admin') {
      router.push('/auth/login');
    }

    if (authState.message) {
      setMessage(authState.message);
    }
    if (authState.error) {
      setMessage(authState.error);
    }

    return () => {
      dispatch(clearMessage());
    };
  }, [isAuthenticated, authState.message, dispatch, router]);

  const layoutData = {
    user,
    role,
  };

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />

        <div className="px-4 md:px-10 mx-auto w-full p-12 responsive-padding" style={{ paddingTop: "75px", minHeight: "100vh" }}>
          {children}
          <FooterAdmin />
        </div>
      </div>
      <style jsx>
        {`
                    @media (max-width: 768px) {
                    .responsive-padding {
                        padding-top: 55px;
                    }
                    }
                `}
      </style>
    </>
  );
}
