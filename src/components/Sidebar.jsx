import React from "react";
import { NavLink } from "react-router-dom";

import {
    FaHome,
    FaMoneyBillWave,
    FaWallet,
    FaExchangeAlt,
    FaChartBar,
    FaPiggyBank,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {
    return (
        <aside className="sidebar">

            {/* Logo */}
            <div className="logo">
                <FaWallet />
                <h2>Finance</h2>
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
                    <FaWallet />
                    <span>Expenses</span>
                </NavLink>

                <NavLink to="/transactions">
                    <FaExchangeAlt />
                    <span>Transactions</span>
                </NavLink>

                {/* Reports */}
                <NavLink to="/reports">
                    <FaChartBar />
                    <span>Reports</span>
                </NavLink>

                <NavLink to="/budget">
                    <FaPiggyBank />
                    <span>Budget</span>
                </NavLink>

                <NavLink to="/settings">
                    <FaCog />
                    <span>Settings</span>
                </NavLink>

            </nav>

            {/* Logout */}
            <div className="logout">
                <NavLink to="/logout">
                    <FaSignOutAlt />
                    <span>Logout</span>
                </NavLink>
            </div>

        </aside>
    );
}

export default Sidebar;