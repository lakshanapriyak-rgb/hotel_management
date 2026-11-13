
import {useEffect} from "react";
import {useDispatch, useSelector } from "react-redux";
import {Link} from "react-router-dom";
import {fetchBookings,cancelBooking} from "../redux/bookingSlice";

function MyBookings() {
  const dispatch=useDispatch();
  const {bookings,loading,error}=useSelector(
    (state)=>state.bookings
  );
  useEffect(()=>{
    dispatch(fetchBookings());
  }, [dispatch]);
  const handleCancel=(id)=>{
    const confirmCancel=window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (confirmCancel) dispatch(cancelBooking(id));
  };

  return (
    <div className="container">
      <h1>My Bookings</h1>
      <Link to="/" className="btn">← Back to Hotels</Link>

      {loading && <p>Loading bookings...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && bookings.length===0 && (
        <p>No bookings found.</p>
      )}

      <div className="booking-list">
        {bookings.map((item) => (

          <div className="booking-card" key={item.id}>
            <h2>{item.hotel_name}</h2>
            <p><strong>Booking ID:</strong> {item.id}</p>
            <p><strong>Customer:</strong> {item.customer_name}</p>
            <p><strong>Email:</strong> {item.email}</p>

            <p><strong>Phone:</strong> {item.phone}</p>
            <p><strong>Check-in:</strong> {new Date(item.check_in).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> {new Date(item.check_out).toLocaleDateString()}</p>
            <p><strong>Guests:</strong> {item.guests}</p>


            <p><strong>Total Price:</strong> ₹{item.total_price}</p>
            <p><strong>Status:</strong> {item.status}</p>

            {item.status=== "Confirmed" && (
              <button onClick={() =>handleCancel(item.id)}>
                Cancel Booking

              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default MyBookings;
