const express = require("express");

const router = express.Router();

const {
    getBudgets,
    getSingleBudget,
    addBudget,
    editBudget,
    removeBudget
} = require("../controllers/budgetController");


// Get all budgets
router.get(
    "/",
    getBudgets
);


// Get one budget
router.get(
    "/:id",
    getSingleBudget
);


// Add budget
router.post(
    "/",
    addBudget
);


// Edit budget
router.put(
    "/:id",
    editBudget
);


// Delete budget
router.delete(
    "/:id",
    removeBudget
);


module.exports = router;