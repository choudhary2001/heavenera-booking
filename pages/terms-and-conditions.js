import React from "react";
import Navbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footers/Footer.js";

export default function TermsAndConditions() {
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
                                Terms and Conditions
                            </h1>
                            <p className="mt-4 text-lg text-gray-300">
                                Please read these terms carefully before using our platform.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Terms and Conditions Content */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-8/12 px-4">
                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Introduction</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                Welcome to Heavenera! By accessing or using our platform, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please do not use our services.
                            </p>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">User Responsibilities</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                As a user of Heavenera, you agree to:
                            </p>
                            <ul className="list-disc list-inside text-lg leading-relaxed text-gray-600 mb-8">
                                <li>Provide accurate and complete information.</li>
                                <li>Use the platform only for lawful purposes.</li>
                                <li>Respect the rights of other users.</li>
                            </ul>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Prohibited Activities</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                You are prohibited from:
                            </p>
                            <ul className="list-disc list-inside text-lg leading-relaxed text-gray-600 mb-8">
                                <li>Engaging in fraudulent activities.</li>
                                <li>Uploading malicious software or content.</li>
                                <li>Violating any applicable laws or regulations.</li>
                            </ul>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Intellectual Property</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                All content on Heavenera, including text, graphics, logos, and software, is the property of Heavenera or its licensors and is protected by intellectual property laws.
                            </p>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Limitation of Liability</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                Heavenera is not liable for any indirect, incidental, or consequential damages arising from your use of the platform. We do not guarantee the accuracy or completeness of any content.
                            </p>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Termination</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                We reserve the right to terminate or suspend your account at any time for violations of these terms or for any other reason.
                            </p>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Governing Law</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                These Terms and Conditions are governed by the laws of [Your Country/State]. Any disputes will be resolved in the courts of [Your Jurisdiction].
                            </p>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Contact Us</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                If you have any questions about these Terms and Conditions, please contact us at:
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