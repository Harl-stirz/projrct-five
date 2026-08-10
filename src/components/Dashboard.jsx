import React from "react";
import {
    FaMoneyBillWave,
    FaWallet,
    FaChartLine,
    FaArrowUp,
    FaArrowDown
} from "react-icons/fa";

import "./Dashboard.css";

function Dashboard() {
    return (
        <div className="dashboard">

            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here's your financial overview.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">

                <div className="summary-card">
                    <div className="card-icon income">
                        <FaArrowUp />
                    </div>

                    <div>
                        <p>Total Income</p>
                        <h2>$8,450.00</h2>
                        <span className="positive">
                            +12.5% this month
                        </span>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="card-icon expense">
                        <FaArrowDown />
                    </div>

                    <div>
                        <p>Total Expenses</p>
                        <h2>$3,240.00</h2>
                        <span className="negative">
                            -5.2% this month
                        </span>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="card-icon balance">
                        <FaWallet />
                    </div>

                    <div>
                        <p>Total Balance</p>
                        <h2>$5,210.00</h2>
                        <span className="positive">
                            +8.4% this month
                        </span>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="card-icon savings">
                        <FaMoneyBillWave />
                    </div>

                    <div>
                        <p>Total Savings</p>
                        <h2>$2,850.00</h2>
                        <span className="positive">
                            +15.8% this month
                        </span>
                    </div>
                </div>

            </div>

            {/* Main Dashboard */}
            <div className="dashboard-grid">

                {/* Income & Expenses */}
                <div className="dashboard-card chart-card">

                    <div className="card-header">
                        <div>
                            <h3>Income & Expenses</h3>
                            <p>Monthly financial overview</p>
                        </div>

                        <FaChartLine className="chart-icon" />
                    </div>

                    <div className="chart">

                        <div className="chart-bars">
                            <div className="bar-group">
                                <div className="bar income-bar" style={{ height: "150px" }}></div>
                                <div className="bar expense-bar" style={{ height: "90px" }}></div>
                                <span>Jan</span>
                            </div>

                            <div className="bar-group">
                                <div className="bar income-bar" style={{ height: "180px" }}></div>
                                <div className="bar expense-bar" style={{ height: "110px" }}></div>
                                <span>Feb</span>
                            </div>

                            <div className="bar-group">
                                <div className="bar income-bar" style={{ height: "130px" }}></div>
                                <div className="bar expense-bar" style={{ height: "80px" }}></div>
                                <span>Mar</span>
                            </div>

                            <div className="bar-group">
                                <div className="bar income-bar" style={{ height: "200px" }}></div>
                                <div className="bar expense-bar" style={{ height: "120px" }}></div>
                                <span>Apr</span>
                            </div>

                            <div className="bar-group">
                                <div className="bar income-bar" style={{ height: "170px" }}></div>
                                <div className="bar expense-bar" style={{ height: "100px" }}></div>
                                <span>May</span>
                            </div>

                            <div className="bar-group">
                                <div className="bar income-bar" style={{ height: "220px" }}></div>
                                <div className="bar expense-bar" style={{ height: "130px" }}></div>
                                <span>Jun</span>
                            </div>
                        </div>

                        <div className="chart-legend">
                            <span>
                                <i className="legend-income"></i>
                                Income
                            </span>

                            <span>
                                <i className="legend-expense"></i>
                                Expenses
                            </span>
                        </div>

                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="dashboard-card transactions-card">

                    <div className="card-header">
                        <div>
                            <h3>Recent Transactions</h3>
                            <p>Your latest transactions</p>
                        </div>

                        <button>View All</button>
                    </div>

                    <div className="transactions">

                        <div className="transaction">
                            <div className="transaction-icon income">
                                <FaArrowUp />
                            </div>

                            <div className="transaction-info">
                                <h4>Salary</h4>
                                <p>August 10, 2026</p>
                            </div>

                            <strong className="positive">
                                +$3,500
                            </strong>
                        </div>

                        <div className="transaction">
                            <div className="transaction-icon expense">
                                <FaArrowDown />
                            </div>

                            <div className="transaction-info">
                                <h4>Groceries</h4>
                                <p>August 9, 2026</p>
                            </div>

                            <strong className="negative">
                                -$180
                            </strong>
                        </div>

                        <div className="transaction">
                            <div className="transaction-icon expense">
                                <FaArrowDown />
                            </div>

                            <div className="transaction-info">
                                <h4>Electricity Bill</h4>
                                <p>August 7, 2026</p>
                            </div>

                            <strong className="negative">
                                -$95
                            </strong>
                        </div>

                        <div className="transaction">
                            <div className="transaction-icon income">
                                <FaArrowUp />
                            </div>

                            <div className="transaction-info">
                                <h4>Freelance Work</h4>
                                <p>August 5, 2026</p>
                            </div>

                            <strong className="positive">
                                +$750
                            </strong>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;