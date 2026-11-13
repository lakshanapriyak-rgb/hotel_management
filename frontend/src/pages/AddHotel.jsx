
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addHotel } from "../redux/hotelSlice";
import HotelForm from "../components/HotelForm";

function AddHotel() 
{
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const handleSubmit = async (formData)=>{
    await dispatch(addHotel(formData)).unwrap();

    navigate("/");
  };

  return (
    <div className="container">

      <h1>Add Hotel</h1>
      <HotelForm onSubmit={handleSubmit} buttonText="Add Hotel" />
    </div>
  );
  
}

export default AddHotel;