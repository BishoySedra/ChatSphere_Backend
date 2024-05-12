import React from "react";

function Searchbar(props) {
  return (
    <input
      className="form-control border-0 rounded-3 mt-5 mb-4"
      type="search"
      placeholder="Search"
      aria-label="Search"
      value={props.value}  
      onChange={props.onChange}  
    />
  );
}

export default Searchbar;