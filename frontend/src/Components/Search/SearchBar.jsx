import React from 'react';
import { FaSearch, FaCalendar } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ searchTerm, dateFilter, onSearchChange, onDateChange }) => {
  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by gym name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="date-input-wrapper">
        <FaCalendar className="calendar-icon" />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => onDateChange(e.target.value)}
          className="date-input"
        />
      </div>
    </div>
  );
};

export default SearchBar;
