
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { fetchHotelById } from "../redux/hotelSlice";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,

  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
function HotelDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected: hotel, selectedLoading, selectedError } = useSelector(
    (state) => state.hotels
  );

  useEffect(() => {
    dispatch(fetchHotelById(id));
  }, [dispatch, id]);

  if (selectedError) return <p>{selectedError}</p>;
  if (selectedLoading || !hotel) return <p>Loading...</p>;

  const position = [Number(hotel.latitude), Number(hotel.longitude)];

  return (
    <div className="container">
      <Helmet>
        <title>{hotel.title} | Hotels</title>
        <meta name="description" content={hotel.description} />
      </Helmet>
      <Link to="/" className="btn">← Back</Link>
      <div className="detail">
        <img
          className="detail-img"
          src={`http://localhost:5000${hotel.image}`}
          alt={hotel.title}
        />
        <h1>{hotel.title}</h1>
        <p className="price">₹{hotel.price}</p>
        <p>{hotel.description}</p>
        <Link to={`/book/${hotel.id}`} className="btn">Book Now</Link>
        <MapContainer center={position} zoom={13} className="map">
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={DefaultIcon}>
            <Popup>{hotel.title}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
export default HotelDetail;
