const db = require("../config/db");
const DeletedHistory = require("../models/deletedHistoryModel");


// =========================================================
// FORMAT DATE FOR MYSQL
// =========================================================

const formatMySQLDate = (value) => {

    if (!value) {
        return null;
    }

    // Already MySQL DATE format
    if (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
        return value;
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        throw new Error(
            `Invalid date value: ${value}`
        );
    }

    return date.toISOString().split("T")[0];
};


// =========================================================
// GET ALL DELETED RECORDS
// =========================================================

const getDeletedRecords = async (req, res) => {

    try {

        const records =
            await DeletedHistory.getAllDeletedRecords();

        res.status(200).json(records);

    } catch (error) {

        console.error(
            "Get deleted records error:",
            error
        );

        res.status(500).json({
            message: "Failed to get deleted records",
            error: error.message
        });

    }

};


// =========================================================
// GET DELETED RECORDS BY TYPE
// =========================================================

const getDeletedRecordsByType = async (req, res) => {

    try {

        const { type } = req.params;

        const records =
            await DeletedHistory.getDeletedRecordsByType(
                type
            );

        res.status(200).json(records);

    } catch (error) {

        console.error(
            "Get deleted records by type error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to get deleted records by type",
            error: error.message
        });

    }

};


// =========================================================
// GET ONE DELETED RECORD
// =========================================================

const getDeletedRecordById = async (req, res) => {

    try {

        const { id } = req.params;

        const record =
            await DeletedHistory.getDeletedRecordById(
                id
            );

        if (!record) {

            return res.status(404).json({
                message:
                    "Deleted record not found"
            });

        }

        res.status(200).json(record);

    } catch (error) {

        console.error(
            "Get deleted record error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to get deleted record",
            error: error.message
        });

    }

};


// =========================================================
// RESTORE DELETED RECORD
// =========================================================

const restoreDeletedRecord = async (req, res) => {

    let connection = null;
    let transactionStarted = false;

    try {

        const { id } = req.params;


        // =================================================
        // 1. GET DELETED RECORD
        // =================================================

        const deletedRecord =
            await DeletedHistory.getDeletedRecordById(
                id
            );


        if (!deletedRecord) {

            return res.status(404).json({
                message:
                    "Deleted record not found"
            });

        }


        // =================================================
        // 2. CHECK EXPIRATION
        // =================================================

        if (
            deletedRecord.expires_at &&
            new Date(deletedRecord.expires_at) < new Date()
        ) {

            return res.status(410).json({

                message:
                    "This deleted record has expired and cannot be restored"

            });

        }


        // =================================================
        // 3. PARSE RECORD DATA
        // =================================================

        let recordData =
            deletedRecord.record_data;


        if (
            typeof recordData === "string"
        ) {

            try {

                recordData =
                    JSON.parse(recordData);

            } catch (parseError) {

                return res.status(500).json({

                    message:
                        "Invalid deleted record data",

                    error:
                        parseError.message

                });

            }

        }


        // =================================================
        // 4. VALIDATE RECORD DATA
        // =================================================

        if (
            !recordData ||
            typeof recordData !== "object"
        ) {

            return res.status(400).json({

                message:
                    "Deleted record contains invalid data"

            });

        }


        // =================================================
        // 5. GET DATABASE CONNECTION
        // =================================================

        connection =
            await db.getConnection();


        // =================================================
        // 6. START TRANSACTION
        // =================================================

        await connection.beginTransaction();

        transactionStarted = true;


        // =================================================
        // TRANSACTION
        // =================================================

        if (
            deletedRecord.record_type ===
            "transaction"
        ) {

            await connection.query(
                `
                INSERT INTO transactions
                (
                    id,
                    name,
                    category,
                    date,
                    amount,
                    type
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    recordData.id,
                    recordData.name,
                    recordData.category,
                    formatMySQLDate(
                        recordData.date
                    ),
                    recordData.amount,
                    recordData.type
                ]
            );

        }


        // =================================================
        // INCOME
        // =================================================

        else if (
            deletedRecord.record_type ===
            "income"
        ) {

            await connection.query(
                `
                INSERT INTO income
                (
                    id,
                    source,
                    description,
                    date,
                    amount,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    recordData.id,
                    recordData.source,
                    recordData.description,
                    formatMySQLDate(
                        recordData.date
                    ),
                    recordData.amount,
                    recordData.status
                ]
            );

        }


        // =================================================
        // EXPENSE
        // =================================================

        else if (
            deletedRecord.record_type ===
            "expense"
        ) {

            await connection.query(
                `
                INSERT INTO expenses
                (
                    id,
                    name,
                    category,
                    amount,
                    date
                )
                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    recordData.id,
                    recordData.name,
                    recordData.category,
                    recordData.amount,
                    formatMySQLDate(
                        recordData.date
                    )
                ]
            );

        }


        // =================================================
        // BUDGET
        // =================================================

        else if (
            deletedRecord.record_type ===
            "budget"
        ) {

            /*
                IMPORTANT:

                Do NOT restore created_at here.

                The budgets table already has:

                created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP

                MySQL will automatically create
                a valid created_at value.
            */

            await connection.query(
                `
                INSERT INTO budgets
                (
                    id,
                    category,
                    amount,
                    spent
                )
                VALUES (?, ?, ?, ?)
                `,
                [
                    recordData.id,
                    recordData.category,
                    recordData.amount,
                    recordData.spent || 0
                ]
            );

        }


        // =================================================
        // USER
        // =================================================

        else if (
            deletedRecord.record_type ===
            "user"
        ) {

            await connection.query(
                `
                INSERT INTO users
                (
                    id,
                    name,
                    email,
                    password,
                    role
                )
                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    recordData.id,
                    recordData.name,
                    recordData.email,
                    recordData.password,
                    recordData.role || "user"
                ]
            );

        }


        // =================================================
        // UNKNOWN RECORD TYPE
        // =================================================

        else {

            await connection.rollback();

            transactionStarted = false;

            return res.status(400).json({

                message:
                    `Unsupported record type: ${deletedRecord.record_type}`

            });

        }


        // =================================================
        // REMOVE FROM DELETE HISTORY
        // =================================================

        await connection.query(
            `
            DELETE FROM deleted_history
            WHERE id = ?
            `,
            [id]
        );


        // =================================================
        // COMMIT
        // =================================================

        await connection.commit();

        transactionStarted = false;


        // =================================================
        // SUCCESS
        // =================================================

        res.status(200).json({

            message:
                "Record restored successfully",

            recordType:
                deletedRecord.record_type,

            recordId:
                deletedRecord.record_id

        });

    } catch (error) {

        // =================================================
        // ROLLBACK
        // =================================================

        if (
            connection &&
            transactionStarted
        ) {

            try {

                await connection.rollback();

            } catch (rollbackError) {

                console.error(
                    "Rollback error:",
                    rollbackError
                );

            }

        }


        console.error(
            "Restore deleted record error:",
            error
        );


        // =================================================
        // DUPLICATE RECORD
        // =================================================

        if (
            error.code ===
            "ER_DUP_ENTRY"
        ) {

            return res.status(409).json({

                message:
                    "This record already exists and cannot be restored.",

                error:
                    error.message

            });

        }


        // =================================================
        // FOREIGN KEY ERROR
        // =================================================

        if (
            error.code ===
            "ER_NO_REFERENCED_ROW_2"
        ) {

            return res.status(400).json({

                message:
                    "The record cannot be restored because a required related record does not exist.",

                error:
                    error.message

            });

        }


        // =================================================
        // GENERAL ERROR
        // =================================================

        res.status(500).json({

            message:
                "Failed to restore deleted record",

            error:
                error.message

        });

    } finally {

        // =================================================
        // RELEASE CONNECTION
        // =================================================

        if (connection) {

            connection.release();

        }

    }

};


// =========================================================
// PERMANENTLY DELETE RECORD
// =========================================================

const permanentlyDeleteRecord = async (req, res) => {

    try {

        const { id } = req.params;


        // =================================================
        // CHECK RECORD EXISTS
        // =================================================

        const deletedRecord =
            await DeletedHistory.getDeletedRecordById(
                id
            );


        if (!deletedRecord) {

            return res.status(404).json({

                message:
                    "Deleted record not found"

            });

        }


        // =================================================
        // PERMANENT DELETE
        // =================================================

        await DeletedHistory.permanentlyDeleteRecord(
            id
        );


        res.status(200).json({

            message:
                "Deleted record permanently removed",

            recordType:
                deletedRecord.record_type,

            recordId:
                deletedRecord.record_id

        });

    } catch (error) {

        console.error(
            "Permanent delete error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to permanently delete record",

            error:
                error.message

        });

    }

};


// =========================================================
// DELETE EXPIRED RECORDS
// =========================================================

const deleteExpiredRecords = async (req, res) => {

    try {

        const result =
            await DeletedHistory.deleteExpiredRecords();


        res.status(200).json({

            message:
                "Expired deleted records removed",

            affectedRows:
                result.affectedRows

        });

    } catch (error) {

        console.error(
            "Delete expired records error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to delete expired records",

            error:
                error.message

        });

    }

};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {

    getDeletedRecords,

    getDeletedRecordsByType,

    getDeletedRecordById,

    restoreDeletedRecord,

    permanentlyDeleteRecord,

    deleteExpiredRecords

};