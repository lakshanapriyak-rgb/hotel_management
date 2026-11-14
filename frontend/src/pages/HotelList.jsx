
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotels } from "../redux/hotelSlice";
import HotelCard from "../components/HotelCard";
import Pagination from "../components/Pagination";
import FilterBox from "../components/FilterBox";
import { Link } from "react-router-dom";


const LIMIT = 6;

function HotelList() {
  const dispatch=useDispatch();
  const [page, setPage]=useState(1);
  const [refresh, setRefresh]=useState(0); 
  const [filters, setFilters]=useState({
    search: "",
    minPrice: "",
    maxPrice: "",
  });

  const { items, total, loading, error } = useSelector(

    (state) => state.hotels
  );

  useEffect(()=>{
    dispatch(fetchHotels({ page, limit: LIMIT, ...filters }));
  }, [dispatch, page, filters, refresh]);       

  const totalPages=Math.ceil(total/LIMIT);
  const handleApply=(newFilters) =>{
    setFilters(newFilters);
    setPage(1);
  };

  

  const handleDeleted=() =>{
    if (items.length===1 &&page>1) {
      setPage(page-1);
    } 
    else {
      setRefresh((r)=>r+1);
    }
  };
  const handlePageChange=(n)=> {
  setPage(n);
  window.scrollTo({ top: 0,behavior:"smooth" });
};

  return (
    <div className="container">
      <div className="page-header">
        <h1>Hotels</h1>
        <Link to="/add" className="btn">Add Hotel</Link>
      </div>

      <div className="layout">
        <FilterBox onApply={handleApply} />

        <div className="content">
          {loading && <div className="spinner"></div>}
          
          {error && <p>Error: {error}</p>}
          {!loading && total >0&&(
  <p className="count">{total} hotels found</p>
)}


          {!loading && items.length === 0 && <p>No hotels found</p>}

          <div className="hotel-list">
            {items.map((hotel) => (
              <HotelCard
                key={hotel.id}

                hotel={hotel}
                onDeleted={handleDeleted}   
              />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            
          />
        </div>
      </div>
    </div>
  );
}
export default HotelList;