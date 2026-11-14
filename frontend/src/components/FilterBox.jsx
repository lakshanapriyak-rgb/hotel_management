import { useState } from "react";
function FilterBox({ onApply }) {
  const [search, setSearch]=useState("");
  const [minPrice, setMinPrice]=useState("");
  const [maxPrice, setMaxPrice]=useState("");

  const handleApply=()=>{
    onApply({search,minPrice,maxPrice });
  };

  const handleClear=()=>{
  setSearch("");
  setMinPrice("");
  setMaxPrice("");
  onApply({ search: "",minPrice: "",maxPrice: "" });
};
  return (
    <div className="filter-box">
      <h3>Filter</h3>

      <input
        type="text"
        placeholder="Search hotel name"
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />
      <input
        type="number"
        placeholder="Min price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />


      <input
        type="number"
        placeholder="Max price"
        value={maxPrice}
        onChange={(e)=>setMaxPrice(e.target.value)}
      />
      <button onClick={handleApply}>Apply</button>
      <button type="button" className="clear-btn" onClick={handleClear}>
  Clear
</button>
    </div>
  );
}
export default FilterBox;