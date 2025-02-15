import React from "react";
import Navbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footers/Footer.js";

export default function RefundPolicy() {
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
                                Refund Policy
                            </h1>
                            <p className="mt-4 text-lg text-gray-300">
                                Learn about our refund eligibility and process.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Refund Policy Content */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-8/12 px-4">
                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Introduction</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                At Heavenera, we strive to provide a seamless booking experience. This Refund Policy outlines the terms and conditions for requesting and processing refunds.
                            </p>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Refund Eligibility</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                Refunds are issued under the following conditions:
                            </p>
                            <ul className="list-disc list-inside text-lg leading-relaxed text-gray-600 mb-8">
                                <li>If canceled 48 hours before check-in, a full refund will be issued.</li>
                                <li>If canceled within 24-48 hours before check-in, a 50% refund will be issued.</li>
                                <li>No refund will be issued for cancellations made less than 24 hours before check-in.</li>
                            </ul>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Refund Process</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                To request a refund, follow these steps:
                            </p>
                            <ol className="list-decimal list-inside text-lg leading-relaxed text-gray-600 mb-8">
                                <li>Log in to your Heavenera account.</li>
                                <li>Navigate to the "Bookings" section.</li>
                                <li>Select the booking you wish to cancel and click "Request Refund."</li>
                                <li>Our team will review your request and process the refund if eligible.</li>
                            </ol>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                Refunds are typically processed within 7-10 business days and credited to the original payment method.
                            </p>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Non-Refundable Situations</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                Refunds will not be issued in the following scenarios:
                            </p>
                            <ul className="list-disc list-inside text-lg leading-relaxed text-gray-600 mb-8">
                                <li>No-shows or late cancellations (less than 24 hours before check-in).</li>
                                <li>Bookings marked as non-refundable at the time of purchase.</li>
                                <li>Violation of our terms and conditions by the user.</li>
                            </ul>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Contact Us</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                If you have any questions about our Refund Policy, please contact us at:
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