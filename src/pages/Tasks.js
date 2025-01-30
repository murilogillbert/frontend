import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Box, Button, Alert } from "@mui/material";
import TaskForm from "../components/Tasks/TaskForm";
import TaskList from "../components/Tasks/TaskList";
import { parseISO } from "date-fns"; // ✅ Importado para converter strings de data

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
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

      // ✅ Converte `dueDate` corretamente e garante `recurrenceDays` como array
      const tasksFormatted = response.data.map(task => ({
        ...task,
        dueDate: task.dueDate ? parseISO(task.dueDate) : null, // 🔥 Converte string para Date
        recurrenceDays: 
          Array.isArray(task.recurrenceDays) 
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
      fetchTasks(token);
    } catch (error) {
      setError("Erro ao salvar a tarefa.");
      console.error("Erro ao salvar a tarefa:", error.response?.data || error.message);
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

      <TaskList 
        tasks={tasks} 
        onEdit={setEditingTask} 
        onToggleComplete={handleToggleComplete} 
        onSave={handleSaveTask} // ✅ Passando handleSaveTask corretamente
        editingTask={editingTask} // ✅ Passando a tarefa sendo editada
      />
    </Container>
  );
};

export default Tasks;
