import React from "react";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";


function Navbar() {
  return (
    <header className="navbar">
      {/* Left Section */}
      <div className="navbar-left">
        <h2>Dashboard</h2>
        <p>Welcome back! Here's your financial overview.</p>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        {/* Search */}
        <div className="search-box">
          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search transactions..."
          />
        </div>

        {/* Notification */}
        <div className="notification">
          <FaBell className="bell-icon" />
          <span>3</span>
        </div>

        {/* Profile */}
        <div className="profile">
          <FaUserCircle className="profile-icon" />

          <div className="profile-info">
            <h4>John Doe</h4>
            <p>Premium User</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;