const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const cron = require("node-cron");

// ========================================
// IMPORT ROUTES
// ========================================

// Authentication
const authRoutes =
    require("./routes/authRoutes");

// Users
const userRoutes =
    require("./routes/userRoutes");

// Transactions
const transactionRoutes =
    require("./routes/transactionRoutes");

// Income
const incomeRoutes =
    require("./routes/incomeRoutes");

// Expenses
const expenseRoutes =
    require("./routes/expenseRoutes");

// Budgets
const budgetRoutes =
    require("./routes/budgetRoutes");

// General Delete History
const deletedHistoryRoutes =
    require("./routes/deletedHistoryRoutes");


// ========================================
// IMPORT DELETE HISTORY MODEL
// ========================================

const {
    deleteExpiredRecords
} = require("./models/deletedHistoryModel");


// ========================================
// CREATE EXPRESS APP
// ========================================

const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());


// ========================================
// AUTH ROUTES
// ========================================

app.use(
    "/auth",
    authRoutes
);


// ========================================
// USER ROUTES
// ========================================

app.use(
    "/users",
    userRoutes
);


// ========================================
// HOME / API TEST
// ========================================

app.get("/", (req, res) => {

    res.json({
        message:
            "Finance Dashboard API is running"
    });

});


// ========================================
// MYSQL TEST
// ========================================

app.get("/test-db", async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT 1 AS result"
        );

        res.status(200).json({

            message:
                "MySQL connected successfully",

            result:
                rows

        });

    } catch (error) {

        console.error(
            "Database connection error:",
            error
        );

        res.status(500).json({

            message:
                "Database connection failed",

            error:
                error.message

        });

    }

});


// ========================================
// TRANSACTION ROUTES
// ========================================

app.use(
    "/transactions",
    transactionRoutes
);


// ========================================
// INCOME ROUTES
// ========================================

app.use(
    "/income",
    incomeRoutes
);


// ========================================
// EXPENSE ROUTES
// ========================================

app.use(
    "/expenses",
    expenseRoutes
);


// ========================================
// BUDGET ROUTES
// ========================================
//
// GET    /budgets
// GET    /budgets/:id
// POST   /budgets
// PUT    /budgets/:id
// DELETE /budgets/:id
//
// ========================================

app.use(
    "/budgets",
    budgetRoutes
);


// ========================================
// GENERAL DELETE HISTORY
// ========================================
//
// GET    /deleted-history
// GET    /deleted-history/type/:type
// GET    /deleted-history/:id
// POST   /deleted-history/:id/restore
// DELETE /deleted-history/:id
// DELETE /deleted-history/cleanup/expired
//
// Supports:
// - Transactions
// - Income
// - Expenses
// - Budgets
// - Users
//
// ========================================

app.use(
    "/deleted-history",
    deletedHistoryRoutes
);


// ========================================
// AUTOMATIC 30-DAY CLEANUP
// ========================================
//
// Runs every day at midnight.
//
// Any record whose expires_at is in the
// past will be permanently removed.
//
// ========================================

cron.schedule(
    "0 0 * * *",
    async () => {

        try {

            const result =
                await deleteExpiredRecords();

            if (
                result.affectedRows > 0
            ) {

                console.log(
                    `${result.affectedRows} expired record(s) permanently deleted`
                );

            } else {

                console.log(
                    "Delete history cleanup completed. No expired records."
                );

            }

        } catch (error) {

            console.error(
                "Automatic delete history cleanup error:",
                error
            );

        }

    }
);


// ========================================
// ERROR HANDLER
// ========================================

app.use(
    (err, req, res, next) => {

        console.error(
            "Server error:",
            err
        );

        res.status(500).json({

            message:
                "Internal server error",

            error:
                err.message

        });

    }
);


// ========================================
// START SERVER
// ========================================

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

        console.log(
            "Transactions API: http://localhost:5000/transactions"
        );

        console.log(
            "Income API: http://localhost:5000/income"
        );

        console.log(
            "Expenses API: http://localhost:5000/expenses"
        );

        console.log(
            "Budgets API: http://localhost:5000/budgets"
        );

        console.log(
            "Delete History API: http://localhost:5000/deleted-history"
        );

    }
);