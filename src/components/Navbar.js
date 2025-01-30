import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // Verifica se o usuário está autenticado
  const isAuthenticated = !!localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Remove o token
    navigate("/login"); // Redireciona para login
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2", padding: "0.5rem 0" }}>
      <Toolbar>
        {/* Nome do App - Clicável para Home */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "white",
            fontWeight: "bold",
            "&:hover": { color: "yellow", transition: "0.3s" },
          }}
        >
          To-Do App
        </Typography>

        {/* Links de navegação */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component="a" href="#about">
            Sobre
          </Button>
          <Button color="inherit" component="a" href="#creator">
            Criador
          </Button>
        </Box>

        {/* Botões Dinâmicos */}
        <Box sx={{ marginLeft: "auto", display: "flex", gap: 2 }}>
          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/tasks"
                sx={{ transition: "0.3s", "&:hover": { transform: "scale(1.05)" } }}
              >
                Minhas Tarefas
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleLogout}
                sx={{
                  borderColor: "white",
                  "&:hover": { backgroundColor: "white", color: "#1976d2" },
                }}
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ transition: "0.3s", "&:hover": { transform: "scale(1.05)" } }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                component={RouterLink}
                to="/register"
                sx={{
                  borderColor: "white",
                  "&:hover": { backgroundColor: "white", color: "#1976d2" },
                }}
              >
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
