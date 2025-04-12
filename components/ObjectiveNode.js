"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CircularProgress from "@/components/CircularProgress";
import { ChevronDown, ChevronRight, Plus, ListTodo, Trash2, Edit, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ObjectiveDialog from "./ObjectiveDialog";
import TaskDialog from "./TaskDialog";
import TaskList from "./TaskList";
import ConfirmDialog from "./ConfirmDialog";
import { toast } from "sonner";
import { objectiveService, taskService } from "@/services/api";

export default function ObjectiveNode({ 
  objective, 
  level, 
  onUpdate, 
  employeeMap,
  expandAll = false,
  collapseAll = false
}) {
  const [isExpanded, setIsExpanded] = useState(expandAll);
  const [showTasks, setShowTasks] = useState(false);
  const [isEditObjectiveOpen, setIsEditObjectiveOpen] = useState(false);
  const [isAddObjectiveOpen, setIsAddObjectiveOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [isTaskLoading, setIsTaskLoading] = useState(false);

  // Update isExpanded when expandAll or collapseAll changes
  useEffect(() => {
    if (expandAll) {
      setIsExpanded(true);
    } else if (collapseAll) {
      setIsExpanded(false);
    }
  }, [expandAll, collapseAll]);

  // Function to format objective level as badge
  const getLevelBadge = () => {
    const colors = {
      COMPANY: "bg-red-100 text-red-800",
      DEPARTMENT: "bg-yellow-100 text-yellow-800",
      TEAMS: "bg-green-100 text-green-800",
      INDIVIDUALS: "bg-blue-100 text-blue-800",
    };
    
    return (
      <Badge className={`${colors[objective.level]} ml-2 uppercase text-xs`}>
        {objective.level}
      </Badge>
    );
  };

  // Get badge for node type
  const getNodeTypeBadge = () => {
    // If it's not the root level and has a parent, it's a subobjective/key result
    if (level > 0) {
      return (
        <Badge className="bg-purple-100 text-purple-800 ml-2 text-xs">
          Key Result/Subobjective
        </Badge>
      );
    }
    return null;
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge based on progress
  const getStatusBadge = () => {
    const progress = objective.progressPercentage || 0;
    if (progress >= 100) {
      return <Badge className="bg-green-100 text-green-800 ml-2">Completed</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800 ml-2">Pending</Badge>;
  };

  // Toggle expanded state of the node
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Toggle showing tasks
  const toggleShowTasks = async () => {
    // Load tasks if not loaded yet
    if (!tasksLoaded && !showTasks) {
      try {
        setIsTaskLoading(true);
        const response = await taskService.getTasksByObjective(objective.id);
        setTasks(response.data);
        setTasksLoaded(true);
        setIsTaskLoading(false);
      } catch (error) {
        console.error("Error loading tasks:", error);
        toast.error("Failed to load tasks");
        setIsTaskLoading(false);
      }
    }
    setShowTasks(!showTasks);
  };

  // Handle adding a new sub-objective
  const handleAddObjective = async (data) => {
    try {
      await objectiveService.createSubObjective(objective.id, data);
      toast.success("Sub-objective added successfully");
      setIsAddObjectiveOpen(false);
      onUpdate();
    } catch (error) {
      console.error("Error adding sub-objective:", error);
      toast.error("Failed to add sub-objective");
    }
  };

  // Handle updating this objective
  const handleUpdateObjective = async (data) => {
    try {
      await objectiveService.updateObjective(objective.id, data);
      toast.success("Objective updated successfully");
      setIsEditObjectiveOpen(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating objective:", error);
      toast.error("Failed to update objective");
    }
  };

  // Handle deleting this objective
  const handleDeleteObjective = async () => {
    try {
      await objectiveService.deleteObjective(objective.id);
      toast.success("Objective deleted successfully");
      onUpdate();
    } catch (error) {
      console.error("Error deleting objective:", error);
      toast.error("Failed to delete objective");
    }
  };

  // Handle adding a task
  const handleAddTask = async (data) => {
    try {
      await taskService.addTask(objective.id, data);
      toast.success("Task added successfully");
      setIsAddTaskOpen(false);
      
      // Refresh tasks
      const response = await taskService.getTasksByObjective(objective.id);
      setTasks(response.data);
      setTasksLoaded(true);
      setShowTasks(true);
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
    }
  };

  // Handle when a task is updated or deleted
  const handleTaskUpdate = async () => {
    try {
      const response = await taskService.getTasksByObjective(objective.id);
      setTasks(response.data);
      // Refresh the objective to update progress
      onUpdate();
    } catch (error) {
      console.error("Error refreshing tasks:", error);
    }
  };

  // Determine background color based on level
  const getLevelBackground = () => {
    switch(objective.level) {
      case "COMPANY": return "bg-red-50";
      case "DEPARTMENT": return "bg-yellow-50";
      case "TEAMS": return "bg-green-50";
      case "INDIVIDUALS": return "bg-blue-50";
      default: return "bg-white";
    }
  };

  return (
    <div className="flex flex-col w-full mb-4">
      <div className="relative pl-4 pt-4 pb-4" style={{ paddingLeft: `${level * 40}px` }}>
        <div className="absolute left-0 top-1/2 h-full w-8 -translate-y-1/2 border-l-2 border-t-2 border-indigo-200" 
             style={{ display: level > 0 ? 'block' : 'none', width: `${level * 40}px` }}>
        </div>
        
        <Card className={`border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-shadow p-4 ${getLevelBackground()}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {objective.children && objective.children.length > 0 ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-6 w-6 mr-2" 
                  onClick={toggleExpand}
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </Button>
              ) : (
                <div className="w-6 mr-2"></div> 
              )}
              <h3 className="font-medium text-lg">{objective.title}</h3>
              {getLevelBadge()}
              {getNodeTypeBadge()}
              {getStatusBadge()}
            </div>
            
            <div className="flex items-center">
              <CircularProgress percentage={objective.progressPercentage || 0} size={50} />
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{objective.description}</p>
          
          {objective.dueDate && (
            <div className="mb-3 flex items-center text-xs text-slate-600">
              <Calendar size={14} className="mr-1" />
              <span>Due: {formatDate(objective.dueDate)}</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddObjectiveOpen(true)}>
              <Plus size={16} className="mr-1" /> Add Sub-Objective
            </Button>
            
            <Button variant="outline" size="sm" onClick={() => setIsAddTaskOpen(true)}>
              <Plus size={16} className="mr-1" /> Add Task
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleShowTasks}
              disabled={isTaskLoading}
            >
              <ListTodo size={16} className="mr-1" /> 
              {isTaskLoading ? "Loading..." : showTasks ? "Hide Tasks" : "View Tasks"}
            </Button>
            
            <Button variant="outline" size="sm" onClick={() => setIsEditObjectiveOpen(true)}>
              <Edit size={16} className="mr-1" /> Edit
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500 hover:text-red-700" 
              onClick={() => setIsDeleteConfirmOpen(true)}
            >
              <Trash2 size={16} className="mr-1" /> Delete
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Tasks List (Collapsible) */}
      {showTasks && (
        <div className="ml-12">
          {isTaskLoading ? (
            <div className="text-center p-4">
              <p className="text-sm text-slate-500">Loading tasks...</p>
            </div>
          ) : (
            <TaskList 
              tasks={tasks} 
              onTaskUpdate={handleTaskUpdate} 
              employeeMap={employeeMap}
            />
          )}
        </div>
      )}
      
      {/* Child Objectives (Recursive) */}
      {isExpanded && objective.children && objective.children.length > 0 && (
        <div className="ml-4">
          {objective.children.map(child => (
            <ObjectiveNode 
              key={child.id} 
              objective={child} 
              level={level + 1} 
              onUpdate={onUpdate}
              employeeMap={employeeMap}
              expandAll={expandAll}
              collapseAll={collapseAll}
            />
          ))}
        </div>
      )}
      
      {/* Dialogs */}
      <ObjectiveDialog 
        isOpen={isEditObjectiveOpen} 
        onClose={() => setIsEditObjectiveOpen(false)}
        onSubmit={handleUpdateObjective}
        title="Edit Objective"
        initialData={objective}
      />
      
      <ObjectiveDialog 
        isOpen={isAddObjectiveOpen} 
        onClose={() => setIsAddObjectiveOpen(false)}
        onSubmit={handleAddObjective}
        title="Add Sub-Objective"
      />
      
      <TaskDialog 
        isOpen={isAddTaskOpen} 
        onClose={() => setIsAddTaskOpen(false)}
        onSubmit={handleAddTask}
        title="Add Task"
        employeeMap={employeeMap}
      />
      
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteObjective}
        title="Delete Objective"
        description="Are you sure you want to delete this objective? This will also delete all sub-objectives and tasks associated with it."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
      />
    </div>
  );
} 