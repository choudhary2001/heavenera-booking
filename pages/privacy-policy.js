import React from "react";
import Navbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footers/Footer.js";

export default function PrivacyPolicy() {
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
                                Privacy Policy
                            </h1>
                            <p className="mt-4 text-lg text-gray-300">
                                Your privacy is important to us. Learn how we collect, use, and protect your information.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Policy Content */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-8/12 px-4">
                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Introduction</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                At Heavenera, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
                            </p>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Information We Collect</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                We may collect the following types of information:
                            </p>
                            <ul className="list-disc list-inside text-lg leading-relaxed text-gray-600 mb-8">
                                <li>Personal Information: Name, email address, phone number, etc.</li>
                                <li>Payment Information: Credit card details, billing address, etc.</li>
                                <li>Usage Data: IP address, browser type, pages visited, etc.</li>
                            </ul>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">How We Use Your Information</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                We use your information for the following purposes:
                            </p>
                            <ul className="list-disc list-inside text-lg leading-relaxed text-gray-600 mb-8">
                                <li>To provide and improve our services.</li>
                                <li>To process transactions and send confirmations.</li>
                                <li>To communicate with you about your account and updates.</li>
                                <li>To analyze usage and improve our platform.</li>
                            </ul>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Data Protection</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                We implement a variety of security measures to protect your information, including encryption, secure servers, and access controls.
                            </p>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Cookies</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                We use cookies to enhance your experience on our platform. Cookies are small files stored on your device that help us understand how you use our site.
                            </p>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Your Rights</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                You have the right to:
                            </p>
                            <ul className="list-disc list-inside text-lg leading-relaxed text-gray-600 mb-8">
                                <li>Access and update your personal information.</li>
                                <li>Request deletion of your data.</li>
                                <li>Opt-out of marketing communications.</li>
                            </ul>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Contact Us</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                If you have any questions about this Privacy Policy, please contact us at:
                            </p>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                <strong>Email:</strong> privacy@heavenera.com<br />
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