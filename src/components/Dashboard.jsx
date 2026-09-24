
import React, { useEffect, useState } from "react";
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

    // Currency
    const [currency, setCurrency] = useState(
        localStorage.getItem("currency") || "USD"
    );

    // Transactions from API
    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Update currency when Settings changes
    useEffect(() => {

        const updateCurrency = () => {
            setCurrency(
                localStorage.getItem("currency") || "USD"
            );
        };

        window.addEventListener(
            "currencyChanged",
            updateCurrency
        );

        return () => {
            window.removeEventListener(
                "currencyChanged",
                updateCurrency
            );
        };

    }, []);


    // Fetch transactions
    const fetchTransactions = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/transactions"
            );

            const contentType =
                response.headers.get("content-type") || "";

            let data = [];

            if (contentType.includes("application/json")) {

                try {
                    data = await response.json();
                } catch {
                    data = [];
                }

            } else {

                try {
                    await response.text();
                } catch {
                    // Ignore invalid response
                }

                data = [];
            }


            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Failed to fetch transactions"
                );

            }


            if (Array.isArray(data)) {
                setTransactions(data);
            } else {
                setTransactions([]);
            }

        } catch (error) {

            console.error(
                "Dashboard transaction error:",
                error
            );

            setError(
                error.message ||
                "Unable to load transactions"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        fetchTransactions();
    }, []);


    // Format money
    const formatAmount = (amount) => {

        const number = Number(amount) || 0;

        return `${currency} ${number.toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;

    };


    // Calculate totals
    const totalIncome = transactions
        .filter(
            (transaction) =>
                transaction.type?.toLowerCase() === "income"
        )
        .reduce(
            (total, transaction) =>
                total + (Number(transaction.amount) || 0),
            0
        );


    const totalExpenses = transactions
        .filter(
            (transaction) =>
                transaction.type?.toLowerCase() === "expense"
        )
        .reduce(
            (total, transaction) =>
                total + (Number(transaction.amount) || 0),
            0
        );


    const totalBalance =
        totalIncome - totalExpenses;


    // ------------------------------------------------
    // DYNAMIC MONTHLY CHART DATA
    // ------------------------------------------------

    const currentYear = new Date().getFullYear();

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];


    const monthlyData = months.map(
        (month, monthIndex) => {

            const monthTransactions =
                transactions.filter((transaction) => {

                    if (!transaction.date) {
                        return false;
                    }

                    const date =
                        new Date(transaction.date);

                    return (
                        date.getFullYear() === currentYear &&
                        date.getMonth() === monthIndex
                    );

                });


            const income =
                monthTransactions
                    .filter(
                        (transaction) =>
                            transaction.type?.toLowerCase() ===
                            "income"
                    )
                    .reduce(
                        (total, transaction) =>
                            total +
                            (Number(transaction.amount) || 0),
                        0
                    );


            const expense =
                monthTransactions
                    .filter(
                        (transaction) =>
                            transaction.type?.toLowerCase() ===
                            "expense"
                    )
                    .reduce(
                        (total, transaction) =>
                            total +
                            (Number(transaction.amount) || 0),
                        0
                    );


            return {
                month,
                income,
                expense
            };

        }
    );


    // Find largest value for chart scaling
    const largestChartValue = Math.max(
        ...monthlyData.flatMap(
            (item) => [
                item.income,
                item.expense
            ]
        ),
        1
    );


    // Maximum chart height
    const MAX_BAR_HEIGHT = 235;


    // Calculate bar height
    const getBarHeight = (amount) => {

        if (!amount) {
            return 0;
        }

        return Math.max(
            8,
            (amount / largestChartValue) *
            MAX_BAR_HEIGHT
        );

    };


    // Search transactions
    const filteredTransactions = transactions
        .filter((transaction) =>
            (transaction.name || "")
                .toLowerCase()
                .includes(
                    (searchTerm || "").toLowerCase()
                )
        )
        .slice(0, 6);


    // Format transaction date
    const formatDate = (date) => {

        if (!date) return "";

        const transactionDate =
            new Date(date);

        if (Number.isNaN(transactionDate.getTime())) {
            return date;
        }

        return transactionDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    };


    return (

        <div className="dashboard">

            {/* Header */}
            <div className="dashboard-header">

                <div>

                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Welcome back! Here's your
                        financial overview.
                    </p>

                </div>

            </div>


            {/* Error */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* Summary Cards */}
            <div className="summary-cards">

                {/* Income */}
                <div className="summary-card">

                    <div className="card-icon income">
                        <FaArrowUp />
                    </div>

                    <div>

                        <p>
                            Total Income
                        </p>

                        <h2>
                            {formatAmount(totalIncome)}
                        </h2>

                        <span className="positive">
                            Income
                        </span>

                    </div>

                </div>


                {/* Expenses */}
                <div className="summary-card">

                    <div className="card-icon expense">
                        <FaArrowDown />
                    </div>

                    <div>

                        <p>
                            Total Expenses
                        </p>

                        <h2>
                            {formatAmount(totalExpenses)}
                        </h2>

                        <span className="negative">
                            Expenses
                        </span>

                    </div>

                </div>


                {/* Balance */}
                <div className="summary-card">

                    <div className="card-icon balance">
                        <FaWallet />
                    </div>

                    <div>

                        <p>
                            Total Balance
                        </p>

                        <h2>
                            {formatAmount(totalBalance)}
                        </h2>

                        <span className="positive">
                            Income - Expenses
                        </span>

                    </div>

                </div>


                {/* Savings */}
                <div className="summary-card">

                    <div className="card-icon savings">
                        <FaMoneyBillWave />
                    </div>

                    <div>

                        <p>
                            Total Savings
                        </p>

                        <h2>
                            {formatAmount(
                                Math.max(
                                    totalBalance,
                                    0
                                )
                            )}
                        </h2>

                        <span className="positive">
                            Current savings
                        </span>

                    </div>

                </div>

            </div>


            {/* Dashboard Grid */}
            <div className="dashboard-grid">


                {/* Dynamic Chart */}
                <div className="dashboard-card chart-card">

                    <div className="card-header">

                        <div>

                            <h3>
                                Income & Expenses
                            </h3>

                            <p>
                                Monthly financial overview
                            </p>

                        </div>

                        <FaChartLine
                            className="chart-icon"
                        />

                    </div>


                    <div className="chart">

                        <div className="chart-bars">

                            {monthlyData.map(
                                (item) => (

                                    <div
                                        className="bar-group"
                                        key={item.month}
                                    >

                                        {/* Income */}
                                        <div
                                            className="bar income-bar"
                                            style={{
                                                height: `${getBarHeight(
                                                    item.income
                                                )}px`
                                            }}
                                            title={`Income: ${formatAmount(
                                                item.income
                                            )}`}
                                        ></div>


                                        {/* Expense */}
                                        <div
                                            className="bar expense-bar"
                                            style={{
                                                height: `${getBarHeight(
                                                    item.expense
                                                )}px`
                                            }}
                                            title={`Expenses: ${formatAmount(
                                                item.expense
                                            )}`}
                                        ></div>


                                        <span>
                                            {item.month}
                                        </span>

                                    </div>

                                )
                            )}

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

                            <h3>
                                Recent Transactions
                            </h3>

                            <p>

                                {searchTerm
                                    ? `Search results for "${searchTerm}"`
                                    : "Your latest transactions"
                                }

                            </p>

                        </div>


                        <Link
                            to="/transactions"
                            className="view-all-btn"
                        >
                            View All
                        </Link>

                    </div>


                    <div className="transactions">

                        {loading ? (

                            <div className="no-transactions">

                                <p>
                                    Loading transactions...
                                </p>

                            </div>

                        ) : filteredTransactions.length > 0 ? (

                            filteredTransactions.map(
                                (transaction) => {

                                    const type =
                                        transaction.type?.toLowerCase();

                                    const amount =
                                        Number(
                                            transaction.amount
                                        ) || 0;

                                    return (

                                        <div
                                            className="transaction"
                                            key={transaction.id}
                                        >

                                            <div
                                                className={`transaction-icon ${type}`}
                                            >

                                                {type === "income"
                                                    ? <FaArrowUp />
                                                    : <FaArrowDown />
                                                }

                                            </div>


                                            <div className="transaction-info">

                                                <h4>
                                                    {transaction.name ||
                                                        "Unnamed transaction"}
                                                </h4>

                                                <p>
                                                    {formatDate(
                                                        transaction.date
                                                    )}
                                                </p>

                                            </div>


                                            <strong
                                                className={
                                                    type === "income"
                                                        ? "positive"
                                                        : "negative"
                                                }
                                            >

                                                {type === "income"
                                                    ? `+${formatAmount(
                                                        amount
                                                    )}`
                                                    : `-${formatAmount(
                                                        amount
                                                    )}`
                                                }

                                            </strong>

                                        </div>

                                    );

                                }
                            )

                        ) : (

                            <div className="no-transactions">

                                <p>
                                    No transactions found.
                                </p>

                                <small>
                                    Add a transaction to see
                                    it here.
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

