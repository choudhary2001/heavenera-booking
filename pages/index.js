import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footers/Footer.js";
import Map from "components/Map/Map.js";
import axios from "axios";
import baseURL from "./../url";
import Image from "next/image";

export default function Index() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const logos = [
    { src: "/img/startupindia.png", alt: "Startup India" },
    { src: "/img/msme.png", alt: "MSME" },
    { src: "/img/startupbihar.jpg", alt: "Startup Bihar" },
    { src: "/img/biharconnect.webp", alt: "Bihar Connect" },
    { src: "/img/logo.jpeg", alt: "Company 5" },
  ];


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
      <main>
        <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-75 bg-black"
            ></span>
          </div>

          {/* Adjust Map Component */}
          <div className="relative w-full h-full m-2 z-10">
            <Map />
          </div>
        </div>

        <section className="pb-20 bg-blueGray-200 -mt-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
              <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                      <i className="fas fa-award"></i>
                    </div>
                    <h6 className="text-xl font-semibold">Wide Range of Rooms</h6>
                    <p className="mt-2 mb-4 text-blueGray-500">
                      Discover a variety of rooms, from cozy apartments to luxurious villas, tailored to your needs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-lightBlue-400">
                      <i className="fas fa-retweet"></i>
                    </div>
                    <h6 className="text-xl font-semibold">Hassle-Free Booking</h6>
                    <p className="mt-2 mb-4 text-blueGray-500">
                      Book your perfect stay in just a few clicks with our intuitive and user-friendly platform.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-emerald-400">
                      <i className="fas fa-fingerprint"></i>
                    </div>
                    <h6 className="text-xl font-semibold">Secure Payments</h6>
                    <p className="mt-2 mb-4 text-blueGray-500">
                      Enjoy peace of mind with our secure payment gateway and encrypted transactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center mt-32">
              <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
                <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
                  <i className="fas fa-user-friends text-xl"></i>
                </div>
                <h3 className="text-3xl mb-2 font-semibold leading-normal">
                  Why Choose HEVENERA?
                </h3>
                <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600">
                  HEVENERA is your trusted partner for finding the perfect stay, whether for business trips, family vacations, or solo adventures.
                </p>
                <p className="text-lg font-light leading-relaxed mt-0 mb-4 text-blueGray-600">
                  We prioritize your comfort and satisfaction, offering a seamless booking experience and exceptional customer support.
                </p>
                <Link href="/">
                  <p className="font-bold text-blueGray-700 mt-8">
                    Start Your Journey with HEVENERA!
                  </p>
                </Link>
              </div>

              <div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-blueGray-700">
                  <img
                    alt="..."
                    src="https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="w-full align-middle rounded-t-lg"
                  />
                  <blockquote className="relative p-8 mb-4">
                    <h4 className="text-xl font-bold text-black">
                      Unmatched Hospitality
                    </h4>
                    <p className="text-md font-light mt-2 text-black">
                      At HEVENERA, we ensure every stay is memorable with our top-notch services and attention to detail.
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-red-500 text-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Recognized By</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-center">
              {logos.map((logo, index) => (
                <div key={index} className="flex justify-center">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={120}
                    height={60}
                  // className="grayscale hover:grayscale-0 transition"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>


        <section className="relative py-20">
          <div className="container mx-auto px-4">
            <div className="items-center flex flex-wrap">
              <div className="w-full md:w-4/12 ml-auto mr-auto px-4">
                <img
                  alt="..."
                  className="max-w-full rounded-lg shadow-lg"
                  src="https://images.unsplash.com/photo-1596029927281-8ee4fa73a556?q=80&w=2688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
              </div>
              <div className="w-full md:w-5/12 ml-auto mr-auto px-4">
                <div className="md:pr-12">
                  <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-blueGray-200">
                    <i className="fas fa-rocket text-xl"></i>
                  </div>
                  <h3 className="text-3xl font-semibold">Your Journey Starts Here</h3>
                  <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                    HEVENERA is more than just a booking platform; it's your gateway to unforgettable experiences. Whether you're traveling for work or leisure, we’ve got you covered.
                  </p>
                  <ul className="list-none mt-6">
                    <li className="py-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-blueGray-100 mr-3">
                            <i className="fas fa-fingerprint"></i>
                          </span>
                        </div>
                        <div>
                          <h4 className="text-blueGray-500">
                            Personalized Recommendations
                          </h4>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-blueGray-100 mr-3">
                            <i className="fas fa-check"></i>
                          </span>
                        </div>
                        <div>
                          <h4 className="text-blueGray-500">
                            Verified Listings
                          </h4>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="flex items-center">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-blueGray-100 mr-3">
                            <i className="fas fa-headset"></i>
                          </span>
                        </div>
                        <div>
                          <h4 className="text-blueGray-500">
                            24/7 Customer Support
                          </h4>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50 mb-8">
          <div className="container mx-auto px-4">

            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Join thousands of satisfied customers who trust our services</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">JS</div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">John Smith</h3>
                    <p className="text-gray-600 text-sm">Patna</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
                <p className="text-gray-600 ">"Absolutely amazing experience! The service was top-notch and the team was incredibly professional. Will definitely recommend to friends!"</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">EM</div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Emma Miller</h3>
                    <p className="text-gray-600 text-sm">Darbhanga</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  <div className="flex text-yellow-400">
                    ★★★★☆
                  </div>
                </div>
                <p className="text-gray-600 ">"Great value for money. The product exceeded my expectations and customer support was very helpful throughout the process."</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">AD</div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Alex Davis</h3>
                    <p className="text-gray-600 text-sm">Motihari</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
                <p className="text-gray-600 ">"Outstanding quality and fast delivery. I've been using their services for years and they never disappoint!"</p>
              </div>
            </div>

          </div>
        </section>

        <section className="pb-20 relative block bg-blueGray-800">
          <div className="container mx-auto px-4 pt-24 pb-24 lg:pb-64">
            <div className="flex flex-wrap text-center justify-center">
              <div className="w-full lg:w-6/12 px-4">
                <h2 className="text-4xl font-semibold text-white">
                  Explore the World with HEVENERA
                </h2>
                <p className="text-lg leading-relaxed mt-4 mb-4 text-blueGray-400">
                  From bustling cities to serene countryside retreats, HEVENERA connects you to the best accommodations worldwide.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap mt-12 justify-center">
              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <i className="fas fa-medal text-xl"></i>
                </div>
                <h6 className="text-xl mt-5 font-semibold text-white">
                  Trusted by Thousands
                </h6>
                <p className="mt-2 mb-4 text-blueGray-400">
                  Join our growing community of satisfied travelers who trust HEVENERA for their stays.
                </p>
              </div>
              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <i className="fas fa-globe text-xl"></i>
                </div>
                <h5 className="text-xl mt-5 font-semibold text-white">
                  Global Reach
                </h5>
                <p className="mt-2 mb-4 text-blueGray-400">
                  Discover accommodations in over 100 countries, curated for your comfort and convenience.
                </p>
              </div>
              <div className="w-full lg:w-3/12 px-4 text-center">
                <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                  <i className="fas fa-lightbulb text-xl"></i>
                </div>
                <h5 className="text-xl mt-5 font-semibold text-white">
                  Innovative Solutions
                </h5>
                <p className="mt-2 mb-4 text-blueGray-400">
                  We leverage cutting-edge technology to make your booking experience seamless and enjoyable.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative block py-24 lg:pt-0 bg-blueGray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center lg:-mt-64 -mt-48">
              <div className="w-full lg:w-6/12 px-4">
                <form onSubmit={handleSubmit}>

                  <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200">
                    <div className="flex-auto p-5 lg:p-10">
                      <h4 className="text-2xl font-semibold">
                        Have Questions or Need Assistance?
                      </h4>
                      <p className="leading-relaxed mt-1 mb-4 text-blueGray-500">
                        Our team is here to help! Reach out to us, and we’ll get back to you within 24 hours.
                      </p>
                      <div className="relative w-full mb-3 mt-8">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="full-name"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="message"
                        >
                          Message
                        </label>
                        <textarea
                          name="message"
                          rows="4"
                          cols="80"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                          placeholder="Type a message..."
                          value={formData.message}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="text-center mt-6">
                        <button
                          className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Sending..." : "Send Message"}
                        </button>
                      </div>
                      {success && <p className="text-green-500 mt-3">Message sent successfully!</p>}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
