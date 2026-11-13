
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

export const createBooking=createAsyncThunk(
  "bookings/createBooking",
  async (bookingData, { rejectWithValue })=>{
    try {
      const response=await API.post("/bookings", bookingData);
      return response.data.booking;

    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Booking failed");
    }
  }
);

export const fetchBookings=createAsyncThunk(
  "bookings/fetchBookings",

  async (_, { rejectWithValue })=>{
    try {
      const response=await API.get("/bookings");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Could not fetch bookings");
    }
  }
);

export const cancelBooking=createAsyncThunk(
  "bookings/cancelBooking",

  async (id, { rejectWithValue })=>{
    try {
      const response=await API.delete(`/bookings/${id}`);
      return response.data.booking;
    } catch (error) {

      return rejectWithValue(error.response?.data?.error || "Cancellation failed");
    }
  }
);

const bookingSlice=createSlice({
  name: "bookings",
  initialState: {
    booking: null,
    bookings: [],


    loading: false,
    error: null,
  },
  reducers: {
    clearBooking: (state)=> {
      state.booking=null;
      state.error=null;
    },
  },
  extraReducers: (builder)=>{
    builder
      .addCase(createBooking.pending, (state)=> {
        state.loading=true;
        state.error=null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading=false;
        state.booking=action.payload;
      })
      .addCase(createBooking.rejected, (state, action)=> {
        state.loading=false;
        state.error=action.payload;
      })

      .addCase(fetchBookings.pending, (state)=>{
        state.loading=true;
        state.error=null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading=false;
        state.bookings=action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action)=>{
        state.loading=false;
        state.error=action.payload;
      })
      .addCase(cancelBooking.fulfilled, (state, action) =>{
        const index=state.bookings.findIndex(
          (item) =>item.id===action.payload.id
        );
        if (index!==-1) state.bookings[index]=action.payload;
      });
  },
});

export const { clearBooking }=bookingSlice.actions;

export default bookingSlice.reducer;

