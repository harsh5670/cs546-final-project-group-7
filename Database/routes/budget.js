const express = require("express");
const router = express.Router();
const budgets = require("../data");
const budgetData = budgets.budget;
const jwt = require("jsonwebtoken");
const xss = require("xss");

router.get("/budget", async (req, res) => {
  let token = req.headers.token;
  try {
    let id = jwt.verify(token, "mySecretKey").id;
    let budget = await budgetData.getBudgetByUserId(id);
    res.json(budget);
  } catch (e) {
    res.status(404).json({ error: "budget not found" });
  }
});

router.post("/budget/add", async (req, res) => {
  let budgetInfo = req.body;
  let token = req.headers.token;
  try {
    let id = jwt.verify(token, "mySecretKey").id;
    let newBudget = await budgetData.create(
      id,
      budgetInfo.budgetname,
      budgetInfo.amount,
      budgetInfo.category,
      budgetInfo.wallet,
      budgetInfo.type
    );
    res.json(newBudget);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.patch("/budget/update", async (req, res) => {
  let budgetInfo = req.body;
  let token = req.headers.token;
  let id = jwt.verify(token, "mySecretKey").id;

  try {
    let updatedBudget = await budgetData.update(
      budgetInfo.budgetid,
      id,
      budgetInfo.updateinfo
    );
    res.json(updatedBudget);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.post("/budget/delete", async (req, res) => {
  let budgetid = xss(req.body.id);
  let token = req.headers.token;

  try {
    let id = jwt.verify(token, "mySecretKey").id;
    await budgetData.delete(budgetid, id);
    res.send("Budget Deleted");
  } catch (e) {
    res.sendStatus(500);
  }
});

module.exports = router;
