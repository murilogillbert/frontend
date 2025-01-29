import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState(""); // Mensagem de erro
  const navigate = useNavigate(); // Para redirecionar o usuário

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Limpar erro antes de enviar

    axios
      .post("backend-todo-production-7edc.up.railway.app/auth/login", formData) // Ajuste para endpoint correto
      .then((response) => {
        const { accessToken } = response.data; // JWT retornado pelo backend

        if (accessToken) {
          // Salva o token no localStorage
          localStorage.setItem("accessToken", accessToken);

          // Redireciona para a tela de tarefas
          navigate("/tasks");
        } else {
          setError("Credenciais inválidas."); // Exibe erro se o token não for retornado
        }
      })
      .catch((error) => {
        setError("Erro ao fazer login. Verifique suas credenciais.");
        console.error("Erro no login:", error.response?.data || error.message);
      });
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      {error && <Alert severity="error" style={{ marginBottom: "1rem" }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap="1rem">
          <TextField
            label="Nome ou Email"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Senha"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Login
          </Button>
        </Box>
      </form>
      <Typography variant="body2" align="center" style={{ marginTop: "1rem" }}>
        Não possui uma conta?{" "}
        <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
          Cadastre-se aqui
        </Link>
      </Typography>
    </Container>
  );
};

export default Login;
