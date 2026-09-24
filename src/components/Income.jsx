
import React, { useEffect, useState } from "react";

import {
    FaMoneyBillWave,
    FaWallet,
    FaChartLine,
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaTimes,
} from "react-icons/fa";

import { useCurrency } from "./CurrencyContext";

import "./Income.css";


const API_URL = "http://localhost:5000";


const getToday = () => {

    const today = new Date();

    return today.toISOString().split("T")[0];

};


const formatDisplayDate = (date) => {

    if (!date) {
        return "";
    }

    // MySQL DATE: YYYY-MM-DD
    if (
        typeof date === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {

        const [year, month, day] =
            date.split("-");

        return new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        ).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }
        );

    }

    return new Date(date).toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }
    );

};


const formatDatabaseDate = (date) => {

    if (!date) {
        return getToday();
    }

    // Already YYYY-MM-DD
    if (
        typeof date === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
        return date;
    }

    const parsedDate =
        new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return getToday();
    }

    const year =
        parsedDate.getFullYear();

    const month =
        String(
            parsedDate.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            parsedDate.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

};


function Income() {

    const [income, setIncome] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    const [deletingId, setDeletingId] =
        useState(null);

    const [editingId, setEditingId] =
        useState(null);


    // Form data
    const [formData, setFormData] =
        useState({

            source: "Salary",

            description: "",

            amount: "",

            status: "Received",

            date: getToday(),

        });


    // Currency
    const { formatAmount } =
        useCurrency();


    // ========================================
    // FETCH INCOME
    // ========================================

    const fetchIncome = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await fetch(
                    `${API_URL}/income`
                );


            const contentType =
                response.headers.get(
                    "content-type"
                ) || "";


            let data = [];


            if (
                contentType.includes(
                    "application/json"
                )
            ) {

                data =
                    await response.json();

            }


            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Failed to fetch income"
                );

            }


            if (!Array.isArray(data)) {

                throw new Error(
                    "Invalid response from server"
                );

            }


            setIncome(data);

        } catch (error) {

            console.error(
                "Fetch income error:",
                error
            );

            setError(
                "Unable to load income. Please check that the backend is running."
            );

        } finally {

            setLoading(false);

        }

    };


    // Fetch when page loads
    useEffect(() => {

        fetchIncome();

    }, []);


    // ========================================
    // CALCULATIONS
    // ========================================

    const totalIncome =
        income.reduce(
            (total, item) =>
                total +
                Number(item.amount || 0),
            0
        );


    const now = new Date();

    const thisMonthIncome =
        income
            .filter((item) => {

                if (!item.date) {
                    return false;
                }

                const databaseDate =
                    formatDatabaseDate(
                        item.date
                    );

                const [year, month] =
                    databaseDate.split("-");

                return (
                    Number(year) ===
                        now.getFullYear() &&
                    Number(month) ===
                        now.getMonth() + 1
                );

            })
            .reduce(
                (total, item) =>
                    total +
                    Number(
                        item.amount || 0
                    ),
                0
            );


    const averageIncome =
        income.length > 0
            ? totalIncome / income.length
            : 0;


    // ========================================
    // SOURCE TOTAL
    // ========================================

    const getSourceTotal = (source) => {

        return income
            .filter(
                (item) =>
                    item.source === source
            )
            .reduce(
                (total, item) =>
                    total +
                    Number(
                        item.amount || 0
                    ),
                0
            );

    };


    // ========================================
    // SEARCH
    // ========================================

    const filteredIncome =
        income.filter((item) => {

            const searchTerm =
                search.toLowerCase();


            return (
                String(
                    item.source || ""
                )
                    .toLowerCase()
                    .includes(searchTerm) ||

                String(
                    item.description || ""
                )
                    .toLowerCase()
                    .includes(searchTerm)
            );

        });


    // ========================================
    // FORM CHANGE
    // ========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData({
            ...formData,
            [name]: value,
        });

    };


    // ========================================
    // RESET FORM
    // ========================================

    const resetForm = () => {

        setFormData({

            source: "Salary",

            description: "",

            amount: "",

            status: "Received",

            date: getToday(),

        });

        setEditingId(null);

    };


    // ========================================
    // CLOSE FORM
    // ========================================

    const closeForm = () => {

        setShowForm(false);

        resetForm();

    };


    // ========================================
    // ADD / UPDATE INCOME
    // ========================================

    const saveIncome = async (e) => {

        e.preventDefault();


        if (
            !formData.source ||
            !formData.amount ||
            Number(formData.amount) <= 0
        ) {

            alert(
                "Please enter a source and a valid amount."
            );

            return;

        }


        try {

            setSaving(true);


            const isEditing =
                editingId !== null;


            const url =
                isEditing
                    ? `${API_URL}/income/${editingId}`
                    : `${API_URL}/income`;


            const method =
                isEditing
                    ? "PUT"
                    : "POST";


            const response =
                await fetch(
                    url,
                    {
                        method,
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({

                            source:
                                formData.source,

                            description:
                                formData.description.trim(),

                            date:
                                formData.date ||
                                getToday(),

                            amount:
                                Number(
                                    formData.amount
                                ),

                            status:
                                formData.status,

                        }),
                    }
                );


            const contentType =
                response.headers.get(
                    "content-type"
                ) || "";


            let data = {};


            if (
                contentType.includes(
                    "application/json"
                )
            ) {

                data =
                    await response.json();

            }


            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    `Failed to ${
                        isEditing
                            ? "update"
                            : "add"
                    } income`
                );

            }


            // Reload from database
            await fetchIncome();


            // Tell Dashboard that income changed
            window.dispatchEvent(
                new Event(
                    "financeChanged"
                )
            );


            resetForm();

            setShowForm(false);


            alert(
                isEditing
                    ? "Income updated successfully!"
                    : "Income added successfully!"
            );


        } catch (error) {

            console.error(
                "Save income error:",
                error
            );


            alert(
                error.message ||
                "Failed to save income"
            );

        } finally {

            setSaving(false);

        }

    };


    // ========================================
    // START EDIT
    // ========================================

    const editIncome = (item) => {

        setEditingId(item.id);


        setFormData({

            source:
                item.source ||
                "Salary",

            description:
                item.description ||
                "",

            amount:
                item.amount ?? "",

            status:
                item.status ||
                "Received",

            date:
                formatDatabaseDate(
                    item.date
                ),

        });


        setShowForm(true);

    };


    // ========================================
    // DELETE INCOME
    // ========================================

    const deleteIncome = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this income?\n\nIt will be moved to Delete History and can be restored within 30 days."
            );


        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(id);


            const response =
                await fetch(
                    `${API_URL}/income/${id}`,
                    {
                        method: "DELETE",
                    }
                );


            const contentType =
                response.headers.get(
                    "content-type"
                ) || "";


            let data = {};


            if (
                contentType.includes(
                    "application/json"
                )
            ) {

                data =
                    await response.json();

            }


            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Failed to delete income"
                );

            }


            // Reload income
            await fetchIncome();


            // Tell other pages that finance data changed
            window.dispatchEvent(
                new Event(
                    "financeChanged"
                )
            );


            alert(
                "Income moved to Delete History successfully!"
            );


        } catch (error) {

            console.error(
                "Delete income error:",
                error
            );


            alert(
                error.message ||
                "Failed to delete income"
            );

        } finally {

            setDeletingId(null);

        }

    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (

            <div className="income-page">

                <div className="income-loading">

                    Loading income...

                </div>

            </div>

        );

    }


    return (

        <div className="income-page">


            {/* Header */}

            <div className="income-header">

                <div>

                    <h1>
                        Income
                    </h1>

                    <p>
                        Track and manage all your income
                    </p>

                </div>


                <button
                    className="add-income-btn"
                    onClick={() => {

                        resetForm();

                        setShowForm(true);

                    }}
                >

                    <FaPlus />

                    Add Income

                </button>

            </div>


            {/* Error */}

            {error && (

                <div
                    style={{
                        background: "#fee2e2",
                        color: "#b91c1c",
                        padding: "15px 18px",
                        borderRadius: "10px",
                        marginBottom: "25px",
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        gap: "15px",
                    }}
                >

                    <span>
                        {error}
                    </span>


                    <button
                        type="button"
                        onClick={fetchIncome}
                        style={{
                            border: "none",
                            background:
                                "#dc2626",
                            color: "white",
                            padding:
                                "9px 16px",
                            borderRadius: "7px",
                            cursor: "pointer",
                            fontWeight: "600",
                        }}
                    >

                        Try Again

                    </button>

                </div>

            )}


            {/* Add / Edit Form */}

            {showForm && (

                <div className="income-form-section">

                    <div className="income-form-header">

                        <div>

                            <h2>

                                {editingId !== null
                                    ? "Edit Income"
                                    : "Add New Income"}

                            </h2>

                            <p>

                                {editingId !== null
                                    ? "Update the details of your income"
                                    : "Enter the details of your income"}

                            </p>

                        </div>


                        <button
                            className="close-form-btn"
                            onClick={closeForm}
                            type="button"
                        >

                            <FaTimes />

                        </button>

                    </div>


                    <form
                        className="income-form"
                        onSubmit={saveIncome}
                    >


                        {/* Source */}

                        <div className="form-group">

                            <label>
                                Income Source
                            </label>

                            <select
                                name="source"
                                value={
                                    formData.source
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="Salary">
                                    Salary
                                </option>

                                <option value="Freelance">
                                    Freelance
                                </option>

                                <option value="Business">
                                    Business
                                </option>

                                <option value="Investment">
                                    Investment
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* Description */}

                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <input
                                type="text"
                                name="description"
                                placeholder="e.g. Monthly salary"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        {/* Amount */}

                        <div className="form-group">

                            <label>
                                Amount
                            </label>

                            <input
                                type="number"
                                name="amount"
                                placeholder="Enter amount"
                                min="0"
                                value={
                                    formData.amount
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        {/* Status */}

                        <div className="form-group">

                            <label>
                                Status
                            </label>

                            <select
                                name="status"
                                value={
                                    formData.status
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="Received">
                                    Received
                                </option>

                                <option value="Pending">
                                    Pending
                                </option>

                            </select>

                        </div>


                        {/* Form Buttons */}

                        <div className="income-form-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={
                                    closeForm
                                }
                                disabled={saving}
                            >

                                Cancel

                            </button>


                            <button
                                type="submit"
                                className="save-income-btn"
                                disabled={saving}
                            >

                                {saving ? (
                                    "Saving..."
                                ) : (
                                    <>
                                        <FaPlus />

                                        {editingId !== null
                                            ? "Update Income"
                                            : "Add Income"}
                                    </>
                                )}

                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* Summary Cards */}

            <div className="income-cards">


                {/* Total Income */}

                <div className="income-card">

                    <div className="income-icon">

                        <FaMoneyBillWave />

                    </div>


                    <div>

                        <p>
                            Total Income
                        </p>

                        <h2>
                            {formatAmount(
                                totalIncome
                            )}
                        </h2>

                        <span className="positive">
                            Income entries
                        </span>

                    </div>

                </div>


                {/* This Month */}

                <div className="income-card">

                    <div className="income-icon">

                        <FaWallet />

                    </div>


                    <div>

                        <p>
                            This Month
                        </p>

                        <h2>
                            {formatAmount(
                                thisMonthIncome
                            )}
                        </h2>

                        <span className="positive">
                            Current month
                        </span>

                    </div>

                </div>


                {/* Average Income */}

                <div className="income-card">

                    <div className="income-icon">

                        <FaChartLine />

                    </div>


                    <div>

                        <p>
                            Average Income
                        </p>

                        <h2>
                            {formatAmount(
                                averageIncome
                            )}
                        </h2>

                        <span>
                            Average per income entry
                        </span>

                    </div>

                </div>

            </div>


            {/* Income Sources */}

            <div className="income-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Income Sources
                        </h2>

                        <p>
                            Where your money comes from
                        </p>

                    </div>

                </div>


                <div className="sources-grid">


                    {/* Salary */}

                    <div className="source">

                        <div>

                            <h3>
                                Salary
                            </h3>

                            <p>
                                Monthly salary
                            </p>

                        </div>

                        <strong>
                            {formatAmount(
                                getSourceTotal(
                                    "Salary"
                                )
                            )}
                        </strong>

                    </div>


                    {/* Business */}

                    <div className="source">

                        <div>

                            <h3>
                                Business
                            </h3>

                            <p>
                                Business income
                            </p>

                        </div>

                        <strong>
                            {formatAmount(
                                getSourceTotal(
                                    "Business"
                                )
                            )}
                        </strong>

                    </div>


                    {/* Investments */}

                    <div className="source">

                        <div>

                            <h3>
                                Investments
                            </h3>

                            <p>
                                Investment returns
                            </p>

                        </div>

                        <strong>
                            {formatAmount(
                                getSourceTotal(
                                    "Investment"
                                )
                            )}
                        </strong>

                    </div>


                    {/* Freelance */}

                    <div className="source">

                        <div>

                            <h3>
                                Freelance
                            </h3>

                            <p>
                                Freelance projects
                            </p>

                        </div>

                        <strong>
                            {formatAmount(
                                getSourceTotal(
                                    "Freelance"
                                )
                            )}
                        </strong>

                    </div>

                </div>

            </div>


            {/* Income History */}

            <div className="income-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Income History
                        </h2>

                        <p>
                            Recent income transactions
                        </p>

                    </div>


                    {/* Search */}

                    <div className="search-box">

                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search income..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>


                {/* Table */}

                <div className="income-table-container">

                    <table className="income-table">

                        <thead>

                            <tr>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Source
                                </th>

                                <th>
                                    Description
                                </th>

                                <th>
                                    Amount
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredIncome.length > 0 ? (

                                filteredIncome.map(
                                    (item) => (

                                        <tr
                                            key={
                                                item.id
                                            }
                                        >

                                            <td>
                                                {formatDisplayDate(
                                                    item.date
                                                )}
                                            </td>


                                            <td>

                                                <strong>
                                                    {
                                                        item.source
                                                    }
                                                </strong>

                                            </td>


                                            <td>
                                                {
                                                    item.description ||
                                                    "-"
                                                }
                                            </td>


                                            <td className="amount">

                                                {formatAmount(
                                                    Number(
                                                        item.amount
                                                    )
                                                )}

                                            </td>


                                            <td>

                                                <span className="status">

                                                    {
                                                        item.status
                                                    }

                                                </span>

                                            </td>


                                            <td>

                                                <div className="actions">

                                                    {/* Edit */}

                                                    <button
                                                        className="edit-btn"
                                                        title="Edit income"
                                                        onClick={() =>
                                                            editIncome(
                                                                item
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            item.id
                                                        }
                                                    >

                                                        <FaEdit />

                                                    </button>


                                                    {/* Delete */}

                                                    <button
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            deleteIncome(
                                                                item.id
                                                            )
                                                        }
                                                        title="Delete income"
                                                        disabled={
                                                            deletingId ===
                                                            item.id
                                                        }
                                                    >

                                                        {deletingId ===
                                                        item.id ? (
                                                            "..."
                                                        ) : (
                                                            <FaTrash />
                                                        )}

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="empty"
                                    >

                                        {search
                                            ? "No income found"
                                            : "No income records yet"}

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


export default Income;

