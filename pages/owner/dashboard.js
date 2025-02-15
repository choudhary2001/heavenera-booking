import React, { useState, useEffect } from "react";
import Owner from "layouts/Owner.js";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import apiClient from '../../actions/axiosInterceptor';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [overview, setOverview] = useState({
    total_bookings: 0,
    total_revenue: 0,
    occupancy_rate: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [bookingTrends, setBookingTrends] = useState({ labels: [], data: [] });
  const [revenueTrends, setRevenueTrends] = useState({ labels: [], data: [] });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch overview data
        const overviewResponse = await apiClient.get("/api/owner/dashboard/overview/");
        setOverview(overviewResponse.data);

        // Fetch recent bookings
        const recentBookingsResponse = await apiClient.get("/api/owner/dashboard/recent-bookings/");
        setRecentBookings(recentBookingsResponse.data);

        // Fetch booking trends
        const bookingTrendsResponse = await apiClient.get("/api/owner/dashboard/booking-trends/");
        setBookingTrends(bookingTrendsResponse.data);

        // Fetch revenue trends
        const revenueTrendsResponse = await apiClient.get("/api/owner/dashboard/revenue-trends/");
        setRevenueTrends(revenueTrendsResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Booking data for the chart
  const bookingData = {
    labels: bookingTrends.labels,
    datasets: [
      {
        label: "Bookings",
        data: bookingTrends.data,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
    ],
  };

  // Revenue data for the chart
  const revenueData = {
    labels: revenueTrends.labels,
    datasets: [
      {
        label: "Revenue",
        data: revenueTrends.data,
        borderColor: "rgba(59, 130, 246, 1)",
        fill: false,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
          <p className="text-2xl font-bold text-blue-600">{overview.total_bookings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
          <p className="text-2xl font-bold text-blue-600">₹{overview.total_revenue}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Occupancy Rate</h3>
          <p className="text-2xl font-bold text-blue-600">{overview.occupancy_rate}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Bookings Overview</h3>
          <Bar data={bookingData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Revenue Overview</h3>
          <Line data={revenueData} />
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Bookings</h3>
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Room</th>
              <th className="py-2">Guest</th>
              <th className="py-2">Check-In</th>
              <th className="py-2">Check-Out</th>
              <th className="py-2">Total Amount</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((booking) => (
              <tr key={booking.id} className="border-b">
                <td className="py-2">{booking.room.room_name}</td>
                <td className="py-2">{booking.user_name}</td>
                <td className="py-2">{booking.check_in_date}</td>
                <td className="py-2">{booking.check_out_date}</td>
                <td className="py-2">₹{booking.total_amount}</td>
                <td className="py-2">{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Dashboard.layout = Owner;