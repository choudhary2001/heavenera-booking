import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="relative bg-red-500 pt-8 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap text-center lg:text-left">
            <div className="w-full lg:w-6/12 px-4">
              <h4 className="text-3xl font-semibold text-white">Let's keep in touch!</h4>
              <h5 className="text-lg mt-0 mb-2 text-white">
                Reach out to us for bookings, inquiries, or support. We respond within 1-2 business days.
              </h5>
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
            <div className="w-full lg:w-6/12 px-4">
              <div className="flex flex-wrap items-top mb-6">
                <div className="w-full lg:w-4/12 px-4 ml-auto">
                  <span className="block uppercase text-white text-sm font-semibold mb-2">
                    Quick Links
                  </span>
                  <ul className="list-unstyled">
                    <li>
                      <a
                        className="text-white hover:text-blueGray-800 font-semibold block pb-2 text-sm"
                        href="/about-us"
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-white hover:text-blueGray-800 font-semibold block pb-2 text-sm"
                        href="/room"
                      >
                        Browse Rooms
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-white hover:text-blueGray-800 font-semibold block pb-2 text-sm"
                        href="/contact-us"
                      >
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-white hover:text-blueGray-800 font-semibold block pb-2 text-sm"
                        href="/faq"
                      >
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <span className="block uppercase text-white text-sm font-semibold mb-2">
                    Legal
                  </span>
                  <ul className="list-unstyled">
                    <li>
                      <a
                        className="text-white hover:text-blueGray-800 font-semibold block pb-2 text-sm"
                        href="/privacy-policy"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-white hover:text-blueGray-800 font-semibold block pb-2 text-sm"
                        href="/terms-and-conditions"
                      >
                        Terms & Conditions
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-white hover:text-blueGray-800 font-semibold block pb-2 text-sm"
                        href="/cancellation-policy"
                      >
                        Cancellation Policy
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-white hover:text-blueGray-800 font-semibold block pb-2 text-sm"
                        href="/refund-policy"
                      >
                        Refund Policy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-6 border-white" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4 mx-auto text-center">
              <div className="text-sm text-white font-semibold py-1">
                Copyright © {new Date().getFullYear()} HEVENERA by{" "}
                <a
                  href="https://swastik.ai"
                  className="text-black hover:text-black"
                >
                  Shwastik Tech Solutions Pvt. Ltd
                </a>
                . All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}