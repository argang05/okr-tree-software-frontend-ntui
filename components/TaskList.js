"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CircularProgress from "@/components/CircularProgress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, Trash2 } from "lucide-react";
import TaskDialog from "./TaskDialog";
import { toast } from "sonner";
import { taskService } from "@/services/api";
import ConfirmDialog from "./ConfirmDialog";

export default function TaskList({ tasks = [], onTaskUpdate, employeeMap = {} }) {
  const [editTask, setEditTask] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Get status badge based on task status
  const getStatusBadge = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
    };
    
    return (
      <Badge className={`${colors[status] || colors.PENDING} uppercase text-xs`}>
        {status?.replace("_", " ")}
      </Badge>
    );
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle editing a task
  const handleEditTask = (task) => {
    setEditTask(task);
    setIsEditDialogOpen(true);
  };

  // Handle submitting task edits
  const handleUpdateTask = async (data) => {
    try {
      await taskService.updateTask(editTask.id, data);
      toast.success("Task updated successfully");
      setIsEditDialogOpen(false);
      onTaskUpdate();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async () => {
      if (!taskToDelete) return;

      try {
        await taskService.deleteTask(taskToDelete);
        toast.success("Task deleted successfully");
        onTaskUpdate();
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task");
      } finally {
        setTaskToDelete(null);
        setIsDeleteConfirmOpen(false);
      }
    };

  if (tasks.length === 0) {
    return (
      <div className="text-center p-4 text-slate-500 italic">
        No tasks found for this objective
      </div>
    );
  }

  return (
    <div className="space-y-3 my-3">
      <h4 className="font-medium text-slate-700 mb-2">Tasks</h4>
      
      {tasks.map(task => (
        <Card key={task.id} className="p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h5 className="font-medium">{task.title}</h5>
                {getStatusBadge(task.status)}
              </div>
              
              <p className="text-sm text-slate-600 mb-2">{task.description}</p>
              <p className="text-sm text-slate-600 mb-2 font-semibold">Task Assumption: {task.assumption ? task.assumption : "No Asssumption"}</p>
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
                
                {task.assignedTo && task.assignedTo.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="mr-1">Assigned to:</span>
                    {task.assignedTo.map(empId => (
                      <span key={empId} className="bg-slate-100 px-2 py-0.5 rounded-full text-xs">
                        {employeeMap[empId] || empId}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <CircularProgress percentage={task.progressPercentage || 0} size={45} />
              
              <div className="flex gap-1 mt-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={() => handleEditTask(task)}
                >
                  <Edit size={15} />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-red-500 hover:text-red-700" 
                  onClick={() => {
                    setTaskToDelete(task.id);
                    setIsDeleteConfirmOpen(true);
                  }}
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
      
      {/* Edit Task Dialog */}
      <TaskDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleUpdateTask}
        title="Edit Task"
        initialData={editTask}
        employeeMap={employeeMap}
      />
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
      />
    </div>
  );
} 