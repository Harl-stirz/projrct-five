
import { useEffect, useState } from "react";
import {
    FaTrashRestore,
    FaTrash,
    FaClock
} from "react-icons/fa";

import "./DeleteHistory.css";

const API_URL = "http://localhost:5000";

const DeleteHistory = () => {

    const [deletedRecords, setDeletedRecords] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [processingId, setProcessingId] =
        useState(null);


    /* ========================================
       GET ALL DELETED RECORDS
    ======================================== */

    const fetchDeletedRecords = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/deleted-history`
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch deleted history"
                );

            }

            const data = await response.json();

            if (!Array.isArray(data)) {

                throw new Error(
                    "Invalid response from server"
                );

            }

            const formattedRecords = data.map(
                (record) => {

                    let recordData =
                        record.record_data;

                    if (
                        typeof recordData ===
                        "string"
                    ) {

                        try {

                            recordData =
                                JSON.parse(recordData);

                        } catch (error) {

                            console.error(
                                "Invalid record_data:",
                                error
                            );

                            recordData = {};
                        }

                    }

                    return {
                        ...record,
                        record_data:
                            recordData || {}
                    };

                }
            );

            setDeletedRecords(
                formattedRecords
            );

        } catch (error) {

            console.error(
                "Fetch deleted history error:",
                error
            );

            setError(
                "Unable to load deleted history."
            );

        } finally {

            setLoading(false);

        }

    };


    /* ========================================
       LOAD PAGE
    ======================================== */

    useEffect(() => {

        fetchDeletedRecords();

    }, []);


    /* ========================================
       DAYS REMAINING
    ======================================== */

    const getDaysRemaining = (expiresAt) => {

        if (!expiresAt) {
            return 0;
        }

        const expirationDate =
            new Date(expiresAt);

        const currentDate =
            new Date();

        const difference =
            expirationDate.getTime() -
            currentDate.getTime();

        const days =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );

        return Math.max(0, days);

    };


    /* ========================================
       FORMAT DATE
    ======================================== */

    const formatDate = (date) => {

        if (!date) {
            return "Unknown";
        }

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );

    };


    /* ========================================
       FORMAT AMOUNT
    ======================================== */

    const formatAmount = (amount) => {

        if (
            amount === undefined ||
            amount === null
        ) {
            return "0.00";
        }

        return Number(amount).toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    /* ========================================
       RESTORE RECORD
    ======================================== */

    const handleRestore = async (id) => {

        try {

            setProcessingId(id);

            const response = await fetch(
                `${API_URL}/deleted-history/${id}/restore`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
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
                    "Failed to restore record"
                );

            }

            setDeletedRecords(
                (previousRecords) =>
                    previousRecords.filter(
                        (record) =>
                            record.id !== id
                    )
            );

            window.dispatchEvent(
                new Event("transactionChanged")
            );

            window.dispatchEvent(
                new Event("incomeChanged")
            );

            window.dispatchEvent(
                new Event("expenseChanged")
            );

            window.dispatchEvent(
                new Event("budgetChanged")
            );

            window.dispatchEvent(
                new Event("userChanged")
            );

            alert(
                "Record restored successfully!"
            );

        } catch (error) {

            console.error(
                "Restore record error:",
                error
            );

            alert(
                error.message ||
                "Failed to restore record"
            );

        } finally {

            setProcessingId(null);

        }

    };


    /* ========================================
       PERMANENT DELETE
    ======================================== */

    const handlePermanentDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to permanently delete this record?\n\nThis action cannot be undone."
            );

        if (!confirmed) {
            return;
        }

        try {

            setProcessingId(id);

            const response = await fetch(
                `${API_URL}/deleted-history/${id}`,
                {
                    method: "DELETE"
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
                    "Failed to permanently delete record"
                );

            }

            setDeletedRecords(
                (previousRecords) =>
                    previousRecords.filter(
                        (record) =>
                            record.id !== id
                    )
            );

            alert(
                "Record permanently deleted!"
            );

        } catch (error) {

            console.error(
                "Permanent delete error:",
                error
            );

            alert(
                error.message ||
                "Failed to permanently delete record"
            );

        } finally {

            setProcessingId(null);

        }

    };


    /* ========================================
       LOADING
    ======================================== */

    if (loading) {

        return (
            <div className="delete-history-page">

                <div className="delete-history-loading">
                    Loading delete history...
                </div>

            </div>
        );

    }


    /* ========================================
       PAGE
    ======================================== */

    return (

        <div className="delete-history-page">

            <div className="delete-history-header">

                <div>

                    <h1>
                        Delete History
                    </h1>

                    <p>
                        Recover deleted records within
                        30 days before they are permanently
                        removed.
                    </p>

                </div>

                <div className="delete-history-count">

                    <FaTrash />

                    <span>
                        {deletedRecords.length}
                    </span>

                    <small>
                        Deleted
                    </small>

                </div>

            </div>


            {error && (

                <div className="delete-history-error">

                    {error}

                    <button
                        onClick={
                            fetchDeletedRecords
                        }
                    >
                        Try Again
                    </button>

                </div>

            )}


            {!error &&
                deletedRecords.length === 0 && (

                    <div className="delete-history-empty">

                        <div className="empty-icon">

                            <FaTrash />

                        </div>

                        <h2>
                            No Deleted Records
                        </h2>

                        <p>
                            Records you delete will
                            appear here for 30 days.
                        </p>

                    </div>

                )}


            {deletedRecords.length > 0 && (

                <div className="delete-history-card">

                    <div className="delete-history-card-header">

                        <div>

                            <h2>
                                Deleted Records
                            </h2>

                            <p>
                                These records can be
                                recovered before their
                                30-day recovery period
                                expires.
                            </p>

                        </div>

                    </div>


                    <div className="delete-history-table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Record
                                    </th>

                                    <th>
                                        Type
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Deleted
                                    </th>

                                    <th>
                                        Recovery
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {deletedRecords.map(
                                    (record) => {

                                        const data =
                                            record.record_data ||
                                            {};

                                        const daysRemaining =
                                            getDaysRemaining(
                                                record.expires_at
                                            );

                                        const name =
                                            data.name ||
                                            data.title ||
                                            data.description ||
                                            `${record.record_type} #${record.record_id}`;

                                        const category =
                                            data.category ||
                                            "-";

                                        const date =
                                            data.date ||
                                            data.transaction_date ||
                                            data.created_at ||
                                            null;

                                        const amount =
                                            data.amount ??
                                            data.value ??
                                            0;

                                        const type =
                                            data.type ||
                                            record.record_type;

                                        const isIncome =
                                            String(type)
                                                .toLowerCase() ===
                                            "income";

                                        return (

                                            <tr
                                                key={
                                                    record.id
                                                }
                                            >

                                                <td>

                                                    <div className="deleted-transaction-name">

                                                        <strong>
                                                            {name}
                                                        </strong>

                                                        <span>
                                                            ID:{" "}
                                                            {
                                                                record.record_id
                                                            }
                                                        </span>

                                                    </div>

                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            `history-type ${
                                                                isIncome
                                                                    ? "income"
                                                                    : "expense"
                                                            }`
                                                        }
                                                    >
                                                        {
                                                            record.record_type
                                                        }
                                                    </span>

                                                </td>


                                                <td>
                                                    {category}
                                                </td>


                                                <td>
                                                    {
                                                        formatDate(
                                                            date
                                                        )
                                                    }
                                                </td>


                                                <td
                                                    className={
                                                        isIncome
                                                            ? "history-income"
                                                            : "history-expense"
                                                    }
                                                >
                                                    {
                                                        formatAmount(
                                                            amount
                                                        )
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        formatDate(
                                                            record.deleted_at
                                                        )
                                                    }
                                                </td>


                                                <td>

                                                    <div
                                                        className={
                                                            daysRemaining <= 5
                                                                ? "recovery-warning"
                                                                : "recovery-time"
                                                        }
                                                    >

                                                        <FaClock />

                                                        <span>

                                                            {
                                                                daysRemaining
                                                            }{" "}

                                                            {
                                                                daysRemaining ===
                                                                1
                                                                    ? "day"
                                                                    : "days"
                                                            }{" "}
                                                            left

                                                        </span>

                                                    </div>

                                                </td>


                                                <td>

                                                    <div className="history-actions">

                                                        <button
                                                            type="button"
                                                            className="restore-btn"
                                                            onClick={() =>
                                                                handleRestore(
                                                                    record.id
                                                                )
                                                            }
                                                            disabled={
                                                                processingId ===
                                                                record.id
                                                            }
                                                        >

                                                            <FaTrashRestore />

                                                            {
                                                                processingId ===
                                                                record.id
                                                                    ? "Processing..."
                                                                    : "Restore"
                                                            }

                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="permanent-delete-btn"
                                                            onClick={() =>
                                                                handlePermanentDelete(
                                                                    record.id
                                                                )
                                                            }
                                                            disabled={
                                                                processingId ===
                                                                record.id
                                                            }
                                                        >

                                                            <FaTrash />

                                                            Delete Forever

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

                </div>

            )}

        </div>

    );

};

export default DeleteHistory;

