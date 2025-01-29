import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState(""); // Mensagem de erro
  const [success, setSuccess] = useState(""); // Mensagem de sucesso
  const navigate = useNavigate(); // Para redirecionar o usuário

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Limpa erro antes de enviar
    setSuccess(""); // Limpa mensagens de sucesso

    axios
      .post("https://backend-todo-g1iq.onrender.com/auth/register", formData)

      .then((response) => {
        setSuccess("Cadastro realizado com sucesso! Redirecionando para o login...");
        setTimeout(() => {
          navigate("/login"); // Redireciona após sucesso
        }, 2000);
      })
      .catch((error) => {
        if (error.response?.data?.message) {
          // Exibe a mensagem específica enviada pelo backend
          setError(Array.isArray(error.response.data.message) ? error.response.data.message.join(", ") : error.response.data.message);
        } else {
          setError("Erro no cadastro. Tente novamente.");
        }
        console.error("Erro no cadastro:", error.response?.data || error.message);
      });
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Cadastro
      </Typography>
      {error && <Alert severity="error" style={{ marginBottom: "1rem" }}>{error}</Alert>}
      {success && <Alert severity="success" style={{ marginBottom: "1rem" }}>{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap="1rem">
          <TextField
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
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
          <TextField
            label="Celular"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            required
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Cadastrar
          </Button>
        </Box>
      </form>
      <Typography variant="body2" align="center" style={{ marginTop: "1rem" }}>
        Já possui uma conta?{" "}
        <Link to="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
          Faça login aqui
        </Link>
      </Typography>
    </Container>
  );
};

export default Register;
