// src/components/Tasks/TaskItem.js
import React from "react";
import { Box, Typography, IconButton, Checkbox } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const TaskItem = ({ task, onEdit, onToggleComplete }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="1rem"
      border="1px solid #ddd"
      borderRadius="8px"
      marginBottom="1rem"
      style={{ backgroundColor: task.completed ? "#e0ffe0" : "#fff" }}
    >
      <Box display="flex" alignItems="center" gap="1rem">
        <Checkbox checked={task.completed} onChange={() => onToggleComplete(task.id, !task.completed)} />
        <Typography variant="h6" style={{ textDecoration: task.completed ? "line-through" : "none" }}>
          {task.title}
        </Typography>
      </Box>

      <IconButton onClick={() => onEdit(task)}>
        <EditIcon />
      </IconButton>
    </Box>
  );
};

export default TaskItem;
