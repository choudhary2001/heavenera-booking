import React from "react";
import Navbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footers/Footer.js";

export default function FAQ() {
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
                                Frequently Asked Questions
                            </h1>
                            <p className="mt-4 text-lg text-gray-300">
                                Find answers to common questions about Heavenera.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Content */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-8/12 px-4">
                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">General Questions</h2>
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">What is Heavenera?</h3>
                                <p className="text-lg leading-relaxed text-gray-600">
                                    Heavenera is a platform that helps you find and book rooms near you. Whether you're traveling for work, leisure, or relocation, we make it easy to discover the perfect space.
                                </p>
                            </div>
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">How do I create an account?</h3>
                                <p className="text-lg leading-relaxed text-gray-600">
                                    You can create an account by clicking the "Sign Up" button on the homepage. Follow the prompts to enter your details and verify your email.
                                </p>
                            </div>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Booking Questions</h2>
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">How do I book a room?</h3>
                                <p className="text-lg leading-relaxed text-gray-600">
                                    Search for rooms using the search bar, select your preferred room, and follow the prompts to complete your booking.
                                </p>
                            </div>
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Can I modify or cancel my booking?</h3>
                                <p className="text-lg leading-relaxed text-gray-600">
                                    Yes, you can modify or cancel your booking through your account dashboard. Please refer to our <a href="/cancellation-policy" className="text-blue-500 hover:underline">Cancellation Policy</a> for more details.
                                </p>
                            </div>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Payment Questions</h2>
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">What payment methods are accepted?</h3>
                                <p className="text-lg leading-relaxed text-gray-600">
                                    We accept credit/debit cards, PayPal, and other popular payment methods.
                                </p>
                            </div>
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">How do I request a refund?</h3>
                                <p className="text-lg leading-relaxed text-gray-600">
                                    You can request a refund through your account dashboard. Please refer to our <a href="/refund-policy" className="text-blue-500 hover:underline">Refund Policy</a> for eligibility and processing details.
                                </p>
                            </div>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Account Questions</h2>
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">How do I reset my password?</h3>
                                <p className="text-lg leading-relaxed text-gray-600">
                                    Click the "Forgot Password" link on the login page and follow the instructions to reset your password.
                                </p>
                            </div>
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Can I delete my account?</h3>
                                <p className="text-lg leading-relaxed text-gray-600">
                                    Yes, you can delete your account from the "Account Settings" page. Please note that this action is irreversible.
                                </p>
                            </div>

                            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Contact Us</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-8">
                                If you have additional questions, please contact us at:
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