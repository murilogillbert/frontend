import React from "react";
import { Container, Typography, Box, Button, Avatar } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Home = () => {
  return (
    <Container maxWidth="lg" style={{ marginTop: "4rem", textAlign: "center" }}>
      
      {/* Seção inicial */}
      <Box 
        id="home" 
        sx={{
          backgroundColor: "#f5f5f5",
          padding: "4rem 2rem",
          borderRadius: "12px",
          boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)"
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          🚀 Bem-vindo ao To-Do App!
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Gerencie suas tarefas diárias de forma simples e eficiente.
        </Typography>
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/register"
            sx={{
              marginRight: "1rem",
              padding: "12px 24px",
              transition: "0.3s",
              "&:hover": { transform: "scale(1.05)" }
            }}
          >
            Começar Agora
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={RouterLink}
            sx={{
              padding: "12px 24px",
              transition: "0.3s",
              "&:hover": { transform: "scale(1.05)" }
            }}
            to="/login"
          >
            Faça Login
          </Button>
        </Box>
      </Box>

      {/* Seção Sobre */}
      <Box 
        id="about" 
        sx={{ marginTop: "5rem", padding: "2rem", textAlign: "center" }}
      >
        <Typography variant="h4" gutterBottom>
          📌 Sobre o App
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Este aplicativo foi criado para ajudar você a gerenciar suas tarefas do dia a dia.
          Simples, intuitivo e eficiente, permitindo que você mantenha o controle de tudo
          o que precisa ser feito.
        </Typography>
      </Box>

      {/* Seção Criador */}
      <Box 
        id="creator" 
        sx={{ marginTop: "5rem", textAlign: "center", padding: "2rem" }}
      >
        <Avatar
          alt="Criador"
          src="https://github.com/murilogillbert.png"
          sx={{
            width: "150px",
            height: "150px",
            margin: "0 auto",
            transition: "0.3s",
            "&:hover": { transform: "scale(1.1)" }
          }}
        />
        <Typography variant="h4" gutterBottom sx={{ marginTop: "1rem" }}>
          Murilo Taques Gillbert
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Full Stack Developer @ UFMT | Bachelor's in Computer Science
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
