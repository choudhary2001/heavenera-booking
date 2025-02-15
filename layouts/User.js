import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { createPopper } from "@popperjs/core";
import { logout } from './../actions/authActions';
import { useRouter } from 'next/router';
// components
import { clearMessage } from './../actions/authActions';

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/UserSidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

export default function User({ children }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const authState = useSelector((state) => state.auth);
    const isAuthenticated = useSelector((state) => !!state.auth.accessToken);
    const user = useSelector((state) => state.auth.user);
    const role = useSelector((state) => state.auth.role);
    const accessToken = useSelector((state) => state.auth.accessToken);
    const refreshToken = useSelector((state) => state.auth.refreshToken);
    console.log(user, role, isAuthenticated)
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
        }
        if (role !== 'user') {
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



    return (
        <>
            <Sidebar />
            <div className="relative md:ml-64 bg-gray-100">
                <AdminNavbar />
                {/* Header */}
                <div className="px-4 md:px-10 mx-auto w-full p-12 responsive-padding" style={{ paddingTop: "75px" }}>
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
