import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
    FaHome,
    FaMoneyBillWave,
    FaExchangeAlt,
    FaChartBar,
    FaPiggyBank,
    FaCog,
    FaSignOutAlt,
    FaReceipt,
    FaTrashRestore
} from "react-icons/fa";

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove logged-in user
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("isLoggedIn");

        // Go to login page
        navigate("/login");
    };

    return (
        <aside className="sidebar">

            {/* FH Logo */}
            <div className="fh-logo">
                <span>F</span>
                <span>H</span>
            </div>

            {/* Menu */}
            <nav className="menu">

                <NavLink to="/">
                    <FaHome />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/income">
                    <FaMoneyBillWave />
                    <span>Income</span>
                </NavLink>

                <NavLink to="/expenses">
                    <FaReceipt />
                    <span>Expenses</span>
                </NavLink>

                <NavLink to="/transactions">
                    <FaExchangeAlt />
                    <span>Transactions</span>
                </NavLink>

                <NavLink to="/reports">
                    <FaChartBar />
                    <span>Reports</span>
                </NavLink>

                <NavLink to="/budget">
                    <FaPiggyBank />
                    <span>Budget</span>
                </NavLink>

                <NavLink to="/delete-history">
                    <FaTrashRestore />
                    <span>Delete History</span>
                </NavLink>

                <NavLink to="/settings">
                    <FaCog />
                    <span>Settings</span>
                </NavLink>

            </nav>

            {/* Logout */}
            <div className="logout">
                <button onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>

        </aside>
    );
}

export default Sidebar;