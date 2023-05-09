const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const todoModel = mongoose.Schema({
  content: String,
  isDone: Boolean,
  createdAt: Date,
  category: String,
});
const Todo = mongoose.model("Todo", todoModel);

async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/todo-app", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
}

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    return res.status(200).send({
      todos: todos,
      message: "Todos founds",
    });
  } catch (error) {
    console.log("Error in get todo router", error);
    return res.status(500).send({ message: "Error getting todos" });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const payload = req.body;
    const newTodo = new Todo({
      content: payload.content,
      isDone: payload.isDone,
      createdAt: payload.createdAt,
      category: payload.category,
    });
    await newTodo.save();
    return res.status(200).send({
      todo: newTodo,
      message: "Todo created successfully",
    });
  } catch (error) {
    console.log("Error in post todo router", error);
    return res.status(500).send({ message: "Error creating todo" });
  }
});

app.post("/todos/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    await Todo.deleteOne({ _id: todoId });
    return res.status(200).send({message: "Todo successfully deleted!"});
  } catch (error) {
    console.log("Error in delete todo router", error);
    return res.status(500).send({message: "Error deleting todo"});
  }
});

// Add a new route that should update a particular todo base on it's id
app.put("/todos/:id", async (req, res) => {
    
})

app.listen(3000, () => {
  connectToDatabase();
  console.log("Server is running on port 3000");
});
