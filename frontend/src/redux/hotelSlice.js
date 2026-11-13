
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

export const fetchHotels = createAsyncThunk(
  "hotels/fetchHotels",

  
  async ({ page = 1, limit = 6, search = "", minPrice = "", maxPrice = "" } = {}) => {
    const offset = (page - 1) * limit;
    const response = await API.get("/hotels", {
      params: { limit, offset, search, minPrice, maxPrice },
    });
    return response.data;
  }


);

export const fetchHotelById = createAsyncThunk(
  "hotels/fetchById",
  async (id, { rejectWithValue }) => {
    try {

      const res = await API.get(`/hotels/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.status === 404
          ? "Hotel not found"
          : err.response?.data?.error || "Something went wrong"
      );
    }
  }
);

export const addHotel = createAsyncThunk(
  "hotels/add",
  async (formData, { rejectWithValue }) => {


    try {
      const res = await API.post("/hotels", formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Could not add hotel");
    }
  }
);

export const updateHotel = createAsyncThunk(
  "hotels/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/hotels/${id}`, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Could not update hotel");
    }
  }
);

export const deleteHotel=createAsyncThunk(
  "hotels/delete",


  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/hotels/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Could not delete hotel");
    }
  }
);
const hotelSlice=createSlice({
  name: "hotels",
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
    selected: null,

    selectedLoading: false,
    selectedError: null,
  },
  reducers: {},
  extraReducers: (builder)=> {
    builder
      .addCase(fetchHotels.pending, (state)=> {
        state.loading=true;

        state.error=null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading=false;

        state.items=action.payload.hotels;
        state.total=action.payload.total;

      })
      .addCase(fetchHotels.rejected,(state, action) => {
        state.loading=false;
        state.error = action.error.message;
      })
      .addCase(fetchHotelById.pending, (state) => {
        state.selected=null;

        state.selectedLoading=true;
        state.selectedError=null;
      })
      .addCase(fetchHotelById.fulfilled,(state,action) => {
        state.selectedLoading=false;
        state.selected=action.payload;
      })
      .addCase(fetchHotelById.rejected,(state,action) => {
        state.selectedLoading=false;
        state.selectedError=action.payload || "Hotel not found";
      })
      .addCase(addHotel.fulfilled, (state,action)=> {
        state.items.unshift(action.payload);
        state.total+=1;
      })
      .addCase(updateHotel.fulfilled, (state, action)=>{
        const index=state.items.findIndex((hotel)=>hotel.id===action.payload.id);
        if (index!==-1) {
          state.items[index]=action.payload;
        }
        state.selected=action.payload;
      })
      .addCase(deleteHotel.fulfilled, (state, action)=>{
        state.items=state.items.filter((hotel) =>hotel.id!=action.payload);

        state.total=Math.max(0,state.total-1);
      });
  },
});


export default hotelSlice.reducer;
