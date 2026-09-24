const db = require("../config/db");

// ==========================================
// CREATE DELETED RECORD
// ==========================================
const createDeletedRecord = async (
    recordId,
    recordType,
    recordData,
    connection = db
) => {

    const sql = `
        INSERT INTO deleted_history
        (
            record_id,
            record_type,
            record_data,
            deleted_at,
            expires_at
        )
        VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY))
    `;

    const [result] = await connection.query(
        sql,
        [
            recordId,
            recordType,
            JSON.stringify(recordData)
        ]
    );

    return result;
};


// ==========================================
// GET ALL DELETED RECORDS
// ==========================================
const getAllDeletedRecords = async () => {

    const sql = `
        SELECT
            id,
            record_id,
            record_type,
            record_data,
            deleted_at,
            expires_at
        FROM deleted_history
        ORDER BY deleted_at DESC
    `;

    const [rows] = await db.query(sql);

    return rows;
};


// ==========================================
// GET DELETED RECORDS BY TYPE
// ==========================================
const getDeletedRecordsByType = async (recordType) => {

    const sql = `
        SELECT
            id,
            record_id,
            record_type,
            record_data,
            deleted_at,
            expires_at
        FROM deleted_history
        WHERE record_type = ?
        ORDER BY deleted_at DESC
    `;

    const [rows] = await db.query(
        sql,
        [recordType]
    );

    return rows;
};


// ==========================================
// GET ONE DELETED RECORD
// ==========================================
const getDeletedRecordById = async (id) => {

    const sql = `
        SELECT
            id,
            record_id,
            record_type,
            record_data,
            deleted_at,
            expires_at
        FROM deleted_history
        WHERE id = ?
        LIMIT 1
    `;

    const [rows] = await db.query(
        sql,
        [id]
    );

    return rows[0] || null;
};


// ==========================================
// PERMANENTLY DELETE HISTORY RECORD
// ==========================================
const permanentlyDeleteRecord = async (id) => {

    const sql = `
        DELETE FROM deleted_history
        WHERE id = ?
    `;

    const [result] = await db.query(
        sql,
        [id]
    );

    return result;
};


// ==========================================
// DELETE EXPIRED RECORDS
// ==========================================
const deleteExpiredRecords = async () => {

    const sql = `
        DELETE FROM deleted_history
        WHERE expires_at <= NOW()
    `;

    const [result] = await db.query(sql);

    return result;
};


// ==========================================
// GET ACTIVE DELETED RECORDS
// ==========================================
const getActiveDeletedRecords = async () => {

    const sql = `
        SELECT
            id,
            record_id,
            record_type,
            record_data,
            deleted_at,
            expires_at
        FROM deleted_history
        WHERE expires_at > NOW()
        ORDER BY deleted_at DESC
    `;

    const [rows] = await db.query(sql);

    return rows;
};


module.exports = {
    createDeletedRecord,
    getAllDeletedRecords,
    getDeletedRecordsByType,
    getDeletedRecordById,
    permanentlyDeleteRecord,
    deleteExpiredRecords,
    getActiveDeletedRecords
};