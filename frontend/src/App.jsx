

import { Routes, Route } from "react-router-dom";
import HotelList from "./pages/HotelList";
import AddHotel from "./pages/AddHotel";
import EditHotel from "./pages/EditHotel";
import HotelDetail from "./pages/HotelDetail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HotelList />} />
      <Route path="/add" element={<AddHotel />} />
      <Route path="/edit/:id" element={<EditHotel />} />
      <Route path="/hotel/:id" element={<HotelDetail />} />
      <Route path="/book/:id" element={<Booking />} />
      <Route path="/my-bookings" element={<MyBookings />} />
    </Routes>
  );
}
export default App;