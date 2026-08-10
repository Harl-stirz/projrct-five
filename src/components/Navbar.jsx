import React, { useState } from "react";
import {
    FaSearch,
    FaBell,
    FaUserCircle,
    FaMoon,
    FaSun
} from "react-icons/fa";

function Navbar({ searchTerm, setSearchTerm }) {

    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("dark-mode");
    };

    return (
        <header className="navbar">

            {/* Left Section */}
            <div className="navbar-left">
                <h2>Dashboard</h2>
                <p>
                    Welcome back! Here's your financial overview.
                </p>
            </div>

            {/* Right Section */}
            <div className="navbar-right">

                {/* Search */}
                <div className="search-box">

                    <FaSearch className="search-icon" />

                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {searchTerm && (
                        <button
                            className="clear-search"
                            onClick={() => setSearchTerm("")}
                        >
                            ×
                        </button>
                    )}

                </div>

                {/* Dark Mode */}
                <button
                    className="theme-button"
                    onClick={toggleDarkMode}
                >
                    {darkMode ? <FaSun /> : <FaMoon />}
                </button>

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