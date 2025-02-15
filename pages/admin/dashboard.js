import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
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
  ArcElement,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import Admin from "layouts/Admin.js";
import apiClient from '../../actions/axiosInterceptor';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [roomStats, setRoomStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    bookedRooms: 0,
    revenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [roomOwners, setRoomOwners] = useState([]);
  const [wallet, setWallet] = useState({ balance: 0, total_earning: 0 });

  useEffect(() => {
    fetchRoomStats();
    fetchRecentBookings();
    fetchRoomOwners();
  }, []);

  const fetchRoomStats = async () => {
    const response = await apiClient.get("/api/admin/rooms/");
    const rooms = response.data.results;
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((room) => room.status === "Available").length;
    const bookedRooms = totalRooms - availableRooms;
    const revenue = rooms.reduce((sum, room) => sum + parseFloat(room.price_per_night), 0);
    setRoomStats({ totalRooms, availableRooms, bookedRooms, revenue });
  };

  const fetchRecentBookings = async () => {
    const response = await apiClient.get("/api/admin/bookings/");
    setRecentBookings(response?.data?.results.slice(0, 5));
  };

  const fetchRoomOwners = async () => {
    const response = await apiClient.get("/api/admin/room-owners/");
    setRoomOwners(response?.data?.results.slice(0, 5));
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await apiClient.get("/api/admin/wallets/");
      setWallet(response.data);
    } catch (error) {
      console.error("Error fetching wallet data:", error);

    }
  };

  // Data for the pie chart
  const pieChartData = {
    labels: ["Available", "Booked"],
    datasets: [
      {
        data: [roomStats.availableRooms, roomStats.bookedRooms],
        backgroundColor: ["#10B981", "#EF4444"],
        borderColor: ["#10B981", "#EF4444"],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Room Status",
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Rooms</h2>
          <p className="text-3xl font-bold text-blue-600">{roomStats.totalRooms}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Available Rooms</h2>
          <p className="text-3xl font-bold text-green-600">{roomStats.availableRooms}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Booked Rooms</h2>
          <p className="text-3xl font-bold text-red-600">{roomStats.bookedRooms}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Earning of HeavenEra</h2>
          <p className="text-3xl font-bold text-purple-600"> ₹{wallet.balance || 0}</p>
        </div>
      </div>

      {/* Recent Bookings and Room Owners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-700">{booking.room.room_name}</h3>
                <p className="text-sm text-gray-500">{booking.user_name}</p>
                <p className="text-sm text-gray-500">
                  {booking.check_in_date} - {booking.check_out_date}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Room Owners */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Room Owners</h2>
          <div className="space-y-4">
            {roomOwners.map((owner) => (
              <div key={owner.id} className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-700">
                  {owner.first_name} {owner.last_name}
                </h3>
                <p className="text-sm text-gray-500">{owner.email}</p>
                <p className="text-sm text-gray-500">Phone: {owner.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Statistics Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Room Statistics</h2>
        <div className="w-full md:w-1/2 mx-auto">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    </div>
  );
}

Dashboard.layout = Admin;
