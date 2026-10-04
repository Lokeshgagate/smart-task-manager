const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.post("/", taskController.createTask);
router.get("/", taskController.getAllTasks);
router.get("/blocked", taskController.getBlockedTasks);
router.get("/user/:userId", taskController.getMyTasks);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;