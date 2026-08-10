import React from "react";

import {
    FaChartBar,
    FaArrowUp,
    FaArrowDown,
    FaMoneyBillWave
} from "react-icons/fa";

// import "./Reports.css";

function Reports() {
    return (
        <div className="reports">

            {/* Header */}
            <div className="reports-header">
                <div>
                    <h1>Reports</h1>
                    <p>Analyze your financial performance.</p>
                </div>

                <select>
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>Last 3 Months</option>
                    <option>This Year</option>
                </select>
            </div>

            {/* Report Cards */}
            <div className="report-cards">

                <div className="report-card">
                    <div className="report-icon income">
                        <FaArrowUp />
                    </div>

                    <div>
                        <p>Total Income</p>
                        <h2>$8,450.00</h2>
                        <span className="positive">+12.5%</span>
                    </div>
                </div>

                <div className="report-card">
                    <div className="report-icon expense">
                        <FaArrowDown />
                    </div>

                    <div>
                        <p>Total Expenses</p>
                        <h2>$3,240.00</h2>
                        <span className="negative">-5.2%</span>
                    </div>
                </div>

                <div className="report-card">
                    <div className="report-icon balance">
                        <FaMoneyBillWave />
                    </div>

                    <div>
                        <p>Net Savings</p>
                        <h2>$5,210.00</h2>
                        <span className="positive">+8.4%</span>
                    </div>
                </div>

            </div>

            {/* Main Report Content */}
            <div className="reports-content">

                {/* Financial Overview */}
                <div className="report-box">

                    <div className="report-box-header">
                        <div>
                            <h3>Financial Overview</h3>
                            <p>Income versus expenses</p>
                        </div>

                        <FaChartBar />
                    </div>

                    <div className="report-chart">

                        <div className="report-bars">
                            <div
                                className="report-bar income-bar"
                                style={{ height: "150px" }}
                            ></div>

                            <div
                                className="report-bar expense-bar"
                                style={{ height: "90px" }}
                            ></div>
                        </div>

                        <div className="report-bars">
                            <div
                                className="report-bar income-bar"
                                style={{ height: "190px" }}
                            ></div>

                            <div
                                className="report-bar expense-bar"
                                style={{ height: "120px" }}
                            ></div>
                        </div>

                        <div className="report-bars">
                            <div
                                className="report-bar income-bar"
                                style={{ height: "140px" }}
                            ></div>

                            <div
                                className="report-bar expense-bar"
                                style={{ height: "80px" }}
                            ></div>
                        </div>

                        <div className="report-bars">
                            <div
                                className="report-bar income-bar"
                                style={{ height: "220px" }}
                            ></div>

                            <div
                                className="report-bar expense-bar"
                                style={{ height: "130px" }}
                            ></div>
                        </div>

                        <div className="report-bars">
                            <div
                                className="report-bar income-bar"
                                style={{ height: "180px" }}
                            ></div>

                            <div
                                className="report-bar expense-bar"
                                style={{ height: "100px" }}
                            ></div>
                        </div>

                        <div className="report-bars">
                            <div
                                className="report-bar income-bar"
                                style={{ height: "240px" }}
                            ></div>

                            <div
                                className="report-bar expense-bar"
                                style={{ height: "140px" }}
                            ></div>
                        </div>

                    </div>

                    <div className="report-legend">

                        <span>
                            <i className="income-dot"></i>
                            Income
                        </span>

                        <span>
                            <i className="expense-dot"></i>
                            Expenses
                        </span>

                    </div>

                </div>

                {/* Spending Summary */}
                <div className="report-box spending-box">

                    <h3>Spending Summary</h3>
                    <p>Where your money goes</p>

                    <div className="spending-item">
                        <div className="spending-info">
                            <span>Food</span>
                            <strong>$850</strong>
                        </div>

                        <div className="progress">
                            <div style={{ width: "75%" }}></div>
                        </div>
                    </div>

                    <div className="spending-item">
                        <div className="spending-info">
                            <span>Transport</span>
                            <strong>$520</strong>
                        </div>

                        <div className="progress">
                            <div style={{ width: "55%" }}></div>
                        </div>
                    </div>

                    <div className="spending-item">
                        <div className="spending-info">
                            <span>Bills</span>
                            <strong>$430</strong>
                        </div>

                        <div className="progress">
                            <div style={{ width: "45%" }}></div>
                        </div>
                    </div>

                    <div className="spending-item">
                        <div className="spending-info">
                            <span>Shopping</span>
                            <strong>$310</strong>
                        </div>

                        <div className="progress">
                            <div style={{ width: "35%" }}></div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Reports;