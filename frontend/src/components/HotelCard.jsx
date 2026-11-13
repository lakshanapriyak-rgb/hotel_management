import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteHotel } from "../redux/hotelSlice";
import ConfirmModal from "./ConfirmModal";

const IMAGE_BASE="http://localhost:5000";
function HotelCard({ hotel, onDeleted }) 
{
  const [showModal, setShowModal]=useState(false);
  const dispatch=useDispatch();
  const handleDelete = async ()=>{
    await dispatch(deleteHotel(hotel.id)).unwrap();
    setShowModal(false);

    onDeleted();
  };

  return (
    <div className="hotel-card">
      <img src={`${IMAGE_BASE}${hotel.image}`} alt={hotel.title} />

      <div className="hotel-info">
        <h3>
          <Link to={`/hotel/${hotel.id}`}>{hotel.title}</Link>
        </h3>
        <p className="price">₹{hotel.price}</p>

        <p className="desc">{hotel.description}</p>

        <Link to={`/edit/${hotel.id}`} className="btn">Edit</Link>

        <button className="btn-danger" onClick={()=> setShowModal(true)}>
          Delete
        </button>
      </div>

      {showModal && (
        <ConfirmModal
          message={`Delete "${hotel.title}"?`}
          onConfirm={handleDelete}
          onCancel={()=>setShowModal(false)}
        />
      )}
    </div>
  );
}

export default HotelCard;