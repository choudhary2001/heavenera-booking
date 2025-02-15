import React, { useState, useEffect } from "react";
import Navbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footers/Footer.js";
import { MapPin, Star } from "lucide-react";
import { useRouter } from "next/router";
import apiClient from "../../actions/axiosInterceptor";
import ImageSlider from "../../components/Rooms/image-slider";
import { Reviews } from "../../components/Rooms/reviews";
import { RelatedRooms } from "../../components/Rooms/related-rooms";
import { AddReviewForm } from "../../components/Rooms/add-review-form";
import { useSelector } from 'react-redux';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CheckCircle, XCircle } from "lucide-react";
import Swal from 'sweetalert2';
import { FiUser, FiPhone } from "react-icons/fi"; // Import icons from react-icons

export default function RoomDetails() {
    const user = useSelector((state) => state.auth.user);

    const [isLoading, setIsLoading] = useState(true);
    const [room, setRoom] = useState(null);
    const [bookedDates, setBookedDates] = useState([]);
    const [error, setError] = useState(null);
    const lat = useSelector((state) => state.auth.lat);
    const lng = useSelector((state) => state.auth.lng);
    const [directions, setDirections] = useState(null);
    const router = useRouter();
    const { id } = router.query;
    const isAuthenticated = useSelector((state) => !!state.auth.accessToken);
    const [availableRooms, setAvailableRooms] = useState(0);
    const [selectedRange, setSelectedRange] = useState([null, null]);
    const today = new Date();

    const fetchRoomData = async () => {
        if (!id) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.get(`/api/rooms/${id}`);
            if (response.data) {
                console.log(response.data)
                setRoom(response.data);
            } else {
                setError("Room not found.");
            }
        } catch (err) {
            console.error("Error fetching room data:", err);
            setError("Unable to fetch room details. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };


    // Fetch room availability details
    const fetchRoomAvailabilityData = async () => {
        if (!id) return;

        try {
            const response = await apiClient.get(`/api/rooms/availability/${id}`);
            if (response.data) {
                setBookedDates(response.data.booked_dates || []);
            }
        } catch (err) {
            console.error("Error fetching availability data:", err);
        }
    };


    const fetchAllCoupons = async () => {
        try {
            const response = await apiClient.get('/api/all-coupons/');
            console.log('All Coupons:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch coupons:', error.response?.data?.error || error.message);
            return [];
        }
    };

    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        const loadCoupons = async () => {
            const coupons = await fetchAllCoupons();
            setCoupons(coupons);
        };
        loadCoupons();
    }, []);


    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const handleSelectCoupon = (coupon) => {
        if (selectedCoupon?.code === coupon.code) {
            // Deselect the coupon if it's already selected
            setSelectedCoupon(null);
        } else {
            // Select the new coupon
            setSelectedCoupon(coupon);
        }
    };

    // Fetch room data
    useEffect(() => {
        fetchRoomData();
        fetchRoomAvailabilityData();
    }, [id]);


    // Directions calculation - only run when room, lat, and lng are available
    useEffect(() => {
        if (room && lat && lng) {
            let google = window.google;
            if (!google) {
                console.error("Google Maps API or current location is not available.");
                return;
            }
            const origin = { lat: parseFloat(lat), lng: parseFloat(lng) };
            const destination = {
                lat: parseFloat(room.latitude),
                lng: parseFloat(room.longitude),
            };

            const directionsService = new google.maps.DirectionsService();
            directionsService.route(
                {
                    origin,
                    destination,
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                    } else {
                        console.error("Directions request failed due to " + status);
                    }
                }
            );
        }
    }, [room, lat, lng]);  // Ensure it runs when room, lat, or lng is updated


    const [guests, setGuests] = useState(1);
    const [selectedServices, setSelectedServices] = useState([]);

    const s = (n) => n === 1 ? '' : 's';


    const totalPrice = (() => {
        if (!selectedRange[0] || !selectedRange[1] || !room) return 0;

        const days = Math.ceil(
            (selectedRange[1] - selectedRange[0]) / (1000 * 60 * 60 * 24)
        );

        const serviceCost = selectedServices.reduce((sum, serviceId) => {
            const service = room?.services?.find((s) => s.id === serviceId);
            return sum + (service ? parseFloat(service.price) : 0);
        }, 0);

        const basePrice = days * parseFloat(room.price_per_night) + serviceCost;
        const tax = room.tax ? (basePrice * parseFloat(room.tax)) / 100 : 0;
        const totalBeforeDiscount = basePrice + tax;

        // Apply coupon discount if available
        if (selectedCoupon) {
            const discountAmount = (totalBeforeDiscount * selectedCoupon.discount_percent) / 100;
            return totalBeforeDiscount - discountAmount;
        }

        return totalBeforeDiscount;
    })();

    const handleCheckout = async () => {
        // Prepare the booking data
        const bookingData = {
            roomId: room.id,
            startDate: selectedRange[0],
            endDate: selectedRange[1],
            guests: guests,
            selectedServices: selectedServices,
            totalPrice: totalPrice,
            coupon: selectedCoupon,
        };

        try {
            const response = await apiClient.post('/api/checkout/', bookingData);
            console.log(response);
            if (response.status === 201 || response.status === 200) {
                const { order_id, currency, amount } = response.data;
                // Initiate Razorpay payment process
                const options = {
                    key: "rzp_test_TfgOb0cBLF77Mn", // Enter your Razorpay Key ID
                    amount: amount, // The total amount for the transaction in the smallest currency unit (paisa)
                    currency: currency,
                    order_id: order_id,
                    handler: function (response) {
                        // Send payment details to your backend to verify payment
                        const paymentData = {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        };
                        // You can send paymentData to your backend to confirm the payment
                        apiClient.post('/api/verify-payment/', paymentData).then(() => {
                            Swal.fire({
                                title: 'Payment Successful!',
                                text: 'Your booking has been confirmed.',
                                icon: 'success',
                                confirmButtonText: 'OK',
                            }).then(() => {
                                // Refresh the page or reset the state
                                window.location.reload(); // Refresh the page
                                // Reset form values here if necessary
                                setSelectedRange([null, null]);
                                setGuests(1);
                                setSelectedServices([]);
                                setSelectedCoupon(null);
                            });
                        }).catch((error) => {
                            Swal.fire({
                                title: 'Payment Verification Failed',
                                text: 'There was an issue verifying the payment.',
                                icon: 'error',
                                confirmButtonText: 'Try Again',
                            });
                            console.error(error);
                        });
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                        contact: user.phone, // Update with the user's phone number
                    },
                    notes: {
                        address: "Razorpay Payment",
                    },
                    theme: {
                        color: "#F37254",
                    },
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
            } else {
                // Handle any errors from the server
                Swal.fire({
                    title: 'Payment Verification Failed',
                    text: 'Error during checkout. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                });
                console.error(error);
            }
        } catch (error) {
            console.error('Checkout failed:', error);
            Swal.fire({
                title: 'Checkout failed',
                text: 'There was an error during checkout. Please try again later.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };



    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold">Loading...</p>
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold text-red-600">{error || "Room not found."}</p>
            </div>
        );
    }


    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8 mb-12">
                <ImageSlider mainImage={room.main_image} additionalImages={room.additional_images} />
                <h1 className="text-3xl font-bold mt-14 mb-4">{room.room_name}</h1>
                <div className="flex flex-col justify-between mb-2 w-full">
                    <div className="flex items-center">
                        <FiUser className="text-gray-500 text-lg" /> &nbsp;
                        <span>{room?.owner?.first_name} {room?.owner?.last_name}</span>
                    </div>

                    <a href={`tel:7357220325`} className={`flex items-center mt-2 rounded-full text-sm`}>
                        <FiPhone className="text-md" /> &nbsp;
                        7357220325
                    </a>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{`${room.address}`}</span>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                    <span className="w-5 h-5 mr-2" />
                    <span>{`${room.near_by}, ${room.city}, ${room.state}, ${room.country},  ${room.postal_code}`}</span>
                </div>
                <div className="mt-4">
                    <p className="text-lg text-white bg-green-600 p-2 rounded-lg inline">{`${directions ? directions.routes[0].legs[0].distance.text : "Calculating..."} from your location.`}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-semibold mb-4">About this room</h2>
                        <p className="text-gray-700 mb-4">{room.description}</p>
                        <h3 className="text-xl font-semibold mb-2">Facilities</h3>
                        <ul className="list-disc list-inside mb-4">
                            {room.facilities?.map((facility, index) => (
                                <li key={index}>{facility.name}</li>
                            ))}
                        </ul>
                        <h3 className="text-xl font-semibold mb-2">Services</h3>
                        <ul className="list-disc list-inside mb-4">
                            {room.services?.map((service, index) => (
                                <li key={index}>{service.name}</li>
                            ))}
                        </ul>
                        <h3 className="text-xl font-semibold mb-2">Rules</h3>
                        <ul className="list-none mb-4">
                            {room.rules?.split('-').map((rule, index) => (
                                rule.trim() && (
                                    <li key={index} className="mb-2">
                                        <span className="text-lg">- {rule.trim()}</span>  {/* Preceding each rule with a dash */}
                                    </li>
                                )
                            ))}
                        </ul>

                        <div className="flex justify-center items-center mb-8">
                            <div style={{ height: "400px", width: "100%" }} className="rounded-lg">
                                <GoogleMap
                                    mapContainerStyle={{ width: '100%', height: '100%', borderRadius: "14px" }}
                                    center={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
                                    zoom={10}
                                >
                                    <Marker
                                        position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
                                        label="You are here"
                                    />
                                    <Marker
                                        position={{ lat: parseFloat(room.latitude), lng: parseFloat(room.longitude) }}
                                        label={room.room_name}
                                    />
                                    {directions && (
                                        <DirectionsRenderer directions={directions} />
                                    )}
                                </GoogleMap>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white shadow-md rounded-lg p-6  mb-6">
                            <h3 className="text-xl font-semibold mb-2">Room Details</h3>
                            <ul className="space-y-2">
                                <li>
                                    <span className="font-medium">Capacity:</span> {room.capacity || "0"} guests
                                </li>
                                <li>
                                    <span className="font-medium">Room For:</span> {room.room_for || ""}
                                </li>
                                <li>
                                    <span className="font-medium">Room Type:</span> {room.room_type || ""}
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-100">
                            {/* Price Section */}
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    <span className="line-through text-gray-400">₹{room.price_not_per_night}</span>
                                    <span className="text-sm font-normal text-gray-500 ml-2">/ night</span>
                                </h3>
                                <h3 className="text-3xl font-bold text-blue-600">
                                    ₹{room.price_per_night}
                                    <span className="text-sm font-normal text-gray-500 ml-2">/ night</span>
                                </h3>
                            </div>

                            {/* Rating Section */}
                            <div className="flex items-center mb-6">
                                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                                <span className="font-semibold text-gray-800">{room.average_rating.toFixed(1) || "0"}</span>
                                <span className="text-gray-500 ml-1">({room.reviews?.length || 0} reviews)</span>
                            </div>
                            {/* Booking Section */}
                            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Booking Details</h3>

                            {/* Calendar Section */}
                            <div className="mb-6">
                                <DatePicker
                                    selected={selectedRange[0]}
                                    onChange={(update) => setSelectedRange(update)}
                                    startDate={selectedRange[0]}
                                    endDate={selectedRange[1]}
                                    selectsRange
                                    inline
                                    minDate={today}
                                    excludeDates={bookedDates.map((d) => new Date(d))}
                                    dayClassName={(date) => {
                                        if (bookedDates.includes(date.toISOString().split("T")[0])) {
                                            return "bg-red-100 text-red-700 cursor-not-allowed";
                                        }
                                        if (
                                            selectedRange[0] &&
                                            selectedRange[1] &&
                                            date >= selectedRange[0] &&
                                            date <= selectedRange[1]
                                        ) {
                                            return "bg-blue-100 text-blue-700 hover:bg-blue-200";
                                        }
                                        return "bg-green-100 text-green-700 hover:bg-green-200";
                                    }}
                                />
                            </div>


                            {isAuthenticated ? (
                                <>

                                    {/* Guests Selector */}
                                    <div className="mb-6">
                                        <label htmlFor="guests" className="block text-gray-700 text-sm font-semibold mb-2">
                                            Select Guests
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="guests"
                                                value={guests}
                                                onChange={(e) => setGuests(parseInt(e.target.value))}
                                                className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:shadow-md transition duration-200"
                                            >
                                                {[...Array(room.capacity).keys()].map((num) => (
                                                    <option key={num + 1} value={num + 1}>
                                                        {num + 1} guest{s(num + 1)}
                                                    </option>
                                                ))}
                                            </select>

                                        </div>
                                    </div>

                                    {/* Services Section */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Additional Services</h4>
                                        {room.services?.map((service) => (
                                            <label
                                                key={service.id}
                                                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition duration-200 cursor-pointer"
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        value={service.id}
                                                        checked={selectedServices.includes(service.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedServices([...selectedServices, service.id]);
                                                            } else {
                                                                setSelectedServices(selectedServices.filter((id) => id !== service.id));
                                                            }
                                                        }}
                                                        className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-3 text-gray-700">{service.name}</span>
                                                </div>
                                                <span className="text-gray-600">₹{service.price}</span>
                                            </label>
                                        ))}
                                    </div>



                                    {room.tax && (
                                        <div className="mb-6">
                                            <hr className="border-gray-200 mb-4" />
                                            <div className="flex items-center justify-between">
                                                <span>Tax ({room.tax}%)</span>
                                                <span>₹{((totalPrice * room.tax) / 100).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )}


                                    <div className="space-y-4">
                                        {coupons.map((coupon) => {
                                            const isDisabled = totalPrice < coupon.min_amount;
                                            const isSelected = selectedCoupon?.code === coupon.code;

                                            return (
                                                <div
                                                    key={coupon.code}
                                                    className={`bg-white shadow-md rounded-lg p-4 border ${isSelected
                                                        ? "border-blue-500"
                                                        : isDisabled
                                                            ? "border-gray-200 opacity-50"
                                                            : "border-gray-200"
                                                        } transition-all duration-200 ${isDisabled ? "cursor-not-allowed" : "cursor-pointer hover:shadow-lg"
                                                        }`}
                                                    onClick={() => !isDisabled && handleSelectCoupon(coupon)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-xl font-semibold text-blue-600">
                                                            {coupon.code}
                                                        </h3>
                                                        {isSelected ? (
                                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                                        ) : isDisabled ? (
                                                            <XCircle className="w-6 h-6 text-red-500" />
                                                        ) : null}
                                                    </div>
                                                    <p className="text-gray-700 mt-2">
                                                        <span className="font-medium">Discount:</span> {coupon.discount_percent}%
                                                    </p>
                                                    <p className="text-gray-700">
                                                        <span className="font-medium">Minimum Amount:</span> ₹{coupon.min_amount}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        <span className="font-medium">Valid until:</span>{" "}
                                                        {new Date(coupon.valid_to).toLocaleDateString()}
                                                    </p>
                                                    {isDisabled && (
                                                        <p className="text-sm text-red-500 mt-2">
                                                            Minimum order amount of ₹{coupon.min_amount} required.
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>


                                    {/* Total Payment Section */}
                                    <div className="mb-6">

                                        {selectedCoupon && (
                                            <div className="flex items-center justify-between mb-2 mt-2">
                                                <span className="text-lg font-medium text-gray-500">Original Price</span>
                                                <span className="text-lg  text-gray-400">₹{(totalPrice + (totalPrice * selectedCoupon.discount_percent) / 100).toFixed(2)}</span>
                                            </div>
                                        )}
                                        {selectedCoupon && (
                                            <div className="flex items-center justify-between mb-2 mt-2">
                                                <span className="text-lg font-medium text-gray-500">Coupon Discount</span>
                                                <span className="text-lg  text-gray-400">- ₹{((totalPrice * selectedCoupon.discount_percent) / 100).toFixed(2)}</span>
                                            </div>
                                        )}
                                        <hr className="border-gray-200 mb-4" />
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-semibold text-gray-800">Total Payment</span>
                                            <span className="text-xl font-bold text-blue-600">₹{totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <button
                                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        onClick={handleCheckout}
                                    >
                                        Proceed to Checkout
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Login Prompt */}
                                    <button
                                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        onClick={() => {
                                            const currentUrl = encodeURIComponent(window.location.href);
                                            window.location.href = `/auth/login?redirect=${currentUrl}`;
                                        }}
                                    >
                                        Book Now
                                    </button>
                                </>
                            )}
                        </div>

                    </div>
                </div>

                <AddReviewForm roomId={room.id} onReviewAdded={fetchRoomData} />
                <Reviews reviews={room.reviews} />
                <RelatedRooms rooms={room.related_rooms} />
            </div>
            <Footer />
        </>
    );
}