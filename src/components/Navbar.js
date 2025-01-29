import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // Verifica se o usuário está autenticado (com base no token no localStorage)
  const isAuthenticated = !!localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Remove o token do localStorage
    navigate("/login"); // Redireciona para a página de login
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Nome do app */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            "&:hover": {
              color: "yellow",
            },
          }}
          onClick={() => navigate("/")}
        >
          Meu To-Do App
        </Typography>

        {/* Links para as seções */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" href="#about">
            Sobre
          </Button>
          <Button color="inherit" href="#creator">
            Criador
          </Button>
        </Box>

        {/* Botões para usuários autenticados ou não autenticados */}
        <Box sx={{ marginLeft: "auto", display: "flex", gap: 2 }}>
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={() => navigate("/tasks")}>
                Minhas Tarefas
              </Button>
              <Button variant="outlined" color="inherit" onClick={handleLogout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" href="/login">
                Login
              </Button>
              <Button variant="outlined" color="inherit" href="/register">
                Cadastro
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
