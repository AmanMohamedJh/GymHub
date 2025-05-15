import React from "react";
import { FaSearch, FaCalendar } from "react-icons/fa";
import "./SearchBar.css";

const SearchBar = ({
  searchTerm,
  dateFilter,
  onSearchChange,
  onDateChange,
}) => {
  return (
    <div className="owner-reviews-search-container">
      <div className="owner-reviews-search-input-wrapper">
        <FaSearch className="owner-reviews-search-icon" />
        <input
          type="text"
          placeholder="Search by gym name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="owner-reviews-search-input"
        />
      </div>
      <div className="owner-reviews-date-input-wrapper">
        <FaCalendar className="owner-reviews-calendar-icon" />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => onDateChange(e.target.value)}
          className="owner-reviews-date-input"
        />
      </div>
    </div>
  );
};

export default SearchBar;
