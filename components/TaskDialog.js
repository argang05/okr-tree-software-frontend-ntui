"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export default function TaskDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title = "Task", 
  initialData = null,
  employeeMap = {}
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assumption: "",
    dueDate: "",
    status: "PENDING",
    assignedTo: [],
    progressPercentage: 0,
  });
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allEmployees, setAllEmployees] = useState(employeeMap || {});
  const [filteredEmployees, setFilteredEmployees] = useState({});

  // Load employee data if not provided
  useEffect(() => {
    const fetchEmployees = async () => {
      if (Object.keys(employeeMap).length === 0) {
        try {
          const response = await fetch('/api/users/empid-name-map');
          if (response.ok) {
            const data = await response.json();
            setAllEmployees(data);
          } else {
            console.error("Failed to fetch employee data");
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
      } else {
        setAllEmployees(employeeMap);
      }
    };
    
    fetchEmployees();
  }, [employeeMap]);

  // Filter employees based on search term
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredEmployees(allEmployees);
    } else {
      const searchTerm = search.toLowerCase();
      const filtered = Object.entries(allEmployees)
        .filter(([id, name]) => 
          name.toLowerCase().includes(searchTerm) || 
          id.includes(searchTerm)
        )
        .reduce((acc, [id, name]) => {
          acc[id] = name;
          return acc;
        }, {});
      
      setFilteredEmployees(filtered);
    }
  }, [search, allEmployees]);

  // Reset form when dialog opens/closes or initial data changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || "",
        description: initialData?.description || "",
        assumption: initialData?.assumption || "",
        dueDate: initialData?.dueDate || getDefaultDueDate(),
        status: initialData?.status || "PENDING",
        assignedTo: initialData?.assignedTo || [],
        progressPercentage: initialData?.progressPercentage || 0,
      });
      setSearch("");
    }
  }, [isOpen, initialData]);

  // Get default due date (1 month from now)
  const getDefaultDueDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSliderChange = (value) => {
    const newProgressPercentage = value[0];
    
    // If progress is 100%, automatically set status to COMPLETED
    const newStatus = newProgressPercentage === 100 ? "COMPLETED" : formData.status;
    
    setFormData({
      ...formData,
      progressPercentage: newProgressPercentage,
      status: newStatus
    });
  };

  // Add assignee to task
  const addAssignee = (empId) => {
    if (!formData.assignedTo.includes(empId)) {
      setFormData({
        ...formData,
        assignedTo: [...formData.assignedTo, empId],
      });
    }
  };

  // Remove assignee from task
  const removeAssignee = (empId) => {
    setFormData({
      ...formData,
      assignedTo: formData.assignedTo.filter(id => id !== empId),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.dueDate) {
      toast.error("Title and due date are required");
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
      // Toast is handled in parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="assumption" className="text-sm font-medium">
              Assumption
            </label>
            <Textarea
              id="assumption"
              name="assumption"
              value={formData.assumption}
              onChange={handleChange}
              placeholder="Enter task description"
              disabled={isLoading}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select
              name="status"
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
              disabled={isLoading}
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
          
          {initialData && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Progress Percentage: {formData.progressPercentage}%
              </label>
              <Slider 
                value={[formData.progressPercentage]}
                min={0}
                max={100}
                step={5}
                onValueChange={handleSliderChange}
                disabled={isLoading}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Assigned Employees
            </label>
            
            <div className="flex flex-col gap-2">
              {/* Selected employees list */}
              {formData.assignedTo.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.assignedTo.map(id => (
                    <div key={id} className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1">
                      <span>{allEmployees[id] || id}</span>
                      <button 
                        type="button"
                        onClick={() => removeAssignee(id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Employee search input */}
              <div className="space-y-2">
                <Input
                  placeholder="Search employees..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={isLoading}
                />
                
                {/* Scrollable employee list */}
                <div className="border rounded-md max-h-40 overflow-y-auto">
                  {Object.keys(filteredEmployees).length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">
                      No employees found
                    </div>
                  ) : (
                    <div className="divide-y">
                      {Object.entries(filteredEmployees).map(([id, name]) => (
                        <button
                          key={id}
                          type="button"
                          className={`w-full text-left p-2.5 text-sm hover:bg-gray-50 flex justify-between items-center ${
                            formData.assignedTo.includes(id) ? "bg-gray-100" : ""
                          }`}
                          onClick={() => 
                            formData.assignedTo.includes(id) 
                              ? removeAssignee(id) 
                              : addAssignee(id)
                          }
                          disabled={isLoading}
                        >
                          <div>
                            <div>{name}</div>
                            <div className="text-xs text-gray-500">ID: {id}</div>
                          </div>
                          {formData.assignedTo.includes(id) && (
                            <span className="text-green-500">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 