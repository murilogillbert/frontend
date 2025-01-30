// src/components/Tasks/TaskForm.js
import React, { useState } from "react";
import {
  Box, Button, TextField, MenuItem, Select, FormControlLabel, Switch, Typography
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const TaskForm = ({ onSave, taskToEdit }) => {
  const [task, setTask] = useState(
    taskToEdit || { title: "", dueDate: null, category: "", reminder: false, recurrenceDays: [] }
  );

  const categories = ["Trabalho", "Pessoal", "Estudos"];
  const daysOfWeek = [
    { label: "Dom", value: 0 }, { label: "Seg", value: 1 }, { label: "Ter", value: 2 },
    { label: "Qua", value: 3 }, { label: "Qui", value: 4 }, { label: "Sex", value: 5 }, { label: "Sáb", value: 6 }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box display="flex" flexDirection="column" gap="1rem" padding="1rem" border="1px solid #ddd" borderRadius="8px">
        <Typography variant="h6">{taskToEdit ? "Editar Tarefa" : "Nova Tarefa"}</Typography>

        <TextField
          label="Título"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          fullWidth
          required
        />

        <DatePicker
          label="Data"
          value={task.dueDate}
          onChange={(date) => setTask({ ...task, dueDate: date })}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />

        <TextField select label="Categoria" value={task.category} onChange={(e) => setTask({ ...task, category: e.target.value })} fullWidth>
          <MenuItem value="">Nenhuma</MenuItem>
          {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
        </TextField>

        <FormControlLabel
          control={<Switch checked={task.reminder} onChange={() => setTask({ ...task, reminder: !task.reminder })} />}
          label="Ativar Lembrete"
        />

        <Select
          multiple
          value={task.recurrenceDays || []} // 🔥 Garante que não seja undefined/null
          onChange={(e) => setTask({ ...task, recurrenceDays: e.target.value.map(Number) })}
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


        <Button variant="contained" color="primary" onClick={() => onSave(task)}>
          {taskToEdit ? "Atualizar" : "Criar"}
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default TaskForm;
