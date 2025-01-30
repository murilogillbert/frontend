import React, { useState } from "react";
import { Box, Typography, Button, MenuItem, Select } from "@mui/material";
import { format, addDays, subDays, startOfWeek, endOfWeek,parseISO } from "date-fns";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm"; // ✅ Importando o formulário

const TaskList = ({ tasks, onEdit, onToggleComplete, onSave }) => {
  const [viewMode, setViewMode] = useState("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingTask, setEditingTask] = useState(null); // ✅ Estado para a tarefa sendo editada

  // Define o intervalo baseado no filtro selecionado
  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const taskDate = task.dueDate ? parseISO(task.dueDate) : null; // ✅ Converte string para Date
  
      if (!taskDate) return false; // Evita erros se a data for null
  
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

        <Box>
          <Button onClick={() => setSelectedDate(viewMode === "day" ? subDays(selectedDate, 1) : subDays(selectedDate, 7))}>
            {"<"} Anterior
          </Button>
          <Typography component="span" margin="0 1rem">
            {viewMode === "day"
              ? format(selectedDate, "dd/MM/yyyy")
              : `${format(startOfWeek(selectedDate), "dd/MM")} - ${format(endOfWeek(selectedDate), "dd/MM")}`}
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
          <Box key={task.id}>
            {/* Componente de Item da Tarefa */}
            <TaskItem
              task={task}
              onEdit={() => setEditingTask(task)} // ✅ Define a tarefa em edição
              onToggleComplete={onToggleComplete}
            />

            {/* Formulário aparece abaixo da tarefa em edição */}
            {editingTask?.id === task.id && (
              <TaskForm
                taskToEdit={editingTask}
                onSave={(updatedTask) => {
                  onSave(updatedTask);
                  setEditingTask(null); // ✅ Fecha o formulário após salvar
                }}
              />
            )}
          </Box>
        ))
      )}
    </Box>
  );
};

export default TaskList;
