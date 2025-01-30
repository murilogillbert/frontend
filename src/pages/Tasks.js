import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Box, Button, Alert } from "@mui/material";
import TaskForm from "../components/Tasks/TaskForm";
import TaskList from "../components/Tasks/TaskList";
import { parseISO } from "date-fns";

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

      const tasksFormatted = response.data.map(task => ({
        ...task,
        dueDate: task.dueDate ? parseISO(task.dueDate) : null,
        recurrenceDays: Array.isArray(task.recurrenceDays) 
          ? task.recurrenceDays 
          : task.recurrenceDays 
            ? String(task.recurrenceDays).split(",").map(Number) 
            : [],
      }));

      setTasks(tasksFormatted);
    } catch (error) {
      console.error("Erro ao carregar as tarefas:", error);
      setError("Erro ao carregar as tarefas.");
    }
  };

  const handleSaveTask = async (task) => {
    const token = localStorage.getItem("accessToken");

    const taskData = {
      ...task,
      recurrenceDays: Array.isArray(task.recurrenceDays) ? task.recurrenceDays.join(",") : "",
    };

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

      setEditingTask(null);
      setShowForm(false);
      fetchTasks(token);
    } catch (error) {
      setError("Erro ao salvar a tarefa.");
      console.error("Erro ao salvar a tarefa:", error.response?.data || error.message);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>Minhas Tarefas</Typography>

      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess("")}>{success}</Alert>}

      {/* Botão para adicionar nova tarefa */}
      <Box display="flex" justifyContent="flex-end" marginBottom="1rem">
        <Button variant="contained" color="primary" onClick={() => { setShowForm(true); setEditingTask(null); }}>
          + Adicionar Tarefa
        </Button>
      </Box>

      {/* Exibir o formulário quando necessário */}
      {showForm && (
        <Box marginBottom="1rem">
          <TaskForm
            taskToEdit={editingTask}
            onSave={(task) => {
              handleSaveTask(task);
              setShowForm(false);
            }}
          />
        </Box>
      )}

      {/* Lista de tarefas */}
      <TaskList 
        tasks={tasks} 
        onEdit={(task) => { setEditingTask(task); setShowForm(true); }} 
      />
    </Container>
  );
};

export default Tasks;
