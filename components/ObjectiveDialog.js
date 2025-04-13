"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export default function ObjectiveDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title = "Objective", 
  initialData = null 
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assumption: "",
    level: "COMPANY",
    dueDate: "",
    progressPercentage: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog opens/closes or initial data changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || "",
        description: initialData?.description || "",
        assumption: initialData?.assumption || "",
        level: initialData?.level || "COMPANY",
        dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : "",
        progressPercentage: initialData?.progressPercentage || 0
      });
    }
  }, [isOpen, initialData]);

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
    setFormData({
      ...formData,
      progressPercentage: value[0],
    });
  };

  // Update status if progress is set to 100%
  useEffect(() => {
    if (formData.progressPercentage === 100) {
      setFormData(prev => ({
        ...prev,
        status: "COMPLETED"
      }));
    }
  }, [formData.progressPercentage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error("Title is required");
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter objective title"
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
              placeholder="Enter objective description"
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
              placeholder="Enter objective assumption"
              disabled={isLoading}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="level" className="text-sm font-medium">
              Level
            </label>
            <Select
              name="level"
              value={formData.level}
              onValueChange={(value) => handleSelectChange("level", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COMPANY">Company</SelectItem>
                <SelectItem value="DEPARTMENT">Department</SelectItem>
                <SelectItem value="TEAMS">Teams</SelectItem>
                <SelectItem value="INDIVIDUALS">Individuals</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Due Date (optional)
            </label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          {initialData && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="progressPercentage" className="text-sm font-medium">
                  Progress ({formData.progressPercentage}%)
                </label>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                  {formData.progressPercentage >= 100 ? "Completed" : "Pending"}
                </span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Slider
                    defaultValue={[0]}
                    value={[formData.progressPercentage]}
                    max={100}
                    step={1}
                    onValueChange={handleSliderChange}
                    disabled={isLoading}
                  />
                </div>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  className="w-20"
                  value={formData.progressPercentage}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 0 && value <= 100) {
                      handleSliderChange([value]);
                    }
                  }}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
          
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