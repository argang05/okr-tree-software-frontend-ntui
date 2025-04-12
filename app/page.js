"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus, ExpandAll, Loader2, CollapseAll, ChevronDown, ChevronUp } from "lucide-react";
import ObjectiveDialog from "@/components/ObjectiveDialog";
import ObjectiveNode from "@/components/ObjectiveNode";
import { toast } from "sonner";
import { objectiveService, userService } from "@/services/api";

export default function HomePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  const [objectives, setObjectives] = useState([]);
  const [currentTree, setCurrentTree] = useState(null);
  const [isAddObjectiveOpen, setIsAddObjectiveOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeMap, setEmployeeMap] = useState({});
  const [expandAll, setExpandAll] = useState(false);
  const [collapseAll, setCollapseAll] = useState(false);
  
  // Reset expand/collapse state after applying
  useEffect(() => {
    if (expandAll) {
      const timer = setTimeout(() => setExpandAll(false), 100);
      return () => clearTimeout(timer);
    }
    if (collapseAll) {
      const timer = setTimeout(() => setCollapseAll(false), 100);
      return () => clearTimeout(timer);
    }
  }, [expandAll, collapseAll]);
  
  // Load objectives and employee map
  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated) {
        try {
          // Load employee map for task assignments
          const employeeMapResponse = await userService.getEmployeeMapping();
          setEmployeeMap(employeeMapResponse.data || {});
          
          // Load all objective trees
          const treesResponse = await objectiveService.getAllTrees();
          const trees = treesResponse.data || [];
          setObjectives(trees);
          
          if (trees.length > 0) {
            setCurrentTree(trees[0]);
          }
          
          setIsLoading(false);
        } catch (error) {
          console.error("Error loading data:", error);
          toast.error("Failed to load OKR data");
          setIsLoading(false);
        }
      }
    };
    
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (!loading && isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loading, router]);
  
  // Create a new root objective
  const handleAddObjective = async (data) => {
    try {
      await objectiveService.createObjective(data);
      toast.success("Objective created successfully");
      setIsAddObjectiveOpen(false);
      
      // Reload trees
      const treesResponse = await objectiveService.getAllTrees();
      const trees = treesResponse.data || [];
      setObjectives(trees);
      
      if (trees.length > 0 && !currentTree) {
        setCurrentTree(trees[0]);
      }
    } catch (error) {
      console.error("Error creating objective:", error);
      toast.error("Failed to create objective");
    }
  };
  
  // Update the tree when changes are made
  const handleObjectiveUpdate = async () => {
    try {
      // Reload trees
      const treesResponse = await objectiveService.getAllTrees();
      const trees = treesResponse.data || [];
      setObjectives(trees);
      
      // Find and set the current tree
      if (currentTree) {
        const updatedTree = trees.find(tree => tree.id === currentTree.id);
        if (updatedTree) {
          setCurrentTree(updatedTree);
        } else if (trees.length > 0) {
          setCurrentTree(trees[0]);
        } else {
          setCurrentTree(null);
        }
      }
    } catch (error) {
      console.error("Error updating objectives:", error);
      toast.error("Failed to update objectives");
    }
  };
  
  // Change current tree
  const handleChangeTree = (objectiveId) => {
    const selected = objectives.find(obj => obj.id === objectiveId);
    if (selected) {
      setCurrentTree(selected);
    }
  };
  
  // Handle expanding all nodes
  const handleExpandAll = () => {
    setExpandAll(true);
    setCollapseAll(false);
  };
  
  // Handle collapsing all nodes
  const handleCollapseAll = () => {
    setCollapseAll(true);
    setExpandAll(false);
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={40} className="mx-auto mb-4 animate-spin text-indigo-600" />
            <p className="text-lg text-slate-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">OKR Vision Tree</h1>
          <div className="flex items-center justify-end gap-2 w-[40%]">
          <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExpandAll}
                >
                  <ChevronDown size={16} className="mr-1" /> Expand All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCollapseAll}
                >
                  <ChevronUp size={16} className="mr-1" /> Collapse All
                </Button>
              </div>
          <Button onClick={() => setIsAddObjectiveOpen(true)}>
            <Plus size={18} className="mr-1" />
            Add OKR
            </Button>
            </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 size={40} className="mx-auto mb-4 animate-spin text-indigo-600" />
              <p className="text-lg text-slate-600">Loading OKR trees...</p>
            </div>
          </div>
        ) : objectives.length > 0 ? (
          <div>
            {/* Tree Navigation */}
            <div className="flex justify-between mb-4">
              <div className="flex overflow-x-auto pb-2">
                {objectives.map(obj => (
                  <Button
                    key={obj.id}
                    variant={currentTree?.id === obj.id ? "default" : "outline"}
                    className="mr-2 whitespace-nowrap"
                    onClick={() => handleChangeTree(obj.id)}
                  >
                    {obj.title.length > 20 
                      ? `${obj.title.substring(0, 20)}...` 
                      : obj.title}
                  </Button>
                ))}
              </div>
              
              {/* <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExpandAll}
                >
                  <ChevronDown size={16} className="mr-1" /> Expand All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCollapseAll}
                >
                  <ChevronUp size={16} className="mr-1" /> Collapse All
                </Button>
              </div> */}
            </div>
            
            {currentTree && (
              <div className="bg-white rounded-lg p-4 shadow overflow-x-scroll">
                <ObjectiveNode 
                  objective={currentTree} 
                  level={0} 
                  onUpdate={handleObjectiveUpdate}
                  employeeMap={employeeMap}
                  expandAll={expandAll}
                  collapseAll={collapseAll}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-lg">
            <h3 className="text-xl font-medium text-slate-700 mb-2">No OKRs found</h3>
            <p className="text-slate-600 mb-6">Create your first OKR to get started</p>
            <Button onClick={() => setIsAddObjectiveOpen(true)}>
              <Plus size={18} className="mr-1" />
              Create First OKR
            </Button>
          </div>
        )}
      </main>
      
      {/* Add Objective Dialog */}
      <ObjectiveDialog 
        isOpen={isAddObjectiveOpen}
        onClose={() => setIsAddObjectiveOpen(false)}
        onSubmit={handleAddObjective}
        title="Add New OKR"
      />
    </div>
  );
}
