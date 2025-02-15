import React from "react";
import Navbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footers/Footer.js";
import Link from 'next/link';

export default function AboutUs() {
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
                                Welcome to <span className="text-blue-500">Heavenera</span>
                            </h1>
                            <p className="mt-4 text-lg text-gray-300">
                                Your ultimate platform to find rooms near you. Whether you're traveling for work, leisure, or relocation, Heavenera makes it easy to discover the perfect space.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center text-center mb-24">
                        <div className="w-full lg:w-6/12 px-4">
                            <h2 className="text-4xl font-semibold text-gray-800">Our Mission</h2>
                            <p className="text-lg leading-relaxed mt-4 text-gray-600">
                                At Heavenera, our mission is to simplify the process of finding rooms and accommodations. We aim to connect users with the best options tailored to their needs, ensuring a seamless and stress-free experience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center text-center mb-24">
                        <div className="w-full lg:w-6/12 px-4">
                            <h2 className="text-4xl font-semibold text-gray-800">Why Choose Heavenera?</h2>
                            <p className="text-lg leading-relaxed mt-4 text-gray-600">
                                Discover the features that make Heavenera the best choice for finding rooms.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-4/12 px-4 text-center">
                            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                <div className="px-4 py-5 flex-auto">
                                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-500">
                                        <i className="fas fa-search"></i>
                                    </div>
                                    <h6 className="text-xl font-semibold">Easy Search</h6>
                                    <p className="mt-2 mb-4 text-gray-600">
                                        Find rooms near you with our intuitive search and filtering options.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-4/12 px-4 text-center">
                            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                <div className="px-4 py-5 flex-auto">
                                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-500">
                                        <i className="fas fa-check"></i>
                                    </div>
                                    <h6 className="text-xl font-semibold">Verified Listings</h6>
                                    <p className="mt-2 mb-4 text-gray-600">
                                        All rooms are verified to ensure quality and reliability.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-4/12 px-4 text-center">
                            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                <div className="px-4 py-5 flex-auto">
                                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-500">
                                        <i className="fas fa-headset"></i>
                                    </div>
                                    <h6 className="text-xl font-semibold">24/7 Support</h6>
                                    <p className="mt-2 mb-4 text-gray-600">
                                        Our support team is always available to assist you.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            {/* <section className="py-20 bg-white d-none">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center text-center mb-24">
                        <div className="w-full lg:w-6/12 px-4">
                            <h2 className="text-4xl font-semibold text-gray-800">Meet Our Team</h2>
                            <p className="text-lg leading-relaxed mt-4 text-gray-600">
                                The passionate team behind Heavenera.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-4/12 px-4 mb-8">
                            <div className="px-6">
                                <img
                                    alt="Team Member"
                                    src="https://via.placeholder.com/150"
                                    className="shadow-lg rounded-full mx-auto max-w-120-px"
                                />
                                <div className="pt-6 text-center">
                                    <h5 className="text-xl font-bold">John Doe</h5>
                                    <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                                        CEO & Founder
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-4/12 px-4 mb-8">
                            <div className="px-6">
                                <img
                                    alt="Team Member"
                                    src="https://via.placeholder.com/150"
                                    className="shadow-lg rounded-full mx-auto max-w-120-px"
                                />
                                <div className="pt-6 text-center">
                                    <h5 className="text-xl font-bold">Jane Smith</h5>
                                    <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                                        CTO
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-4/12 px-4 mb-8">
                            <div className="px-6">
                                <img
                                    alt="Team Member"
                                    src="https://via.placeholder.com/150"
                                    className="shadow-lg rounded-full mx-auto max-w-120-px"
                                />
                                <div className="pt-6 text-center">
                                    <h5 className="text-xl font-bold">Mike Johnson</h5>
                                    <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                                        Head of Operations
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Testimonials Section */}
            {/* <section className="py-20 bg-gray-100 d-none">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center text-center mb-24">
                        <div className="w-full lg:w-6/12 px-4">
                            <h2 className="text-4xl font-semibold text-gray-800">What Our Users Say</h2>
                            <p className="text-lg leading-relaxed mt-4 text-gray-600">
                                Hear from our satisfied users.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-4/12 px-4 mb-8">
                            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                <div className="px-4 py-5 flex-auto">
                                    <p className="text-lg leading-relaxed text-gray-800">
                                        "Heavenera made finding a room so easy! I found the perfect place within minutes."
                                    </p>
                                    <p className="mt-4 font-semibold text-gray-800">- Sarah Lee</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-4/12 px-4 mb-8">
                            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                <div className="px-4 py-5 flex-auto">
                                    <p className="text-lg leading-relaxed text-gray-800">
                                        "The verified listings gave me peace of mind. Highly recommend Heavenera!"
                                    </p>
                                    <p className="mt-4 font-semibold text-gray-800">- Michael Brown</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-4/12 px-4 mb-8">
                            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                                <div className="px-4 py-5 flex-auto">
                                    <p className="text-lg leading-relaxed text-gray-800">
                                        "Great platform with excellent customer support. 10/10!"
                                    </p>
                                    <p className="mt-4 font-semibold text-gray-800">- Emily Davis</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Call-to-Action Section */}
            <section className="py-20 bg-blue-600">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center text-center">
                        <div className="w-full lg:w-6/12 px-4">
                            <h2 className="text-4xl font-semibold text-white">Ready to Find Your Perfect Room?</h2>
                            <p className="text-lg leading-relaxed mt-4 text-gray-200">
                                Join Heavenera today and discover the best rooms near you.
                            </p>
                            <Link href={`/room`}>

                                <button className="mt-8 px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}