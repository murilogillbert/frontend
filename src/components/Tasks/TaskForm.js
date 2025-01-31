import React, { useState, useEffect } from "react";
import {
  Box, Button, TextField, MenuItem, Select, FormControlLabel, Switch, Typography
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { parseISO } from "date-fns";

const TaskForm = ({ onSave, taskToEdit }) => {
  const [task, setTask] = useState({
    title: "",
    dueDate: null,
    category: "",
    reminder: false,
    recurrenceDays: []
  });

  const categories = ["Trabalho", "Pessoal", "Estudos"];
  const daysOfWeek = [
    { label: "Dom", value: 0 }, { label: "Seg", value: 1 }, { label: "Ter", value: 2 },
    { label: "Qua", value: 3 }, { label: "Qui", value: 4 }, { label: "Sex", value: 5 }, { label: "Sáb", value: 6 }
  ];

  // ✅ Atualiza os dados se estiver editando uma tarefa
  useEffect(() => {
    if (taskToEdit) {
      setTask({
        ...taskToEdit,
        dueDate: taskToEdit.dueDate ? parseISO(taskToEdit.dueDate) : null, // 🔥 Converte string para Date
        recurrenceDays: Array.isArray(taskToEdit.recurrenceDays)
          ? taskToEdit.recurrenceDays
          : taskToEdit.recurrenceDays
            ? String(taskToEdit.recurrenceDays).split(",").map(Number)
            : []
      });
    }
  }, [taskToEdit]);

  const handleChange = (field, value) => {
    setTask(prev => ({ ...prev, [field]: value }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        display="flex"
        flexDirection="column"
        gap="1rem"
        padding="1rem"
        border="1px solid #ddd"
        borderRadius="8px"
        boxShadow="2px 2px 10px rgba(0,0,0,0.1)"
        backgroundColor="#f9f9f9"
      >
        <Typography variant="h6">{taskToEdit ? "Editar Tarefa" : "Nova Tarefa"}</Typography>

        {/* Campo de Título */}
        <TextField
          label="Título"
          value={task.title}
          onChange={(e) => handleChange("title", e.target.value)}
          fullWidth
          required
        />

        {/* Seletor de Data */}
        <DatePicker
          label="Data"
          value={task.dueDate}
          onChange={(date) => handleChange("dueDate", date)}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />

        {/* Seletor de Categoria */}
        <TextField
          select
          label="Categoria"
          value={task.category}
          onChange={(e) => handleChange("category", e.target.value)}
          fullWidth
        >
          <MenuItem value="">Nenhuma</MenuItem>
          {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
        </TextField>

        {/* Ativar Lembrete */}
        <FormControlLabel
          control={<Switch checked={task.reminder} onChange={() => handleChange("reminder", !task.reminder)} />}
          label="Ativar Lembrete"
        />

        {/* Seletor de Dias de Recorrência */}
        {/*
        <Select
          multiple
          value={task.recurrenceDays || []}
          onChange={(e) => {
            const selectedDays = e.target.value.map(Number);
            console.log("Dias de recorrência selecionados:", selectedDays); // ✅ LOG para depuração
            handleChange("recurrenceDays", selectedDays);
          }}
          renderValue={(selected) =>
            selected.map((value) => daysOfWeek.find((day) => day.value === value)?.label).join(", ")
          }
          fullWidth
        >
          {daysOfWeek.map((day) => (
            <MenuItem key={day.value} value={day.value}>
              {day.label}
            </MenuItem>
          ))}
        </Select>
        */}
        {/* Botão de Salvar */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            console.log("Dados antes de enviar para onSave:", task); // ✅ LOG para verificar o que está sendo salvo
            onSave(task);
          }}
          disabled={!task.title}
        >
          {taskToEdit ? "Atualizar" : "Criar"}
        </Button>

      </Box>
    </LocalizationProvider>
  );
};

export default TaskForm;
