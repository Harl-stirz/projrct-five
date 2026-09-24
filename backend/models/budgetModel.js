const db = require("../config/db");


// Get all budgets
const getAllBudgets = async () => {

    const [rows] = await db.query(`
        SELECT
            id,
            category,
            amount,
            spent,
            created_at
        FROM budgets
        ORDER BY id DESC
    `);

    return rows;
};


// Get one budget
const getBudgetById = async (id) => {

    const [rows] = await db.query(
        `
        SELECT
            id,
            category,
            amount,
            spent,
            created_at
        FROM budgets
        WHERE id = ?
        `,
        [id]
    );

    return rows[0];
};


// Create budget
const createBudget = async (
    category,
    amount,
    spent
) => {

    const [result] = await db.query(
        `
        INSERT INTO budgets
        (category, amount, spent)
        VALUES (?, ?, ?)
        `,
        [
            category,
            amount,
            spent
        ]
    );

    return getBudgetById(result.insertId);
};


// Update budget
const updateBudget = async (
    id,
    category,
    amount,
    spent
) => {

    await db.query(
        `
        UPDATE budgets
        SET
            category = ?,
            amount = ?,
            spent = ?
        WHERE id = ?
        `,
        [
            category,
            amount,
            spent,
            id
        ]
    );

    return getBudgetById(id);
};


// Delete budget
const deleteBudget = async (id) => {

    const [result] = await db.query(
        `
        DELETE FROM budgets
        WHERE id = ?
        `,
        [id]
    );

    return result;
};


module.exports = {
    getAllBudgets,
    getBudgetById,
    createBudget,
    updateBudget,
    deleteBudget
};