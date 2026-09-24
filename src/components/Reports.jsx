
import React from "react";

import {
    FaChartBar,
    FaArrowUp,
    FaArrowDown,
    FaMoneyBillWave
} from "react-icons/fa";

import { useCurrency } from "./CurrencyContext.jsx";

// import "./Reports.css";

function Reports() {

    // Get currency formatter from CurrencyContext
    const { formatAmount } = useCurrency();

    // Report data
    const totalIncome = 8450;
    const totalExpenses = 3240;
    const netSavings = 5210;

    const spending = [
        {
            name: "Food",
            amount: 850,
            width: "75%"
        },
        {
            name: "Transport",
            amount: 520,
            width: "55%"
        },
        {
            name: "Bills",
            amount: 430,
            width: "45%"
        },
        {
            name: "Shopping",
            amount: 310,
            width: "35%"
        }
    ];

    const handleExport = () => {

        const csvData =
            "Category,Amount,Type\n" +
            `Income,${totalIncome},Income\n` +
            `Expenses,${totalExpenses},Expense\n` +
            `Food,850,Expense\n` +
            `Transport,520,Expense\n` +
            `Bills,430,Expense\n` +
            `Shopping,310,Expense\n` +
            `Net Savings,${netSavings},Savings`;

        const blob = new Blob(
            [csvData],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "finance-report.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    return (
        <div className="reports">

            {/* Header */}
            <div className="reports-header">

                <div>
                    <h1>Reports</h1>

                    <p>
                        Analyze your financial performance.
                    </p>
                </div>

                <div className="report-actions">

                    <select>
                        <option>This Month</option>
                        <option>Last Month</option>
                        <option>Last 3 Months</option>
                        <option>This Year</option>
                    </select>

                    <button
                        className="export-btn"
                        onClick={handleExport}
                    >
                        Export Report
                    </button>

                </div>

            </div>


            {/* Report Cards */}
            <div className="report-cards">

                {/* Total Income */}
                <div className="report-card">

                    <div className="report-icon income">
                        <FaArrowUp />
                    </div>

                    <div>

                        <p>Total Income</p>

                        <h2>
                            {formatAmount(totalIncome)}
                        </h2>

                        <span className="positive">
                            +12.5%
                        </span>

                    </div>

                </div>


                {/* Total Expenses */}
                <div className="report-card">

                    <div className="report-icon expense">
                        <FaArrowDown />
                    </div>

                    <div>

                        <p>Total Expenses</p>

                        <h2>
                            {formatAmount(totalExpenses)}
                        </h2>

                        <span className="negative">
                            -5.2%
                        </span>

                    </div>

                </div>


                {/* Net Savings */}
                <div className="report-card">

                    <div className="report-icon balance">
                        <FaMoneyBillWave />
                    </div>

                    <div>

                        <p>Net Savings</p>

                        <h2>
                            {formatAmount(netSavings)}
                        </h2>

                        <span className="positive">
                            +8.4%
                        </span>

                    </div>

                </div>

            </div>


            {/* Main Report Content */}
            <div className="reports-content">


                {/* Financial Overview */}
                <div className="report-box">

                    <div className="report-box-header">

                        <div>

                            <h3>
                                Financial Overview
                            </h3>

                            <p>
                                Income versus expenses
                            </p>

                        </div>

                        <FaChartBar />

                    </div>


                    <div className="report-chart">

                        <div className="report-bars">

                            <div
                                className="report-bar income-bar"
                                style={{
                                    height: "150px"
                                }}
                            ></div>

                            <div
                                className="report-bar expense-bar"
                                style={{
                                    height: "90px"
                                }}
                            ></div>

                        </div>


                        <div className="report-bars">

                            <div
                                className="report-bar income-bar"
                                style={{
                                    height: "190px"
                                }}
                            ></div>

                            <div
                                className="report-bar expense-bar"
                                style={{
                                    height: "120px"
                                }}
                            ></div>

                        </div>


                        <div className="report-bars">

                            <div
                                className="report-bar income-bar"
                                style={{
                                    height: "140px"
                                }}
                            ></div>

                            <div
                                className="report-bar expense-bar"
                                style={{
                                    height: "80px"
                                }}
                            ></div>

                        </div>


                        <div className="report-bars">

                            <div
                                className="report-bar income-bar"
                                style={{
                                    height: "220px"
                                }}
                            ></div>

                            <div
                                className="report-bar expense-bar"
                                style={{
                                    height: "130px"
                                }}
                            ></div>

                        </div>


                        <div className="report-bars">

                            <div
                                className="report-bar income-bar"
                                style={{
                                    height: "180px"
                                }}
                            ></div>

                            <div
                                className="report-bar expense-bar"
                                style={{
                                    height: "100px"
                                }}
                            ></div>

                        </div>


                        <div className="report-bars">

                            <div
                                className="report-bar income-bar"
                                style={{
                                    height: "240px"
                                }}
                            ></div>

                            <div
                                className="report-bar expense-bar"
                                style={{
                                    height: "140px"
                                }}
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

                    <h3>
                        Spending Summary
                    </h3>

                    <p>
                        Where your money goes
                    </p>


                    {spending.map((item) => (

                        <div
                            className="spending-item"
                            key={item.name}
                        >

                            <div className="spending-info">

                                <span>
                                    {item.name}
                                </span>

                                <strong>
                                    {formatAmount(item.amount)}
                                </strong>

                            </div>


                            <div className="progress">

                                <div
                                    style={{
                                        width: item.width
                                    }}
                                ></div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}

export default Reports;

