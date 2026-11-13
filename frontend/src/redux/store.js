
import { configureStore } from "@reduxjs/toolkit";
import hotelReducer from "./hotelSlice";
import bookingReducer from "./bookingSlice";

const store=configureStore({
  reducer: {
    hotels: hotelReducer,
    bookings: bookingReducer,
  },

  
});

export default store;
