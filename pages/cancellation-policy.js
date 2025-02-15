import React from "react";
import Navbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footers/Footer.js";

export default function CancellationPolicy() {
    return (
        <>
            <Navbar transparent />

            {/* Hero Section */}
            <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75">
                <div className="absolute top-0 w-full h-full bg-center bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}>
                    <span className="w-full h-full absolute bg-black opacity-75"></span>
                </div>
                <div className="container relative mx-auto">
                    <div className="items-center flex flex-wrap">
                        <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                            <h1 className="text-white font-semibold text-5xl">
                                Cancellation Policy
                            </h1>
                            <p className="mt-4 text-lg text-gray-300">
                                Learn about our cancellation and refund policies.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancellation Policy Content */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-8/12 px-4">
                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Introduction</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                At Heavenera, we understand that plans can change. This Cancellation Policy outlines the terms and conditions for canceling bookings and requesting refunds.
                            </p>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Cancellation by Users</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                Users can cancel bookings through their account dashboard or by contacting our support team. Cancellation requests must be made within the specified time frame to be eligible for a refund.
                            </p>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Refund Policy</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                Refunds are processed based on the following conditions:
                            </p>
                            <ul className="list-disc list-inside text-lg leading-relaxed text-gray-600 mb-8">
                                <li>If canceled 48 hours before check-in, a full refund will be issued.</li>
                                <li>If canceled within 24-48 hours before check-in, a 50% refund will be issued.</li>
                                <li>No refund will be issued for cancellations made less than 24 hours before check-in.</li>
                            </ul>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Cancellation by Heavenera</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                Heavenera reserves the right to cancel bookings in the following situations:
                            </p>
                            <ul className="list-disc list-inside text-lg leading-relaxed text-gray-600 mb-8">
                                <li>Unforeseen circumstances (e.g., natural disasters, property issues).</li>
                                <li>Violation of our terms and conditions by the user.</li>
                            </ul>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                In such cases, users will receive a full refund.
                            </p>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Contact Us</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                If you have any questions about our Cancellation Policy, please contact us at:
                            </p>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                <strong>Email:</strong> support@heavenera.com<br />
                                <strong>Phone:</strong> +1 (123) 456-7890<br />
                                <strong>Address:</strong> 123 Heavenera Street, City, Country
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}