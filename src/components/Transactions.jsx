import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useCurrency } from "./CurrencyContext";
import "./Transactions.css";

const Transactions = () => {
    const { formatAmount } = useCurrency();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("All");

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        date: "",
        amount: "",
        type: "Expense",
    });

    // =========================
    // SAFE API RESPONSE
    // =========================
    const getApiResponse = async (response) => {
        const contentType =
            response.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            try {
                return await response.json();
            } catch {
                return {};
            }
        }

        try {
            const text = await response.text();

            return text
                ? { message: text }
                : {};
        } catch {
            return {};
        }
    };

    // =========================
    // FETCH TRANSACTIONS
    // =========================
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/transactions"
            );

            const data = await getApiResponse(response);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to fetch transactions"
                );
            }

            if (!Array.isArray(data)) {
                throw new Error(
                    "Invalid transactions response from server."
                );
            }

            setTransactions(data);
        } catch (error) {
            console.error("Fetch error:", error);

            setTransactions([]);

            setError(
                error.message ||
                "Unable to load transactions."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // =========================
    // HANDLE INPUT
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // ADD / UPDATE
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");

            if (
                !formData.name.trim() ||
                !formData.category.trim() ||
                !formData.date ||
                !formData.amount ||
                !formData.type
            ) {
                setError("Please fill in all fields.");
                return;
            }

            const transactionData = {
                name: formData.name.trim(),
                category: formData.category.trim(),
                date: formData.date,
                amount: Number(formData.amount),
                type: formData.type,
            };

            if (
                Number.isNaN(transactionData.amount) ||
                transactionData.amount <= 0
            ) {
                setError("Please enter a valid amount.");
                return;
            }

            const url = editingId
                ? `http://localhost:5000/transactions/${editingId}`
                : "http://localhost:5000/transactions";

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(transactionData),
            });

            const data = await getApiResponse(response);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    (editingId
                        ? "Failed to update transaction"
                        : "Failed to add transaction")
                );
            }

            // Reset form
            setFormData({
                name: "",
                category: "",
                date: "",
                amount: "",
                type: "Expense",
            });

            setEditingId(null);
            setShowForm(false);

            // Refresh transactions
            await fetchTransactions();

        } catch (error) {
            console.error("Save error:", error);

            setError(
                error.message ||
                "Something went wrong while saving the transaction."
            );
        }
    };

    // =========================
    // EDIT
    // =========================
    const handleEdit = (transaction) => {
        setEditingId(transaction.id);

        setFormData({
            name: transaction.name || "",
            category: transaction.category || "",
            date: transaction.date
                ? String(transaction.date).substring(0, 10)
                : "",
            amount: transaction.amount ?? "",
            type: transaction.type || "Expense",
        });

        setShowForm(true);
        setError("");
    };

    // =========================
    // DELETE
    // =========================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `http://localhost:5000/transactions/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await getApiResponse(response);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to delete transaction"
                );
            }

            setTransactions((prev) =>
                prev.filter(
                    (transaction) =>
                        transaction.id !== id
                )
            );

        } catch (error) {
            console.error("Delete error:", error);

            setError(
                error.message ||
                "Unable to delete transaction."
            );
        }
    };

    // =========================
    // CANCEL
    // =========================
    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);

        setFormData({
            name: "",
            category: "",
            date: "",
            amount: "",
            type: "Expense",
        });

        setError("");
    };

    // =========================
    // FORMAT DATE
    // =========================
    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return String(date);
        }

        return parsedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // =========================
    // SEARCH + FILTER
    // =========================
    const filteredTransactions = transactions.filter(
        (transaction) => {
            const search = searchTerm.toLowerCase();

            const name = String(
                transaction.name || ""
            ).toLowerCase();

            const category = String(
                transaction.category || ""
            ).toLowerCase();

            const matchesSearch =
                name.includes(search) ||
                category.includes(search);

            const matchesType =
                filterType === "All" ||
                transaction.type === filterType;

            return matchesSearch && matchesType;
        }
    );

    // =========================
    // SUMMARY
    // =========================
    const totalIncome = transactions
        .filter(
            (transaction) =>
                transaction.type === "Income"
        )
        .reduce(
            (total, transaction) =>
                total + (Number(transaction.amount) || 0),
            0
        );

    const totalExpenses = transactions
        .filter(
            (transaction) =>
                transaction.type === "Expense"
        )
        .reduce(
            (total, transaction) =>
                total + (Number(transaction.amount) || 0),
            0
        );

    const netBalance =
        totalIncome - totalExpenses;

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div className="transactions-page">
                <div className="loading">
                    Loading transactions...
                </div>
            </div>
        );
    }

    return (
        <div className="transactions-page">

            {/* HEADER */}
            <div className="transactions-header">

                <div>
                    <h1>Transactions</h1>

                    <p>
                        Manage and track all your financial
                        transactions.
                    </p>
                </div>

                <button
                    type="button"
                    className="add-transaction-btn"
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingId(null);

                        setFormData({
                            name: "",
                            category: "",
                            date: "",
                            amount: "",
                            type: "Expense",
                        });

                        setError("");
                    }}
                >
                    {showForm
                        ? "Close"
                        : "+ Add Transaction"}
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
                <div className="transaction-form-card">

                    <h2>
                        {editingId
                            ? "Edit Transaction"
                            : "Add New Transaction"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>
                                    Transaction Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Salary"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Category
                                </label>

                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    placeholder="e.g. Salary"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Date
                                </label>

                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Amount
                                </label>

                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Type
                                </label>

                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                >
                                    <option value="Income">
                                        Income
                                    </option>

                                    <option value="Expense">
                                        Expense
                                    </option>
                                </select>
                            </div>

                        </div>

                        <div className="form-actions">

                            <button
                                type="submit"
                                className="save-btn"
                            >
                                {editingId
                                    ? "Update Transaction"
                                    : "Add Transaction"}
                            </button>

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>
                </div>
            )}

            {/* SUMMARY */}
            <div className="transaction-summary">

                <div className="summary-card income-card">
                    <span>Total Income</span>

                    <h2>
                        {formatAmount(totalIncome)}
                    </h2>
                </div>

                <div className="summary-card expense-card">
                    <span>Total Expenses</span>

                    <h2>
                        {formatAmount(totalExpenses)}
                    </h2>
                </div>

                <div className="summary-card balance-card">
                    <span>Net Balance</span>

                    <h2>
                        {formatAmount(netBalance)}
                    </h2>
                </div>

                <div className="summary-card transactions-count-card">
                    <span>Transactions</span>

                    <h2>
                        {transactions.length}
                    </h2>
                </div>

            </div>

            {/* SEARCH + FILTER */}
            <div className="transaction-controls">

                <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="transaction-search"
                />

                <select
                    value={filterType}
                    onChange={(e) =>
                        setFilterType(e.target.value)
                    }
                    className="transaction-filter"
                >
                    <option value="All">
                        All Transactions
                    </option>

                    <option value="Income">
                        Income
                    </option>

                    <option value="Expense">
                        Expense
                    </option>
                </select>

            </div>

            {/* TABLE */}
            <div className="transactions-table-card">

                <div className="table-header">

                    <h2>
                        Recent Transactions
                    </h2>

                    <span>
                        {filteredTransactions.length}{" "}
                        transaction
                        {filteredTransactions.length !== 1
                            ? "s"
                            : ""}
                    </span>

                </div>

                {filteredTransactions.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No transactions found
                        </h3>

                        <p>
                            {transactions.length === 0
                                ? "Add your first transaction to get started."
                                : "Try changing your search or filter."}
                        </p>

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table>

                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Type</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredTransactions.map(
                                    (transaction) => {

                                        const amount =
                                            Number(
                                                transaction.amount
                                            ) || 0;

                                        const isIncome =
                                            transaction.type ===
                                            "Income";

                                        return (
                                            <tr
                                                key={
                                                    transaction.id
                                                }
                                            >

                                                <td>
                                                    <strong>
                                                        {
                                                            transaction.name
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        transaction.category
                                                    }
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        transaction.date
                                                    )}
                                                </td>

                                                <td
                                                    className={
                                                        isIncome
                                                            ? "income-amount"
                                                            : "expense-amount"
                                                    }
                                                >
                                                    {isIncome
                                                        ? "+"
                                                        : "-"}
                                                    {formatAmount(
                                                        amount
                                                    )}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`type-badge ${
                                                            isIncome
                                                                ? "income-badge"
                                                                : "expense-badge"
                                                        }`}
                                                    >
                                                        {
                                                            transaction.type
                                                        }
                                                    </span>
                                                </td>

                                                {/* ACTION BUTTONS */}
                                                <td>

                                                    <div className="action-buttons">

                                                        {/* EDIT */}
                                                        <button
                                                            type="button"
                                                            className="edit-btn"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    transaction
                                                                )
                                                            }
                                                            title="Edit transaction"
                                                            aria-label={`Edit ${transaction.name}`}
                                                        >
                                                            <FaEdit />
                                                        </button>

                                                        {/* DELETE */}
                                                        <button
                                                            type="button"
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    transaction.id
                                                                )
                                                            }
                                                            title="Delete transaction"
                                                            aria-label={`Delete ${transaction.name}`}
                                                        >
                                                            <FaTrash />
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
};

export default Transactions;