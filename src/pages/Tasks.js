import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Box, Button, TextField, Alert, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const [tasks, setTasks] = useState([]); // Lista de tarefas
  const [newTask, setNewTask] = useState(""); // Nome da nova tarefa
  const [error, setError] = useState(""); // Mensagem de erro
  const [success, setSuccess] = useState(""); // Mensagem de sucesso
  const navigate = useNavigate();

  // Verifica se o usuário está autenticado
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login"); // Redireciona para o login se o usuário não estiver autenticado
    } else {
      fetchTasks(token); // Puxa as tarefas do backend
    }
  }, [navigate]);

  // Função para buscar as tarefas do backend
  const fetchTasks = async (token) => {
    try {
      const response = await axios.get("https://backend-todo-g1iq.onrender.com/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data); // Atualiza a lista de tarefas
    } catch (err) {
      setError("Erro ao carregar as tarefas. Tente novamente.");
      console.error(err);
    }
  };

  // Função para criar uma nova tarefa
  const handleCreateTask = async () => {
    const token = localStorage.getItem("accessToken");

    if (!newTask) {
      setError("O nome da tarefa não pode estar vazio.");
      return;
    }

    try {
      const response = await axios.post(
        "https://backend-todo-g1iq.onrender.com/todos",
        { title: newTask },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Tarefa criada com sucesso!");
      setNewTask(""); // Limpa o campo de entrada
      fetchTasks(token); // Recarrega a lista de tarefas
    } catch (err) {
      setError("Erro ao criar a tarefa. Tente novamente.");
      console.error(err);
    }
  };

  // Função para excluir uma tarefa
  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("accessToken");

    try {
      await axios.delete(`https://backend-todo-g1iq.onrender.com/todos/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("Tarefa excluída com sucesso!");
      fetchTasks(token); // Recarrega a lista de tarefas
    } catch (err) {
      setError("Erro ao excluir a tarefa. Tente novamente.");
      console.error(err);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Suas Tarefas
      </Typography>

      {/* Mensagens de Erro e Sucesso */}
      {error && <Alert severity="error" style={{ marginBottom: "1rem" }}>{error}</Alert>}
      {success && <Alert severity="success" style={{ marginBottom: "1rem" }}>{success}</Alert>}

      {/* Campo para criar nova tarefa */}
      <Box display="flex" flexDirection="row" alignItems="center" gap="1rem" marginBottom="2rem">
        <TextField
          label="Nova Tarefa"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleCreateTask}>
          Adicionar
        </Button>
      </Box>

      {/* Lista de tarefas */}
      {tasks.length === 0 ? (
        <Typography variant="body1">Nenhuma tarefa encontrada.</Typography>
      ) : (
        tasks.map((task) => (
          <Box
            key={task.id}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">{task.title}</Typography>
            <IconButton onClick={() => handleDeleteTask(task.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))
      )}
    </Container>
  );
};

export default Tasks;
