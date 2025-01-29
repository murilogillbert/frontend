// src/components/Tasks/TaskList.js
import React, { useState } from "react";
import { Box, Typography, Button, MenuItem, Select, IconButton, Checkbox } from "@mui/material";
import { format, addDays, subDays, startOfWeek, endOfWeek } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onEdit, onToggleComplete }) => {
  const [viewMode, setViewMode] = useState("week"); // "day" ou "week"
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Define o intervalo baseado no filtro selecionado
  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      
      if (viewMode === "day") {
        return format(taskDate, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
      } else {
        const weekStart = startOfWeek(selectedDate);
        const weekEnd = endOfWeek(selectedDate);
        return taskDate >= weekStart && taskDate <= weekEnd;
      }
    });
  };

  return (
    <Box marginTop="2rem">
      {/* Seletor de Filtro */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="1rem">
        <Select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
          <MenuItem value="day">Exibir Dia</MenuItem>
          <MenuItem value="week">Exibir Semana</MenuItem>
        </Select>

        {/* Botões para alterar período */}
        <Box>
          <Button onClick={() => setSelectedDate(viewMode === "day" ? subDays(selectedDate, 1) : subDays(selectedDate, 7))}>
            {"<"} Anterior
          </Button>
          <Typography component="span" margin="0 1rem">
            {viewMode === "day" ? format(selectedDate, "dd/MM/yyyy") : `${format(startOfWeek(selectedDate), "dd/MM")} - ${format(endOfWeek(selectedDate), "dd/MM")}`}
          </Typography>
          <Button onClick={() => setSelectedDate(viewMode === "day" ? addDays(selectedDate, 1) : addDays(selectedDate, 7))}>
            Próximo {">"}
          </Button>
        </Box>
      </Box>

      {/* Lista de Tarefas Filtradas */}
      {getFilteredTasks().length === 0 ? (
        <Typography variant="body1">Nenhuma tarefa encontrada.</Typography>
      ) : (
        getFilteredTasks().map(task => (
          <TaskItem key={task.id} task={task} onEdit={onEdit} onToggleComplete={onToggleComplete} />
        ))
      )}
    </Box>
  );
};

export default TaskList;
