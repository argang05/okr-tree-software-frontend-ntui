"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit } from "lucide-react";
import CircularProgress from "@/components/CircularProgress";
import { toast } from "sonner";
import { userService, taskService } from "@/services/api";

export default function MyTasksPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState({});
  const [progressSaveLoading , setProgressSaveLoading] = useState(false)
  
  // Load user's tasks
  useEffect(() => {
    const loadTasks = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await userService.getUserTasks(user.empId);
          setTasks(response.data || []);
          setIsLoading(false);
        } catch (error) {
          console.error("Error loading tasks:", error);
          toast.error("Failed to load your tasks");
          setIsLoading(false);
        }
      }
    };
    
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (!loading && isAuthenticated && user) {
      loadTasks();
    }
  }, [isAuthenticated, loading, user, router]);
  
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
  
  // Get status badge based on task status and progress
  const getStatusBadge = (status, progress) => {
    // If progress is 100%, show as completed regardless of status
    if (progress === 100) {
      return (
        <Badge className="bg-green-100 text-green-800 uppercase text-xs">
          COMPLETED
        </Badge>
      );
    }
    
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
  
  // Toggle edit mode for a task
  const toggleEditMode = (taskId) => {
    setEditMode(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };
  
  // Update task progress
  const updateTaskProgress = async (taskId, progress) => {
    setProgressSaveLoading(true);
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;
    
    try {
      // Determine appropriate status based on progress
      let newStatus;
      if (progress === 100) {
        newStatus = "COMPLETED";
      } else if (taskToUpdate.progressPercentage === 100 && progress < 100) {
        newStatus = "PENDING";
      } else {
        newStatus = taskToUpdate.status;
      }
      
      // Create updated task data
      const updatedTask = {
        ...taskToUpdate,
        progressPercentage: progress,
        status: newStatus
      };
      
      await taskService.updateTask(taskId, updatedTask);
      
      // Update local state
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, progressPercentage: progress, status: newStatus } : task
      ));
      setProgressSaveLoading(false);
      
      toast.success("Task progress updated");
      toggleEditMode(taskId);
    } catch (error) {
      setProgressSaveLoading(false);
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };
  
  // Update task status
  const updateTaskStatus = async (taskId, status) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;
    
    try {
      // Create updated task data
      const updatedTask = {
        ...taskToUpdate,
        status
      };
      
      await taskService.updateTask(taskId, updatedTask);
      
      // Update local state
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status } : task
      ));
      
      toast.success("Task status updated");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-slate-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">My Tasks</h1>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-lg text-slate-600">Loading your tasks...</p>
          </div>
        ) : tasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map(task => (
              <Card key={task.id} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(task.status, task.progressPercentage)}
                        <div className="flex items-center text-xs text-slate-500">
                          <Calendar size={12} className="mr-1" /> 
                          {formatDate(task.dueDate)}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => toggleEditMode(task.id)}
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {task.description}
                  </p>
                  
                  {editMode[task.id] ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Progress: {task.progressPercentage}%</label>
                        <Slider 
                          defaultValue={[task.progressPercentage]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(value) => {
                            const newProgress = value[0];
                            // If progress was 100% and now it's not, revert to PENDING status
                            // If progress is 100%, set to COMPLETED
                            let newStatus;
                            if (newProgress === 100) {
                              newStatus = "COMPLETED";
                            } else if (task.progressPercentage === 100 && newProgress < 100) {
                              newStatus = "PENDING";
                            } else {
                              newStatus = task.status;
                            }
                            
                            setTasks(tasks.map(t => 
                              t.id === task.id ? { 
                                ...t, 
                                progressPercentage: newProgress,
                                status: newStatus
                              } : t
                            ));
                          }}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select
                          defaultValue={task.status}
                          onValueChange={(value) => updateTaskStatus(task.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mr-2"
                          onClick={() => toggleEditMode(task.id)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => updateTaskProgress(task.id, task.progressPercentage)}
                        >
                          {progressSaveLoading ? "Loading..." : "Save Progress"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <CircularProgress
                        percentage={task.progressPercentage || 0}
                        size={80}
                        strokeWidth={8}
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-lg">
            <h3 className="text-xl font-medium text-slate-700 mb-2">No tasks assigned to you</h3>
            <p className="text-slate-600">
              When you&apos;re assigned tasks, they will appear here
            </p>
          </div>
        )}
      </main>
    </div>
  );
} 