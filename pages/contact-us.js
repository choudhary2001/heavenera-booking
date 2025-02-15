import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footers/Footer.js";
import Map from "components/Map/Map.js";
import axios from "axios";
import baseURL from "./../url";
export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${baseURL}/api/contacts/`, formData);
            if (response.status === 201) {
                setSuccess(true);
                setFormData({ name: "", email: "", message: "" }); // Reset form
            }
        } catch (error) {
            console.error("Error submitting form", error);
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };
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
                                Contact Us
                            </h1>
                            <p className="mt-4 text-lg text-gray-300">
                                We're here to help! Reach out to us for any questions or concerns.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Form and Information Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap">
                        {/* Contact Form */}
                        <div className="w-full lg:w-6/12 px-4 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="Your Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            rows="5"
                                            name="message"
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="Your Message"
                                            value={formData.message}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}

                                        className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        {loading ? "Sending..." : "Send Message"}
                                    </button>
                                </form>
                                {success && <p className="text-green-500 mt-3">Message sent successfully!</p>}

                            </div>
                        </div>

                        {/* Contact Information and Map */}
                        <div className="w-full lg:w-6/12 px-4">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                            <i className="fas fa-map-marker-alt text-red-600"></i>
                                        </div>
                                        <p className="ml-4 text-gray-700">
                                            123 Heavenera Street, City, Country
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                            <i className="fas fa-phone text-red-600"></i>
                                        </div>
                                        <p className="ml-4 text-gray-700">
                                            +1 (123) 456-7890
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                            <i className="fas fa-envelope text-red-600"></i>
                                        </div>
                                        <p className="ml-4 text-gray-700">
                                            support@heavenera.com
                                        </p>
                                    </div>
                                </div>

                                {/* Social Media Links */}
                                <div className="mt-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Follow Us</h3>
                                    <div className="mt-6 lg:mb-0 mb-6 flex justify-center lg:justify-start">
                                        <a href="https://twitter.com/heavenerarental" target="_blank" rel="noopener noreferrer">
                                            <button
                                                className="bg-white text-lightBlue-400 shadow-lg font-normal h-10 w-10 flex items-center justify-center rounded-full outline-none focus:outline-none mr-2"
                                                type="button"
                                            >
                                                <i className="fab fa-twitter"></i>
                                            </button>
                                        </a>

                                        <a href="https://facebook.com/heavenerarental" target="_blank" rel="noopener noreferrer">
                                            <button
                                                className="bg-white text-lightBlue-600 shadow-lg font-normal h-10 w-10 flex items-center justify-center rounded-full outline-none focus:outline-none mr-2"
                                                type="button"
                                            >
                                                <i className="fab fa-facebook-square"></i>
                                            </button>
                                        </a>

                                        <a href="https://instagram.com/heavenerarental" target="_blank" rel="noopener noreferrer">
                                            <button
                                                className="bg-white text-pink-400 shadow-lg font-normal h-10 w-10 flex items-center justify-center rounded-full outline-none focus:outline-none mr-2"
                                                type="button"
                                            >
                                                <i className="fab fa-instagram"></i>
                                            </button>
                                        </a>

                                        <a href="https://linkedin.com/in/heavenerarental" target="_blank" rel="noopener noreferrer">
                                            <button
                                                className="bg-white text-blueGray-800 shadow-lg font-normal h-10 w-10 flex items-center justify-center rounded-full outline-none focus:outline-none mr-2"
                                                type="button"
                                            >
                                                <i className="fab fa-linkedin"></i>
                                            </button>
                                        </a>
                                    </div>
                                </div>

                                {/* Map Integration */}
                                <div className="mt-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Location</h3>
                                    <div className="rounded-lg overflow-hidden">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8354345093747!2d144.95373531531615!3d-37.816279742021665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d2a7c5b4a6a1!2s123%20Heavenera%20Street%2C%20City%2C%20Country!5e0!3m2!1sen!2sus!4v1622549400000!5m2!1sen!2sus"
                                            width="100%"
                                            height="300"
                                            style={{ border: 0 }}
                                            allowFullScreen=""
                                            loading="lazy"
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}