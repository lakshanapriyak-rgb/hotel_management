import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchHotelById, updateHotel } from "../redux/hotelSlice";
import HotelForm from "../components/HotelForm";

function EditHotel() {
  const { id }=useParams();
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const {selected:hotel,selectedLoading,selectedError }=useSelector(
    (state)=>state.hotels
  );


  useEffect(()=>{
    dispatch(fetchHotelById(id));
  }, [dispatch, id]);

  const handleSubmit=async (formData)=>{
    await dispatch(updateHotel({id,formData})).unwrap();
    navigate("/");
  };
  if (selectedError) return <p>{selectedError}</p>;

  if (selectedLoading || !hotel) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Edit Hotel</h1>
      <HotelForm
        initialData={hotel}
        onSubmit={handleSubmit}

        buttonText="Update Hotel"
      />
    </div>
  );
}

export default EditHotel;