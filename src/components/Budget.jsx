
import React, { useEffect, useRef, useState } from "react";

import {
    FaPiggyBank,
    FaHome,
    FaUtensils,
    FaCar,
    FaShoppingBag,
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
    FaHeartbeat,
    FaGraduationCap,
    FaFilm,
    FaWallet
} from "react-icons/fa";

import { useCurrency } from "./CurrencyContext";

import "./Budget.css";

const API_URL = "http://localhost:5000";

function Budget() {
    const { formatAmount } = useCurrency();

    // =====================================================
    // STATE
    // =====================================================

    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [budgetToDelete, setBudgetToDelete] = useState(null);

    const [deletingId, setDeletingId] = useState(null);
    const [saving, setSaving] = useState(false);

    // Reference to the edit/add form
    const formSectionRef = useRef(null);

    // =====================================================
    // FORM
    // =====================================================

    const [formData, setFormData] = useState({
        category: "Housing",
        amount: "",
        spent: ""
    });

    // =====================================================
    // CATEGORY ICONS
    // =====================================================

    const categoryIcons = {
        Housing: <FaHome />,
        Food: <FaUtensils />,
        Transport: <FaCar />,
        Shopping: <FaShoppingBag />,
        Entertainment: <FaFilm />,
        Health: <FaHeartbeat />,
        Education: <FaGraduationCap />,
        Other: <FaPiggyBank />
    };

    // =====================================================
    // GET BUDGETS
    // =====================================================

    const fetchBudgets = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/budgets`);

            const data = await response.json().catch(() => []);

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to load budgets."
                );
            }

            const budgetData = Array.isArray(data)
                ? data
                : data.budgets || [];

            setBudgets(budgetData);
        } catch (err) {
            console.error("Error loading budgets:", err);

            setError(
                err.message ||
                "Unable to load budgets from the database."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD DATABASE DATA
    // =====================================================

    useEffect(() => {
        fetchBudgets();
    }, []);

    // =====================================================
    // TOTAL BUDGET
    // =====================================================

    const totalBudget = budgets.reduce(
        (total, item) =>
            total + Number(item.amount || 0),
        0
    );

    // =====================================================
    // TOTAL SPENT
    // =====================================================

    const totalSpent = budgets.reduce(
        (total, item) =>
            total + Number(item.spent || 0),
        0
    );

    // =====================================================
    // TOTAL REMAINING
    // =====================================================

    const remaining = totalBudget - totalSpent;

    // =====================================================
    // OVERALL PERCENTAGE
    // =====================================================

    const percentage =
        totalBudget > 0
            ? Math.round(
                (totalSpent / totalBudget) * 100
            )
            : 0;

    // =====================================================
    // HANDLE FORM INPUT
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =====================================================
    // SCROLL TO FORM
    // =====================================================

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

    // =====================================================
    // OPEN ADD FORM
    // =====================================================

    const openAddForm = () => {
        setEditingId(null);

        setFormData({
            category: "Housing",
            amount: "",
            spent: ""
        });

        setError("");
        setShowForm(true);

        scrollToForm();
    };

    // =====================================================
    // OPEN EDIT FORM
    // =====================================================

    const editBudget = (item) => {
        if (!item || !item.id) {
            setError("Unable to edit this budget because its ID is missing.");
            return;
        }

        // Set the ID that will be used by PUT /budgets/:id
        setEditingId(item.id);

        // Fill the form with the selected budget
        setFormData({
            category: item.category || "Housing",
            amount:
                item.amount !== null &&
                item.amount !== undefined
                    ? String(item.amount)
                    : "",
            spent:
                item.spent !== null &&
                item.spent !== undefined
                    ? String(item.spent)
                    : ""
        });

        setError("");
        setShowForm(true);

        // Immediately move user to the edit form
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

    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);

        setFormData({
            category: "Housing",
            amount: "",
            spent: ""
        });

        setError("");
    };

    // =====================================================
    // SAVE / UPDATE BUDGET
    // =====================================================

    const saveBudget = async (e) => {
        e.preventDefault();

        setError("");

        const amount = Number(formData.amount);
        const spent = Number(formData.spent);

        // Validate amount
        if (
            formData.amount === "" ||
            Number.isNaN(amount) ||
            amount <= 0
        ) {
            setError("Please enter a valid budget amount.");
            return;
        }

        // Validate spent
        if (
            formData.spent === "" ||
            Number.isNaN(spent) ||
            spent < 0
        ) {
            setError("Please enter a valid spent amount.");
            return;
        }

        // Spent cannot be greater than budget
        if (spent > amount) {
            setError(
                "Amount spent cannot be greater than the budget."
            );
            return;
        }

        try {
            setSaving(true);

            const isEditing = editingId !== null;

            const url = isEditing
                ? `${API_URL}/budgets/${editingId}`
                : `${API_URL}/budgets`;

            const method = isEditing ? "PUT" : "POST";

            console.log(
                isEditing
                    ? `Updating budget ID: ${editingId}`
                    : "Creating new budget"
            );

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    category: formData.category,
                    amount,
                    spent
                })
            });

            const data = await response
                .json()
                .catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    (
                        isEditing
                            ? "Failed to update budget."
                            : "Failed to add budget."
                    )
                );
            }

            // Refresh database data
            await fetchBudgets();

            // Close form after successful save
            closeForm();

        } catch (err) {
            console.error("Error saving budget:", err);

            setError(
                err.message ||
                "Unable to save budget."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // OPEN DELETE MODAL
    // =====================================================

    const openDeleteModal = (item) => {
        setBudgetToDelete(item);
        setShowDeleteModal(true);
    };

    // =====================================================
    // CLOSE DELETE MODAL
    // =====================================================

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setBudgetToDelete(null);
    };

    // =====================================================
    // DELETE BUDGET
    // =====================================================

    const deleteBudget = async () => {
        if (!budgetToDelete) {
            return;
        }

        try {
            setDeletingId(budgetToDelete.id);

            const response = await fetch(
                `${API_URL}/budgets/${budgetToDelete.id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response
                .json()
                .catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to delete budget."
                );
            }

            setBudgets((prev) =>
                prev.filter(
                    (item) =>
                        item.id !== budgetToDelete.id
                )
            );

            closeDeleteModal();

        } catch (err) {
            console.error(
                "Error deleting budget:",
                err
            );

            setError(
                err.message ||
                "Unable to delete budget."
            );
        } finally {
            setDeletingId(null);
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="budget-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="budget-header">

                <div>
                    <h1>Budget</h1>

                    <p>
                        Plan and manage your monthly spending
                    </p>
                </div>

                <button
                    type="button"
                    className="add-budget-btn"
                    onClick={openAddForm}
                >
                    <FaPlus />
                    Add Budget
                </button>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="budget-error">
                    {error}
                </div>
            )}

            {/* =================================================
                ADD / EDIT FORM
            ================================================= */}

            {showForm && (
                <div
                    className="budget-form-section"
                    ref={formSectionRef}
                >

                    <div className="budget-form-header">

                        <div>

                            <h2>
                                {editingId
                                    ? "Edit Budget"
                                    : "Add New Budget"}
                            </h2>

                            <p>
                                {editingId
                                    ? "Update your budget details"
                                    : "Set a spending limit for a category"}
                            </p>

                        </div>

                        <button
                            type="button"
                            className="close-form-btn"
                            onClick={closeForm}
                            title="Close form"
                        >
                            <FaTimes />
                        </button>

                    </div>

                    <form
                        className="budget-form"
                        onSubmit={saveBudget}
                    >

                        {/* Category */}

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

                        {/* Budget Amount */}

                        <div className="form-group">

                            <label>
                                Total Budget
                            </label>

                            <input
                                type="number"
                                name="amount"
                                placeholder="Enter total budget"
                                min="0"
                                step="0.01"
                                value={formData.amount}
                                onChange={handleChange}
                            />

                        </div>

                        {/* Spent */}

                        <div className="form-group">

                            <label>
                                Amount Spent
                            </label>

                            <input
                                type="number"
                                name="spent"
                                placeholder="Enter amount spent"
                                min="0"
                                step="0.01"
                                value={formData.spent}
                                onChange={handleChange}
                            />

                        </div>

                        {/* Buttons */}

                        <div className="budget-form-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={closeForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-budget-btn"
                                disabled={saving}
                            >
                                {saving ? (
                                    "Saving..."
                                ) : (
                                    <>
                                        {editingId ? (
                                            <FaEdit />
                                        ) : (
                                            <FaPlus />
                                        )}

                                        {editingId
                                            ? "Update Budget"
                                            : "Add Budget"}
                                    </>
                                )}
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (
                <div className="budget-loading">
                    Loading budgets...
                </div>
            ) : (
                <>

                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    <div className="budget-cards">

                        <div className="budget-card">

                            <div className="budget-icon">
                                <FaPiggyBank />
                            </div>

                            <div>

                                <p>Total Budget</p>

                                <h2>
                                    {formatAmount(totalBudget)}
                                </h2>

                                <span>
                                    Monthly budget
                                </span>

                            </div>

                        </div>

                        <div className="budget-card">

                            <div className="budget-icon spent">
                                <FaShoppingBag />
                            </div>

                            <div>

                                <p>Total Spent</p>

                                <h2>
                                    {formatAmount(totalSpent)}
                                </h2>

                                <span>
                                    {percentage}% of budget used
                                </span>

                            </div>

                        </div>

                        <div className="budget-card">

                            <div className="budget-icon remaining">
                                <FaWallet />
                            </div>

                            <div>

                                <p>Remaining</p>

                                <h2>
                                    {formatAmount(remaining)}
                                </h2>

                                <span>
                                    Available to spend
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        OVERALL PROGRESS
                    ================================================= */}

                    <div className="budget-section">

                        <div className="section-title">

                            <div>

                                <h2>
                                    Overall Budget
                                </h2>

                                <p>
                                    Your monthly spending progress
                                </p>

                            </div>

                            <strong>
                                {percentage}%
                            </strong>

                        </div>

                        <div className="progress-container">

                            <div
                                className="progress-bar"
                                style={{
                                    width: `${Math.min(
                                        percentage,
                                        100
                                    )}%`
                                }}
                            />

                        </div>

                        <div className="progress-info">

                            <span>
                                Spent:{" "}
                                {formatAmount(totalSpent)}
                            </span>

                            <span>
                                Total Budget:{" "}
                                {formatAmount(totalBudget)}
                            </span>

                        </div>

                    </div>

                    {/* =================================================
                        CATEGORY BUDGETS
                    ================================================= */}

                    <div className="budget-section">

                        <div className="section-title">

                            <div>

                                <h2>
                                    Budget Categories
                                </h2>

                                <p>
                                    See exactly how each category is being spent
                                </p>

                            </div>

                        </div>

                        <div className="budget-list">

                            {budgets.length === 0 ? (

                                <div className="empty-budget">

                                    <FaPiggyBank />

                                    <h3>
                                        No budgets found
                                    </h3>

                                    <p>
                                        Add your first budget to start tracking your spending.
                                    </p>

                                </div>

                            ) : (

                                budgets.map((item) => {

                                    const amount =
                                        Number(item.amount || 0);

                                    const spent =
                                        Number(item.spent || 0);

                                    const categoryRemaining =
                                        Math.max(
                                            amount - spent,
                                            0
                                        );

                                    const usedPercentage =
                                        amount > 0
                                            ? Math.round(
                                                (spent / amount) * 100
                                            )
                                            : 0;

                                    const progressPercentage =
                                        Math.min(
                                            Math.max(
                                                usedPercentage,
                                                0
                                            ),
                                            100
                                        );

                                    return (
                                        <div
                                            className="budget-item"
                                            key={item.id}
                                        >

                                            {/* CATEGORY HEADER */}

                                            <div className="budget-item-top">

                                                <div className="budget-category">

                                                    <div className="category-icon">

                                                        {categoryIcons[
                                                            item.category
                                                        ] || (
                                                            <FaPiggyBank />
                                                        )}

                                                    </div>

                                                    <div>

                                                        <h3>
                                                            {item.category}
                                                        </h3>

                                                        <p>
                                                            Total budget:{" "}
                                                            {formatAmount(amount)}
                                                        </p>

                                                    </div>

                                                </div>

                                                {/* ACTIONS */}

                                                <div className="budget-actions">

                                                    <button
                                                        type="button"
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            editBudget(item)
                                                        }
                                                        title="Edit budget"
                                                        aria-label={`Edit ${item.category} budget`}
                                                    >
                                                        <FaEdit />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            openDeleteModal(item)
                                                        }
                                                        title="Delete budget"
                                                        aria-label={`Delete ${item.category} budget`}
                                                        disabled={
                                                            deletingId === item.id
                                                        }
                                                    >
                                                        {deletingId === item.id ? (
                                                            "..."
                                                        ) : (
                                                            <FaTrash />
                                                        )}
                                                    </button>

                                                </div>

                                            </div>

                                            {/* SPENDING DETAILS */}

                                            <div className="budget-spending-details">

                                                <div className="spending-box total">

                                                    <span>
                                                        Total Budget
                                                    </span>

                                                    <strong>
                                                        {formatAmount(amount)}
                                                    </strong>

                                                </div>

                                                <div className="spending-box spent">

                                                    <span>
                                                        Spent
                                                    </span>

                                                    <strong>
                                                        {formatAmount(spent)}
                                                    </strong>

                                                </div>

                                                <div className="spending-box remaining">

                                                    <span>
                                                        Remaining
                                                    </span>

                                                    <strong>
                                                        {formatAmount(
                                                            categoryRemaining
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>

                                            {/* PROGRESS */}

                                            <div className="category-progress">

                                                <div
                                                    className="category-progress-bar"
                                                    style={{
                                                        width: `${progressPercentage}%`
                                                    }}
                                                />

                                            </div>

                                            {/* PROGRESS INFORMATION */}

                                            <div className="category-bottom">

                                                <span>
                                                    {usedPercentage}% used
                                                </span>

                                                <span>
                                                    {formatAmount(spent)}
                                                    {" "}spent of{" "}
                                                    {formatAmount(amount)}
                                                </span>

                                                <span>
                                                    {formatAmount(
                                                        categoryRemaining
                                                    )}
                                                    {" "}remaining
                                                </span>

                                            </div>

                                        </div>
                                    );
                                })
                            )}

                        </div>

                    </div>

                </>
            )}

            {/* =================================================
                DELETE CONFIRMATION MODAL
            ================================================= */}

            {showDeleteModal && budgetToDelete && (

                <div className="delete-modal-overlay">

                    <div className="delete-modal">

                        <button
                            type="button"
                            className="delete-modal-close"
                            onClick={closeDeleteModal}
                            title="Close"
                        >
                            <FaTimes />
                        </button>

                        <div className="delete-modal-icon">
                            <FaTrash />
                        </div>

                        <h2>
                            Delete Budget?
                        </h2>

                        <p>
                            Are you sure you want to delete the{" "}
                            <strong>
                                {budgetToDelete.category}
                            </strong>{" "}
                            budget?
                        </p>

                        <p className="delete-warning">
                            This budget will be moved to Delete History
                            and can be restored within 30 days.
                        </p>

                        <div className="delete-modal-actions">

                            <button
                                type="button"
                                className="cancel-delete-btn"
                                onClick={closeDeleteModal}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="confirm-delete-btn"
                                onClick={deleteBudget}
                                disabled={deletingId !== null}
                            >
                                {deletingId !== null
                                    ? "Deleting..."
                                    : "Delete Budget"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Budget;

