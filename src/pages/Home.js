import React from "react";
import { Container, Typography, Box, Button, Avatar } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Home = () => {
  return (
    <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
      {/* Seção inicial */}
      <Box textAlign="center" id="home">
        <Typography variant="h3" component="h1" gutterBottom>
          Bem-vindo ao Meu To-Do App!
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
            style={{ marginRight: "1rem" }}
          >
            Começar Agora
          </Button>
          <Button variant="outlined" color="primary" size="large" component={RouterLink} to="/login">
            Faça Login
          </Button>
        </Box>
      </Box>

      {/* Seção Sobre */}
      <Box id="about" style={{ marginTop: "4rem", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Sobre o App
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Este aplicativo foi criado para ajudar você a gerenciar suas tarefas do dia a dia.
          É simples, intuitivo e eficiente, permitindo que você mantenha o controle de tudo
          o que precisa ser feito.
        </Typography>
      </Box>

      {/* Seção Criador */}
      <Box id="creator" style={{ marginTop: "4rem", textAlign: "center" }}>
        <Avatar
          alt="Criador"
          src="https://github.com/murilogillbert.png"
          style={{ width: "150px", height: "150px", margin: "0 auto" }}
        />
        <Typography variant="h4" gutterBottom style={{ marginTop: "1rem" }}>
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
