// src/pages/Tasks.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Box, Button, Alert } from "@mui/material";
import TaskForm from "../components/Tasks/TaskForm";
import TaskList from "../components/Tasks/TaskList";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) fetchTasks(token);
  }, []);

  const fetchTasks = async (token) => {
    try {
      const response = await axios.get("https://backend-todo-g1iq.onrender.com/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(response.data.map(task => ({
        ...task,
        recurrenceDays: task.recurrenceDays ? task.recurrenceDays.split(",").map(Number) : [],
      })));
    } catch {
      setError("Erro ao carregar as tarefas.");
    }
  };

  const handleSaveTask = async (task) => {
    const token = localStorage.getItem("accessToken");
    const taskData = { ...task, recurrenceDays: task.recurrenceDays.join(",") };

    try {
      if (editingTask) {
        await axios.patch(`https://backend-todo-g1iq.onrender.com/todos/${editingTask.id}`, taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Tarefa atualizada com sucesso!");
      } else {
        await axios.post("https://backend-todo-g1iq.onrender.com/todos", taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Tarefa criada com sucesso!");
      }

      setShowForm(false);
      setEditingTask(null);
      fetchTasks(token);
    } catch {
      setError("Erro ao salvar a tarefa.");
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    const token = localStorage.getItem("accessToken");
    
    try {
      await axios.patch(`https://backend-todo-g1iq.onrender.com/todos/${taskId}`, { completed }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(token);
    } catch {
      setError("Erro ao atualizar a tarefa.");
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>Minhas Tarefas</Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Button variant="contained" color="primary" onClick={() => setShowForm(true)}>
        Adicionar Nova Tarefa
      </Button>

      {showForm && <TaskForm onSave={handleSaveTask} taskToEdit={editingTask} />}
      
      <TaskList tasks={tasks} onEdit={setEditingTask} onToggleComplete={handleToggleComplete} />
    </Container>
  );
};

export default Tasks;
