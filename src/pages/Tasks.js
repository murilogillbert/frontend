// src/pages/Tasks.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Box, Button, Alert } from "@mui/material";
import TaskForm from "../components/Tasks/TaskForm";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false); // Controla a exibição do formulário
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

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>Minhas Tarefas</Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Button variant="contained" color="primary" onClick={() => setShowForm(true)}>
        Adicionar Nova Tarefa
      </Button>

      {showForm && <TaskForm onSave={handleSaveTask} taskToEdit={editingTask} />}
      
      <Box marginTop="2rem">
        {tasks.length === 0 ? (
          <Typography variant="body1">Nenhuma tarefa encontrada.</Typography>
        ) : (
          tasks.map((task) => (
            <Box key={task.id} padding="1rem" border="1px solid #ddd" borderRadius="8px" marginBottom="1rem">
              <Typography variant="h6">{task.title}</Typography>
              <Button variant="outlined" onClick={() => { setEditingTask(task); setShowForm(true); }}>Editar</Button>
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
};

export default Tasks;
