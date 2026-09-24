const express = require("express");

const router = express.Router();

const {
    getIncome,
    getOneIncome,
    addIncome,
    editIncome,
    removeIncome
} = require("../controllers/incomeController");


// GET all income
router.get("/", getIncome);


// GET one income
router.get("/:id", getOneIncome);


// CREATE income
router.post("/", addIncome);


// UPDATE income
router.put("/:id", editIncome);


// DELETE income
router.delete("/:id", removeIncome);


module.exports = router;