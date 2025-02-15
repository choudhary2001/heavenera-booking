import React, { useState, useEffect } from "react";
import apiClient from '../../actions/axiosInterceptor';
import { useSelector } from 'react-redux';
import User from "layouts/User.js";
import baseURL from "../../url";
import Link from 'next/link';

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);

  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [roomRecommendations, setRoomRecommendations] = useState([]);

  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Simulating fetching user data on the client
    if (user?.first_name) {
      setUserName(user.first_name);
    }
  }, [user]);


  // Fetch user dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch upcoming bookings
        const upcomingResponse = await apiClient.get("/api/user/upcoming-bookings/");
        setUpcomingBookings(upcomingResponse.data);

        // Fetch booking history
        const historyResponse = await apiClient.get("/api/user/booking-history/");
        setBookingHistory(historyResponse.data);

        // Fetch payment details
        const paymentResponse = await apiClient.get("/api/user/payment-details/");
        setPaymentDetails(paymentResponse.data);

        // Fetch room recommendations
        const recommendationsResponse = await apiClient.get("/api/user/room-recommendations/");
        setRoomRecommendations(recommendationsResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome Back, {userName}!</h1>
        <p className="text-white mt-2">Here's what's happening with your bookings.</p>
      </div>

      {/* Upcoming Bookings and Payment Details */}
      <div className="flex flex-wrap gap-6 mb-8">
        {/* Upcoming Bookings */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 text-gray-700">Room</th>
                  <th className="py-3 text-gray-700">Check-In</th>
                  <th className="py-3 text-gray-700">Check-Out</th>
                  <th className="py-3 text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 text-gray-700">{booking.room.room_name}</td>
                    <td className="py-3 text-gray-700">{booking.check_in_date}</td>
                    <td className="py-3 text-gray-700">{booking.check_out_date}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${booking.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Details */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Payment Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 text-gray-700">Booking ID</th>
                  <th className="py-3 text-gray-700">Amount</th>
                  <th className="py-3 text-gray-700">Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentDetails.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 text-gray-700">{payment.id}</td>
                    <td className="py-3 text-gray-700">₹{payment.total_amount}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${payment.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {payment.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Booking History and Room Recommendations */}
      <div className="flex flex-wrap gap-6">
        {/* Booking History */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Booking History</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 text-gray-700">Room</th>
                  <th className="py-3 text-gray-700">Check-In</th>
                  <th className="py-3 text-gray-700">Check-Out</th>
                  <th className="py-3 text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookingHistory.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 text-gray-700">{booking.room.room_name}</td>
                    <td className="py-3 text-gray-700">{booking.check_in_date}</td>
                    <td className="py-3 text-gray-700">{booking.check_out_date}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${booking.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Room Recommendations */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Room Recommendations</h3>
          <div className="space-y-4">
            {roomRecommendations.map((room) => (
              <div
                key={room.id}
                className="flex items-center p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <img
                  src={`${baseURL}${room.main_image}`}
                  alt={room.room_name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="ml-4">
                  <p className="font-semibold text-gray-800">{room.room_name}</p>
                  <p className="text-sm text-gray-600">₹{room.price_per_night}/night</p>
                  <Link key={room.id} href={`/room/${room.id}`} className="block">
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Book Now
                    </button>
                  </Link>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.layout = User;