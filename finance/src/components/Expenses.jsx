import React, { useEffect, useRef, useState } from "react";
import {
    FaMoneyBillWave,
    FaShoppingCart,
    FaHome,
    FaCar,
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaTimes
} from "react-icons/fa";

import { useCurrency } from "./CurrencyContext";

import "./Expenses.css";

const API_URL = "http://localhost:5000";

function Expenses() {
    const [expenses, setExpenses] = useState([]);

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const formSectionRef = useRef(null);

    const [formData, setFormData] = useState({
        category: "Food",
        description: "",
        amount: "",
        status: "Paid"
    });

    const { formatAmount } = useCurrency();


    // ==========================================
    // SCROLL TO FORM
    // ==========================================

    const scrollToForm = () => {
        setTimeout(() => {
            if (formSectionRef.current) {
                formSectionRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        }, 50);
    };


    // ==========================================
    // LOAD EXPENSES
    // ==========================================

    const loadExpenses = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/expenses`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load expenses"
                );
            }

            setExpenses(
                Array.isArray(data)
                    ? data
                    : data.expenses || []
            );

        } catch (error) {
            console.error(
                "Load expenses error:",
                error
            );

            setError(
                "Failed to load expenses from the server."
            );

        } finally {
            setLoading(false);
        }
    };


    // ==========================================
    // LOAD WHEN PAGE OPENS
    // ==========================================

    useEffect(() => {
        loadExpenses();
    }, []);


    // ==========================================
    // TOTAL EXPENSES
    // ==========================================

    const totalExpenses = expenses.reduce(
        (total, expense) =>
            total + Number(expense.amount || 0),
        0
    );


    // ==========================================
    // THIS MONTH'S EXPENSES
    // ==========================================

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthExpenses = expenses
        .filter((expense) => {
            if (!expense.date) {
                return false;
            }

            const expenseDate =
                new Date(expense.date);

            return (
                expenseDate.getMonth() === currentMonth &&
                expenseDate.getFullYear() === currentYear
            );
        })
        .reduce(
            (total, expense) =>
                total + Number(expense.amount || 0),
            0
        );


    // ==========================================
    // LARGEST EXPENSE
    // ==========================================

    const largestExpense =
        expenses.length > 0
            ? expenses.reduce(
                (largest, expense) =>
                    Number(expense.amount) >
                    Number(largest.amount)
                        ? expense
                        : largest,
                expenses[0]
            )
            : null;


    // ==========================================
    // FILTER EXPENSES
    // ==========================================

    const filteredExpenses =
        expenses.filter((expense) => {
            const category =
                String(
                    expense.category || ""
                ).toLowerCase();

            const description =
                String(
                    expense.name || ""
                ).toLowerCase();

            const searchTerm =
                search.toLowerCase();

            return (
                category.includes(searchTerm) ||
                description.includes(searchTerm)
            );
        });


    // ==========================================
    // HANDLE FORM INPUT
    // ==========================================

    const handleChange = (e) => {
        const {
            name,
            value
        } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };


    // ==========================================
    // OPEN ADD FORM
    // ==========================================

    const openAddForm = () => {
        setEditingId(null);

        setFormData({
            category: "Food",
            description: "",
            amount: "",
            status: "Paid"
        });

        setError("");

        setShowForm(true);

        scrollToForm();
    };


    // ==========================================
    // OPEN EDIT FORM
    // ==========================================

    const editExpense = (expense) => {
        if (!expense || !expense.id) {
            setError("Invalid expense selected.");
            return;
        }

        setEditingId(expense.id);

        setFormData({
            category: expense.category || "Food",
            description: expense.name || "",
            amount: expense.amount ?? "",
            status: expense.status || "Paid"
        });

        setError("");

        setShowForm(true);

        scrollToForm();
    };


    // ==========================================
    // CLOSE FORM
    // ==========================================

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);

        setFormData({
            category: "Food",
            description: "",
            amount: "",
            status: "Paid"
        });
    };


    // ==========================================
    // SAVE EXPENSE
    // ADD OR UPDATE
    // ==========================================

    const saveExpense = async (e) => {
        e.preventDefault();

        if (
            !formData.description.trim() ||
            !formData.amount ||
            Number(formData.amount) <= 0
        ) {
            setError(
                "Please enter a description and a valid amount."
            );
            return;
        }

        try {
            setSaving(true);
            setError("");

            const isEditing = editingId !== null;

            const url = isEditing
                ? `${API_URL}/expenses/${editingId}`
                : `${API_URL}/expenses`;

            const method = isEditing
                ? "PUT"
                : "POST";

            const body = {
                name: formData.description.trim(),
                category: formData.category,
                amount: Number(formData.amount),
                status: formData.status
            };

            // Only add today's date when creating
            if (!isEditing) {
                body.date = new Date()
                    .toISOString()
                    .split("T")[0];
            }

            const response = await fetch(
                url,
                {
                    method,
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    (
                        isEditing
                            ? "Failed to update expense"
                            : "Failed to add expense"
                    )
                );
            }

            // Reload database data
            await loadExpenses();

            // Close and reset form
            closeForm();

        } catch (error) {
            console.error(
                "Save expense error:",
                error
            );

            setError(
                error.message ||
                "Failed to save expense."
            );

        } finally {
            setSaving(false);
        }
    };


    // ==========================================
    // DELETE EXPENSE
    // ==========================================

    const deleteExpense = async (id) => {
        if (!id) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this expense? It will be moved to Delete History."
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `${API_URL}/expenses/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete expense"
                );
            }

            setExpenses(
                (currentExpenses) =>
                    currentExpenses.filter(
                        (expense) =>
                            expense.id !== id
                    )
            );

        } catch (error) {
            console.error(
                "Delete expense error:",
                error
            );

            setError(
                error.message ||
                "Failed to delete expense."
            );
        }
    };


    return (
        <div className="expenses-page">

            {/* HEADER */}

            <div className="expenses-header">

                <div>
                    <h1>
                        Expenses
                    </h1>

                    <p>
                        Track and manage your spending
                    </p>
                </div>

                <button
                    type="button"
                    className="add-expense-btn"
                    onClick={openAddForm}
                >
                    <FaPlus />
                    Add Expense
                </button>

            </div>


            {/* ERROR */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* FORM */}

            {showForm && (
                <div
                    className="expense-form-section"
                    ref={formSectionRef}
                >

                    <div className="expense-form-header">

                        <div>
                            <h2>
                                {editingId
                                    ? "Edit Expense"
                                    : "Add New Expense"}
                            </h2>

                            <p>
                                {editingId
                                    ? "Update the details of your expense"
                                    : "Enter the details of your expense"}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="close-form-btn"
                            onClick={closeForm}
                            aria-label="Close expense form"
                        >
                            <FaTimes />
                        </button>

                    </div>


                    <form
                        className="expense-form"
                        onSubmit={saveExpense}
                    >

                        {/* CATEGORY */}

                        <div className="form-group">

                            <label>
                                Category
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="Housing">
                                    Housing
                                </option>

                                <option value="Food">
                                    Food
                                </option>

                                <option value="Transport">
                                    Transport
                                </option>

                                <option value="Shopping">
                                    Shopping
                                </option>

                                <option value="Entertainment">
                                    Entertainment
                                </option>

                                <option value="Health">
                                    Health
                                </option>

                                <option value="Education">
                                    Education
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>

                        </div>


                        {/* DESCRIPTION */}

                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <input
                                type="text"
                                name="description"
                                placeholder="e.g. Grocery shopping"
                                value={formData.description}
                                onChange={handleChange}
                            />

                        </div>


                        {/* AMOUNT */}

                        <div className="form-group">

                            <label>
                                Amount
                            </label>

                            <input
                                type="number"
                                name="amount"
                                placeholder="Enter amount"
                                min="0"
                                value={formData.amount}
                                onChange={handleChange}
                            />

                        </div>


                        {/* STATUS */}

                        <div className="form-group">

                            <label>
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Paid">
                                    Paid
                                </option>

                                <option value="Pending">
                                    Pending
                                </option>
                            </select>

                        </div>


                        {/* BUTTONS */}

                        <div className="expense-form-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={closeForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-expense-btn"
                                disabled={saving}
                            >
                                {saving ? (
                                    "Saving..."
                                ) : (
                                    <>
                                        {editingId
                                            ? <FaEdit />
                                            : <FaPlus />
                                        }

                                        {editingId
                                            ? "Save Changes"
                                            : "Add Expense"
                                        }
                                    </>
                                )}
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* SUMMARY CARDS */}

            <div className="expense-cards">

                <div className="expense-card">

                    <div className="expense-icon">
                        <FaMoneyBillWave />
                    </div>

                    <div>
                        <p>
                            Total Expenses
                        </p>

                        <h2>
                            {formatAmount(
                                totalExpenses
                            )}
                        </h2>

                        <span className="negative">
                            Current total
                        </span>
                    </div>

                </div>


                <div className="expense-card">

                    <div className="expense-icon">
                        <FaShoppingCart />
                    </div>

                    <div>
                        <p>
                            This Month
                        </p>

                        <h2>
                            {formatAmount(
                                thisMonthExpenses
                            )}
                        </h2>

                        <span className="negative">
                            Current month
                        </span>
                    </div>

                </div>


                <div className="expense-card">

                    <div className="expense-icon">
                        <FaHome />
                    </div>

                    <div>
                        <p>
                            Largest Expense
                        </p>

                        <h2>
                            {largestExpense
                                ? formatAmount(
                                    largestExpense.amount
                                )
                                : formatAmount(0)
                            }
                        </h2>

                        <span>
                            {largestExpense
                                ? largestExpense.category
                                : "No expenses"
                            }
                        </span>
                    </div>

                </div>

            </div>


            {/* EXPENSE CATEGORIES */}

            <div className="expense-section">

                <div className="section-header">

                    <div>
                        <h2>
                            Expense Categories
                        </h2>

                        <p>
                            Where your money is going
                        </p>
                    </div>

                </div>


                <div className="expense-categories">

                    {/* HOUSING */}

                    <div className="expense-category">

                        <div className="category-icon">
                            <FaHome />
                        </div>

                        <div>
                            <h3>
                                Housing
                            </h3>

                            <p>
                                Rent and utilities
                            </p>
                        </div>

                        <strong>
                            {formatAmount(
                                expenses
                                    .filter(
                                        (expense) =>
                                            expense.category ===
                                            "Housing"
                                    )
                                    .reduce(
                                        (total, expense) =>
                                            total +
                                            Number(
                                                expense.amount
                                            ),
                                        0
                                    )
                            )}
                        </strong>

                    </div>


                    {/* FOOD */}

                    <div className="expense-category">

                        <div className="category-icon">
                            <FaShoppingCart />
                        </div>

                        <div>
                            <h3>
                                Food
                            </h3>

                            <p>
                                Groceries and meals
                            </p>
                        </div>

                        <strong>
                            {formatAmount(
                                expenses
                                    .filter(
                                        (expense) =>
                                            expense.category ===
                                            "Food"
                                    )
                                    .reduce(
                                        (total, expense) =>
                                            total +
                                            Number(
                                                expense.amount
                                            ),
                                        0
                                    )
                            )}
                        </strong>

                    </div>


                    {/* TRANSPORT */}

                    <div className="expense-category">

                        <div className="category-icon">
                            <FaCar />
                        </div>

                        <div>
                            <h3>
                                Transport
                            </h3>

                            <p>
                                Fuel and transportation
                            </p>
                        </div>

                        <strong>
                            {formatAmount(
                                expenses
                                    .filter(
                                        (expense) =>
                                            expense.category ===
                                            "Transport"
                                    )
                                    .reduce(
                                        (total, expense) =>
                                            total +
                                            Number(
                                                expense.amount
                                            ),
                                        0
                                    )
                            )}
                        </strong>

                    </div>


                    {/* SHOPPING */}

                    <div className="expense-category">

                        <div className="category-icon">
                            <FaShoppingCart />
                        </div>

                        <div>
                            <h3>
                                Shopping
                            </h3>

                            <p>
                                Clothes and personal items
                            </p>
                        </div>

                        <strong>
                            {formatAmount(
                                expenses
                                    .filter(
                                        (expense) =>
                                            expense.category ===
                                            "Shopping"
                                    )
                                    .reduce(
                                        (total, expense) =>
                                            total +
                                            Number(
                                                expense.amount
                                            ),
                                        0
                                    )
                            )}
                        </strong>

                    </div>

                </div>

            </div>


            {/* EXPENSE HISTORY */}

            <div className="expense-section">

                <div className="section-header">

                    <div>
                        <h2>
                            Expense History
                        </h2>

                        <p>
                            Recent expenses
                        </p>
                    </div>


                    <div className="search-box">

                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>


                {/* TABLE */}

                <div className="expense-table-container">

                    <table className="expense-table">

                        <thead>

                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>
                                    <td
                                        colSpan="6"
                                        className="empty"
                                    >
                                        Loading expenses...
                                    </td>
                                </tr>

                            ) : filteredExpenses.length > 0 ? (

                                filteredExpenses.map(
                                    (expense) => (

                                        <tr
                                            key={expense.id}
                                        >

                                            <td>
                                                {expense.date
                                                    ? new Date(
                                                        expense.date
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "2-digit",
                                                            year: "numeric"
                                                        }
                                                    )
                                                    : "-"
                                                }
                                            </td>


                                            <td>
                                                <strong>
                                                    {expense.category}
                                                </strong>
                                            </td>


                                            <td>
                                                {expense.name}
                                            </td>


                                            <td className="expense-amount">
                                                {formatAmount(
                                                    Number(
                                                        expense.amount
                                                    )
                                                )}
                                            </td>


                                            <td>
                                                <span className="paid-status">
                                                    {expense.status ||
                                                        "Paid"}
                                                </span>
                                            </td>


                                            <td>

                                                <div className="actions">

                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            editExpense(
                                                                expense
                                                            )
                                                        }
                                                        title="Edit expense"
                                                        aria-label="Edit expense"
                                                    >
                                                        <FaEdit />
                                                    </button>


                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            deleteExpense(
                                                                expense.id
                                                            )
                                                        }
                                                        title="Delete expense"
                                                        aria-label="Delete expense"
                                                    >
                                                        <FaTrash />
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
                                        No expenses found
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

export default Expenses;