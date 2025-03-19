import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, deleteTodo, setTodos, updateTodo } from "../redux/todosSlice";
import { toast } from "react-toastify";

function TodoList() {
  const [newTodo, setNewTodo] = useState("");
  const { todos } = useSelector((state) => state.todos);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token]);

  const fetchTodos = async (token) => {
    try {
      const response = await axios.get(
        "https://test-2-alpha-five.vercel.app/api/todos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(setTodos(response.data));
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleAddTodo = () => {
    if (!newTodo.trim()) {
      alert("Todo title cannot be empty");
      return;
    }
    axios
      .post(
        "http://localhost:5001/api/todos/add",
        { title: newTodo },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        dispatch(addTodo(response.data));
        setNewTodo("");
      })
      .catch((error) => console.error("Error adding todo:", error));
  };

  const handleDeleteTodo = (id) => {
    axios
      .delete(`http://localhost:5001/api/todos/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => dispatch(deleteTodo(id)))
      .catch((error) => console.error("Error deleting todo:", error));
  };

  const handleToggleComplete = (id, completed) => {
    axios
      .put(
        `http://localhost:5001/api/todos/update/${id}`,
        { completed: !completed },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => dispatch(updateTodo(response.data)))
      .catch((error) => console.error("Error updating todo:", error));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchTodos(token);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Successfully logged out!");
  };

  return (
    <div className="todo-container">
      <h2 className="todo-header">Todo List</h2>

      <div className="add-todo-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="add-todo-input"
        />
        <button onClick={handleAddTodo} className="add-todo-button">
          Add Todo
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item">
            <div className="todo-item-container">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo._id, todo.completed)}
                className="todo-item-checkbox"
              />
              <span
                className={`todo-item-title ${
                  todo.completed ? "todo-item-completed" : ""
                }`}
              >
                {todo.title}
              </span>
            </div>
            <button
              onClick={() => handleDeleteTodo(todo._id)}
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
}

export default TodoList;
