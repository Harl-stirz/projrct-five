import React from "react";
import { Link } from "react-router-dom";

import {
    FaMoneyBillWave,
    FaWallet,
    FaChartLine,
    FaArrowUp,
    FaArrowDown
} from "react-icons/fa";

import "./Dashboard.css";

function Dashboard({ searchTerm }) {

    const transactions = [
        {
            name: "Salary",
            date: "August 10, 2026",
            amount: "+$3,500",
            type: "income"
        },
        {
            name: "Groceries",
            date: "August 9, 2026",
            amount: "-$180",
            type: "expense"
        },
        {
            name: "Electricity Bill",
            date: "August 7, 2026",
            amount: "-$95",
            type: "expense"
        },
        {
            name: "Freelance Work",
            date: "August 5, 2026",
            amount: "+$750",
            type: "income"
        },
        {
            name: "Transport",
            date: "August 4, 2026",
            amount: "-$60",
            type: "expense"
        },
        {
            name: "Online Shopping",
            date: "August 2, 2026",
            amount: "-$230",
            type: "expense"
        }
    ];

    const filteredTransactions = transactions.filter((transaction) =>
        transaction.name
            .toLowerCase()
            .includes((searchTerm || "").toLowerCase())
    );

    return (
        <div className="dashboard">

            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>
                        Welcome back! Here's your financial overview.
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">

                {/* Income */}
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

                {/* Expenses */}
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

                {/* Balance */}
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

                {/* Savings */}
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

            {/* Dashboard Grid */}
            <div className="dashboard-grid">

                {/* Chart */}
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
                                <div
                                    className="bar income-bar"
                                    style={{ height: "150px" }}
                                ></div>

                                <div
                                    className="bar expense-bar"
                                    style={{ height: "90px" }}
                                ></div>

                                <span>Jan</span>
                            </div>

                            <div className="bar-group">
                                <div
                                    className="bar income-bar"
                                    style={{ height: "180px" }}
                                ></div>

                                <div
                                    className="bar expense-bar"
                                    style={{ height: "110px" }}
                                ></div>

                                <span>Feb</span>
                            </div>

                            <div className="bar-group">
                                <div
                                    className="bar income-bar"
                                    style={{ height: "135px" }}
                                ></div>

                                <div
                                    className="bar expense-bar"
                                    style={{ height: "80px" }}
                                ></div>

                                <span>Mar</span>
                            </div>

                            <div className="bar-group">
                                <div
                                    className="bar income-bar"
                                    style={{ height: "210px" }}
                                ></div>

                                <div
                                    className="bar expense-bar"
                                    style={{ height: "125px" }}
                                ></div>

                                <span>Apr</span>
                            </div>

                            <div className="bar-group">
                                <div
                                    className="bar income-bar"
                                    style={{ height: "170px" }}
                                ></div>

                                <div
                                    className="bar expense-bar"
                                    style={{ height: "100px" }}
                                ></div>

                                <span>May</span>
                            </div>

                            <div className="bar-group">
                                <div
                                    className="bar income-bar"
                                    style={{ height: "235px" }}
                                ></div>

                                <div
                                    className="bar expense-bar"
                                    style={{ height: "140px" }}
                                ></div>

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

                            <p>
                                {searchTerm
                                    ? `Search results for "${searchTerm}"`
                                    : "Your latest transactions"
                                }
                            </p>
                        </div>

                        {/* View All Button */}
                        <Link
                            to="/transactions"
                            className="view-all-btn"
                        >
                            View All
                        </Link>

                    </div>

                    <div className="transactions">

                        {filteredTransactions.length > 0 ? (

                            filteredTransactions.map(
                                (transaction, index) => (

                                    <div
                                        className="transaction"
                                        key={index}
                                    >

                                        <div
                                            className={`transaction-icon ${transaction.type}`}
                                        >
                                            {transaction.type === "income"
                                                ? <FaArrowUp />
                                                : <FaArrowDown />
                                            }
                                        </div>

                                        <div className="transaction-info">

                                            <h4>
                                                {transaction.name}
                                            </h4>

                                            <p>
                                                {transaction.date}
                                            </p>

                                        </div>

                                        <strong
                                            className={
                                                transaction.type === "income"
                                                    ? "positive"
                                                    : "negative"
                                            }
                                        >
                                            {transaction.amount}
                                        </strong>

                                    </div>

                                )
                            )

                        ) : (

                            <div className="no-transactions">
                                <p>No transactions found.</p>

                                <small>
                                    Try searching for Salary, Groceries,
                                    Transport or Shopping.
                                </small>
                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;