
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createBooking } from "../redux/bookingSlice";
import "./Booking.css";

function Booking() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.bookings);

  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    phone: "",
    check_in: "",
    check_out: "",
    guests: 1,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.check_out <= form.check_in) {
      alert("Check-out date must be after check-in date");
      return;
    }

    const result = await dispatch(
      createBooking({
        hotel_id: Number(id),
        ...form,
        guests: Number(form.guests),
      })
    );

    if (createBooking.fulfilled.match(result)) {
      alert("Booking successful!");
      navigate("/my-bookings");
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h1>Hotel Booking</h1>
        <p className="booking-subtitle">Fill in your details to confirm your stay</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer Name</label>
            <input type="text" name="customer_name" placeholder="Enter your name" value={form.customer_name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" placeholder="Enter your phone number" value={form.phone} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Check-in Date</label>
              <input type="date" name="check_in" value={form.check_in} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Check-out Date</label>
              <input type="date" name="check_out" value={form.check_out} min={form.check_in || undefined} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Number of Guests</label>
            <input type="number" name="guests" min="1" value={form.guests} onChange={handleChange} required />
          </div>

          {error && <p className="booking-error">{error}</p>}

          <button type="submit" className="booking-btn" disabled={loading}>
            {loading ? "Processing..." : "Confirm Booking"}
          </button>

          <button type="button" className="back-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;
