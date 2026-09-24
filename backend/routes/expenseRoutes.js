const express = require("express");

const router = express.Router();

const {
    getExpenses,
    getExpense,
    addExpense,
    editExpense,
    removeExpense
} = require("../controllers/expenseController");


router.get("/", getExpenses);

router.get("/:id", getExpense);

router.post("/", addExpense);

router.put("/:id", editExpense);

router.delete("/:id", removeExpense);


module.exports = router;