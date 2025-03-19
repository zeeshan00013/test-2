const express = require("express");
const Todo = require("../models/todo");
const authMiddleware = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.use(authMiddleware);

router.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.userId });
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Error fetching todos", error });
  }
});

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Todo title cannot be empty" });
    }

    const newTodo = new Todo({
      title,
      user: req.user.userId,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error adding Todo:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    if (todo.user.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You cannot delete this todo" });
    }

    await Todo.findByIdAndDelete(id);
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { completed } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { completed },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Error updating todo", error });
  }
});

module.exports = router;
