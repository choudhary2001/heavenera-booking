import React, { useEffect, useState, useRef } from "react";
import apiClient from "../../actions/axiosInterceptor";
import baseURL from "../../url";
import { useSelector } from 'react-redux';
function MapExample() {
  const mapRef = useRef(null);
  const [rooms, setRooms] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const role = useSelector((state) => state.auth.role);

  // Fetch room data from the backend
  const fetchRooms = async () => {
    try {
      const response = await apiClient.get(`/api/${role}/rooms/?no_pagination=true`);
      setRooms(response.data); // Set rooms to the fetched data
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Get current location
  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching current location:", error);
          // Fallback to a default location (e.g., New York City)
          setCurrentLocation({ lat: 40.748817, lng: -73.985428 });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Fallback to a default location
      setCurrentLocation({ lat: 40.748817, lng: -73.985428 });
    }
  };

  // Initialize Google Maps with room markers
  const initializeMap = () => {
    let google = window.google;
    if (!google || !currentLocation) {
      console.error("Google Maps API or current location is not available.");
      return;
    }

    // Map options
    const mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(currentLocation.lat, currentLocation.lng),
      scrollwheel: false,
      zoomControl: true,
      styles: [
        {
          featureType: "administrative",
          elementType: "labels.text.fill",
          stylers: [{ color: "#444444" }],
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [{ color: "#f2f2f2" }],
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "all",
          stylers: [{ saturation: -100 }, { lightness: 45 }],
        },
        {
          featureType: "road.highway",
          elementType: "all",
          stylers: [{ visibility: "simplified" }],
        },
        {
          featureType: "road.arterial",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [{ color: "#cbd5e0" }, { visibility: "on" }],
        },
      ],
    };

    // Initialize map
    const map = new google.maps.Map(mapRef.current, mapOptions);
    const bounds = new google.maps.LatLngBounds();
    // Add markers for each room
    rooms.forEach((room) => {
      const position = new google.maps.LatLng(room.latitude, room.longitude);
      const marker = new google.maps.Marker({
        position,
        map,
        animation: google.maps.Animation.DROP,
        title: room.room_name,
      });
      bounds.extend(position);

      // Info window content
      const contentString = `
        <div class="info-window-content">
        <img src="${baseURL}${room.main_image}" alt="${room.room_name}" style="width: 100px; height: auto; border-radius: 5px; margin-bottom: 10px;" />
          <h2>${room.room_name}</h2>
          <p>${room.address}</p>
        </div>
      `;

      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });

      // Add click listener to marker
      marker.addListener("click", () => {
        infowindow.open(map, marker);
      });
    });
    map.fitBounds(bounds);

  };

  // Fetch rooms and current location when the component mounts
  useEffect(() => {
    fetchCurrentLocation();
    fetchRooms();
  }, [role]);

  // Reinitialize map when rooms or current location changes
  useEffect(() => {
    if (rooms.length > 0 && currentLocation) {
      initializeMap();
    }
  }, [rooms, currentLocation]);

  return (
    <div className="relative w-full rounded h-600-px">
      <div className="rounded h-full" ref={mapRef} />
    </div>
  );
}

export default MapExample;
