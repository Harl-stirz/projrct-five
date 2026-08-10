
import React, { useState } from "react";
import {
    FaArrowUp,
    FaArrowDown,
    FaSearch,
    FaFilter,
    FaMoneyBillWave,
    FaWallet
} from "react-icons/fa";

import "./Transactions.css";

function Transactions() {

    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");

    const transactions = [
        {
            name: "Salary",
            category: "Salary",
            date: "August 10, 2026",
            amount: 3500,
            type: "Income"
        },
        {
            name: "Groceries",
            category: "Food",
            date: "August 9, 2026",
            amount: 180,
            type: "Expense"
        },
        {
            name: "Electricity Bill",
            category: "Bills",
            date: "August 7, 2026",
            amount: 95,
            type: "Expense"
        },
        {
            name: "Freelance Work",
            category: "Freelance",
            date: "August 5, 2026",
            amount: 750,
            type: "Income"
        },
        {
            name: "Transport",
            category: "Transport",
            date: "August 4, 2026",
            amount: 60,
            type: "Expense"
        },
        {
            name: "Online Shopping",
            category: "Shopping",
            date: "August 2, 2026",
            amount: 230,
            type: "Expense"
        },
        {
            name: "Restaurant",
            category: "Food",
            date: "August 1, 2026",
            amount: 120,
            type: "Expense"
        }
    ];

    const filteredTransactions = transactions.filter((transaction) => {

        const matchesSearch =
            transaction.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            transaction.category
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesFilter =
            filter === "All" ||
            transaction.type === filter;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="transactions-page">

            {/* Header */}
            <div className="transactions-header">

                <div>
                    <h1>Transaction History</h1>
                    <p>
                        View and manage all your financial transactions.
                    </p>
                </div>

                <button className="add-transaction-btn">
                    + Add Transaction
                </button>

            </div>


            {/* Summary Cards */}
            <div className="transaction-summary">

                <div className="transaction-summary-card">

                    <div className="summary-icon income">
                        <FaArrowUp />
                    </div>

                    <div>
                        <p>Total Income</p>
                        <h2>$4,250.00</h2>
                    </div>

                </div>


                <div className="transaction-summary-card">

                    <div className="summary-icon expense">
                        <FaArrowDown />
                    </div>

                    <div>
                        <p>Total Expenses</p>
                        <h2>$685.00</h2>
                    </div>

                </div>


                <div className="transaction-summary-card">

                    <div className="summary-icon balance">
                        <FaWallet />
                    </div>

                    <div>
                        <p>Net Balance</p>
                        <h2>$3,565.00</h2>
                    </div>

                </div>


                <div className="transaction-summary-card">

                    <div className="summary-icon savings">
                        <FaMoneyBillWave />
                    </div>

                    <div>
                        <p>Transactions</p>
                        <h2>{transactions.length}</h2>
                    </div>

                </div>

            </div>


            {/* Transaction Box */}
            <div className="transaction-box">

                {/* Toolbar */}
                <div className="transaction-toolbar">

                    <div className="transaction-search">

                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />

                    </div>


                    <div className="transaction-filter">

                        <FaFilter />

                        <select
                            value={filter}
                            onChange={(e) =>
                                setFilter(e.target.value)
                            }
                        >
                            <option value="All">
                                All Transactions
                            </option>

                            <option value="Income">
                                Income
                            </option>

                            <option value="Expense">
                                Expenses
                            </option>
                        </select>

                    </div>

                </div>


                {/* Table */}
                <div className="transaction-table-wrapper">

                    <table className="transaction-table">

                        <thead>
                            <tr>
                                <th>Transaction</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Amount</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredTransactions.length > 0 ? (

                                filteredTransactions.map(
                                    (transaction, index) => (

                                        <tr key={index}>

                                            <td>
                                                <div className="table-transaction">

                                                    <div
                                                        className={`table-icon ${
                                                            transaction.type === "Income"
                                                                ? "income"
                                                                : "expense"
                                                        }`}
                                                    >
                                                        {transaction.type === "Income"
                                                            ? <FaArrowUp />
                                                            : <FaArrowDown />
                                                        }
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {transaction.name}
                                                        </strong>

                                                        <span>
                                                            Transaction #{index + 1001}
                                                        </span>
                                                    </div>

                                                </div>
                                            </td>


                                            <td>
                                                <span className="category">
                                                    {transaction.category}
                                                </span>
                                            </td>


                                            <td>
                                                <span className="date">
                                                    {transaction.date}
                                                </span>
                                            </td>


                                            <td>

                                                <span
                                                    className={`type ${
                                                        transaction.type === "Income"
                                                            ? "income-type"
                                                            : "expense-type"
                                                    }`}
                                                >
                                                    {transaction.type}
                                                </span>

                                            </td>


                                            <td>

                                                <strong
                                                    className={
                                                        transaction.type === "Income"
                                                            ? "amount income-amount"
                                                            : "amount expense-amount"
                                                    }
                                                >
                                                    {transaction.type === "Income"
                                                        ? "+"
                                                        : "-"
                                                    }
                                                    ${transaction.amount.toLocaleString()}
                                                </strong>

                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="empty-transactions"
                                    >
                                        No transactions found.

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Transactions;
