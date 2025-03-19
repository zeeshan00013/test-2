import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
  error: null,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodos: (state, action) => {
      state.todos = action.payload;
    },
    addTodo: (state, action) => {
      state.todos.push(action.payload);
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo._id !== action.payload);
    },
    updateTodo: (state, action) => {
      state.todos = state.todos.map((todo) =>
        todo._id === action.payload._id ? action.payload : todo
      );
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setTodos, addTodo, deleteTodo, updateTodo, setError } =
  todosSlice.actions;

export default todosSlice.reducer;
