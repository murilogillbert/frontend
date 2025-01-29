import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Box, Button, TextField, Alert, IconButton, FormControlLabel, Switch, MenuItem, Select } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import RepeatIcon from "@mui/icons-material/Repeat";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: null,
    category: "",
    reminder: false,
    recurrenceDays: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null); // Para identificar qual tarefa está sendo editada
  const navigate = useNavigate();

  // Lista fixa de categorias
  const categories = ["Trabalho", "Pessoal", "Estudos"];

  // Dias da semana para recorrência
  const daysOfWeek = [
    { label: "Dom", value: 0 },
    { label: "Seg", value: 1 },
    { label: "Ter", value: 2 },
    { label: "Qua", value: 3 },
    { label: "Qui", value: 4 },
    { label: "Sex", value: 5 },
    { label: "Sáb", value: 6 },
  ];

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    } else {
      fetchTasks(token);
    }
  }, [navigate]);

  // Busca as tarefas do backend
  const fetchTasks = async (token) => {
    try {
      const response = await axios.get("https://backend-todo-g1iq.onrender.com/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // 🔹 Garante que `recurrenceDays` seja sempre um array
      const tasksFormatted = response.data.map(task => ({
        ...task,
        recurrenceDays: Array.isArray(task.recurrenceDays)
          ? task.recurrenceDays
          : task.recurrenceDays
          ? task.recurrenceDays.split(",").map(Number)
          : [], // Se for `null`, transforma em um array vazio
      }));
  
      setTasks(tasksFormatted);
    } catch (err) {
      setError("Erro ao carregar as tarefas.");
      console.error(err);
    }
  };
  

  // Cria ou edita uma tarefa
  const handleSaveTask = async () => {
    const token = localStorage.getItem("accessToken");
  
    if (!newTask.title) {
      setError("O nome da tarefa não pode estar vazio.");
      return;
    }
  
    const taskData = {
      ...newTask,
      recurrenceDays: Array.isArray(newTask.recurrenceDays)
        ? newTask.recurrenceDays.join(",") // Converte array para string
        : "", // Se for `null` ou `undefined`, envia uma string vazia
    };
  
    try {
      if (editingTaskId) {
        await axios.patch(`https://backend-todo-g1iq.onrender.com/todos/${editingTaskId}`, taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Tarefa atualizada com sucesso!");
      } else {
        await axios.post("https://backend-todo-g1iq.onrender.com/todos", taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Tarefa criada com sucesso!");
      }
  
      setNewTask({ title: "", dueDate: null, category: "", reminder: false, recurrenceDays: [] });
      setEditingTaskId(null);
      fetchTasks(token);
    } catch (err) {
      setError("Erro ao salvar a tarefa.");
      console.error(err);
    }
  };
  
  // Exclui uma tarefa
  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("accessToken");

    try {
      await axios.delete(`https://backend-todo-g1iq.onrender.com/todos/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Tarefa excluída com sucesso!");
      fetchTasks(token);
    } catch (err) {
      setError("Erro ao excluir a tarefa.");
      console.error(err);
    }
  };

  // Preenche o formulário para edição de uma tarefa
  const handleEditTask = (task) => {
    setNewTask({
      title: task.title,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      category: task.category || "",
      reminder: task.reminder,
      recurrenceDays: task.recurrenceDays || [],
    });
    setEditingTaskId(task.id);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" style={{ marginTop: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          Minhas Tarefas
        </Typography>

        {error && <Alert severity="error" style={{ marginBottom: "1rem" }}>{error}</Alert>}
        {success && <Alert severity="success" style={{ marginBottom: "1rem" }}>{success}</Alert>}

        {/* Formulário de criação/edição */}
        <Box display="flex" flexDirection="column" gap="1rem" padding="1rem" border="1px solid #ddd" borderRadius="8px" marginBottom="2rem">
          <TextField label="Título" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} fullWidth required />
          <DatePicker label="Data" value={newTask.dueDate} onChange={(date) => setNewTask({ ...newTask, dueDate: date })} renderInput={(params) => <TextField {...params} fullWidth />} />
          <TextField select label="Categoria" value={newTask.category} onChange={(e) => setNewTask({ ...newTask, category: e.target.value })} fullWidth>
            <MenuItem value="">Nenhuma</MenuItem>
            {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </TextField>
          <FormControlLabel control={<Switch checked={newTask.reminder} onChange={() => setNewTask({ ...newTask, reminder: !newTask.reminder })} />} label="Ativar Lembrete" />
          <TextField select multiple label="Recorrência" value={newTask.recurrenceDays} onChange={(e) => setNewTask({ ...newTask, recurrenceDays: e.target.value })} fullWidth>
            {daysOfWeek.map((day) => <MenuItem key={day.value} value={day.value}>{day.label}</MenuItem>)}
          </TextField>
          <Button variant="contained" color="primary" onClick={handleSaveTask}>
            {editingTaskId ? "Atualizar Tarefa" : "Adicionar Tarefa"}
          </Button>
        </Box>

        {/* Lista de Tarefas */}
        {tasks.length === 0 ? <Typography variant="body1">Nenhuma tarefa encontrada.</Typography> : tasks.map((task) => (
          <Box key={task.id} display="flex" justifyContent="space-between" alignItems="center" padding="1rem" border="1px solid #ddd" borderRadius="8px" marginBottom="1rem">
            <Typography variant="h6">{task.title}</Typography>
            <Box>
              {task.reminder && <AlarmOnIcon color="secondary" />}
              {task.recurrenceDays.length > 0 && <RepeatIcon />}
              <IconButton onClick={() => handleEditTask(task)}><EditIcon /></IconButton>
              <IconButton onClick={() => handleDeleteTask(task.id)}><DeleteIcon /></IconButton>
            </Box>
          </Box>
        ))}
      </Container>
    </LocalizationProvider>
  );
};

export default Tasks;
