import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [darkMode, setDarkMode] = useState(false);  // dark mode state
  const [isEditing, setIsEditing] = useState(null); // index of the task being edited
  const [editText, setEditText] = useState("");     // temporary value during editing


  // Load tasks and dark mode preference from localStorage on first render
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save dark mode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleAddTask = () => {
    if (newTask.trim() === "") return;

    const taskObject = {
      text: newTask,
      completed: false,
    };

    setTasks([...tasks, taskObject]);
    setNewTask("");
  };

  const handleDeleteTask = (indexToDelete) => {
    const updatedTasks = tasks.filter((_, index) => index !== indexToDelete);
    setTasks(updatedTasks);
  };

  const toggleTaskCompletion = (indexToToggle) => {
    const updatedTasks = tasks.map((task, index) =>
      index === indexToToggle
        ? { ...task, completed: !task.completed }
        : task
    );
    setTasks(updatedTasks);
  };

  const startEditing = (index) => {
  setIsEditing(index);
  setEditText(tasks[index].text);
};

const handleEditChange = (e) => {
  setEditText(e.target.value);
};

const handleSaveEdit = (index) => {
  const updatedTasks = tasks.map((task, i) =>
    i === index ? { ...task, text: editText } : task
  );
  setTasks(updatedTasks);
  setIsEditing(null);
  setEditText("");
};

const handleCancelEdit = () => {
  setIsEditing(null);
  setEditText("");
};

  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      <h1>📝 To-Do List</h1>

      {/* Dark mode toggle button */}
      <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="input-area">
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Add</button>
      </div>

      <ul className="task-list">
  {tasks.length === 0 ? (
    <p>No tasks yet 🙌</p>
  ) : (
    tasks.map((task, index) => (
      <li key={index}>
        {isEditing === index ? (
          <>
            <input
              type="text"
              value={editText}
              onChange={handleEditChange}
              autoFocus
            />
            <button onClick={() => handleSaveEdit(index)}>💾</button>
            <button onClick={handleCancelEdit}>❌</button>
          </>
        ) : (
          <>
            <span
              className={task.completed ? "completed" : ""}
              onClick={() => toggleTaskCompletion(index)}
            >
              {task.text}
            </span>
            <button onClick={() => handleDeleteTask(index)}>❌</button>
            <button onClick={() => startEditing(index)}>✏️</button>
          </>
        )}
      </li>
    ))
  )}
</ul>
    </div>
  );
}

export default App;
