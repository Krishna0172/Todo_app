/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import axios from 'axios';

// API base URL
const api_base = 'http://localhost:5000';

function App() {
  // State variables for todos, popup visibility, and new todo input
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  // Fetch todos on component mount
  useEffect(() => {
    GetTodos();
  }, []);

  // Function to fetch todos from the server
  const GetTodos = async () => {
    try {
      const response = await axios.get(`${api_base}/todos`);
      setTodos(response.data);
    } catch (err) {
      console.log('Error fetching data: ', err);
    }
  };

  // Function to mark a todo as complete
  const completeTodo = async (id) => {
    try {
      const response = await axios.get(`${api_base}/todo/complete/${id}`);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === response.data._id ? response.data : todo
        )
      );
    } catch (err) {
      console.log('Error updating todo: ', err);
    }
  };

  // Function to add a new todo
  const addTodo = async () => {
    try {
      const response = await axios.post(`${api_base}/todo/new`, {
        text: newTodo,
      });
      setTodos([...todos, response.data]);
      setPopupActive(false);
      setNewTodo('');
    } catch (err) {
      console.error('Error adding todo: ', err);
    }
  };

  // Function to delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${api_base}/todo/delete/${id}`);
      GetTodos(); // Refresh todos after deletion
    } catch (err) {
      console.error('Error deleting todo: ', err);
    }
  };

  // JSX rendering
  return (
    <div className="App">
      <h1>Welcome, Krishna</h1>
      <h4>Your tasks</h4>

      {<div className="todos">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div
              className={'todo' + (todo.complete ? ' is-complete' : '')}
              key={todo._id}
              onClick={() => completeTodo(todo._id)}
            >
              <div className="checkbox"></div>

              <div className="text">{todo.text}</div>

              <div
                className="delete-todo"
                onClick={() => deleteTodo(todo._id)}
              >
                x
              </div>
            </div>
          ))
        ) : (
          <p>You currently have no tasks</p>
        )}
      </div> }

      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>

      {/* Popup for adding new todo */}
      {popupActive ? (
        <div className="popup">
          <div
            className="closePopup"
            onClick={() => setPopupActive(false)}
          >
            X
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default App;
