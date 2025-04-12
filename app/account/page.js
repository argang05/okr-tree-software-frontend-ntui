"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AccountPage() {
  const { user, isAuthenticated, loading, updateUser, logout } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize form data with user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);
  
  // Redirect if not authenticated
  if (!loading && !isAuthenticated) {
    router.push('/login');
    return null;
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    try {
      setIsLoading(true);
      await updateUser(user.empId, formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      // Toast handled in auth context
    } finally {
      setIsLoading(false);
    }
  };
  
  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Account Settings</CardTitle>
              <CardDescription>
                View and update your profile information
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="empId" className="text-sm font-medium">
                      Employee ID
                    </label>
                    <Input
                      id="empId"
                      value={user.empId}
                      disabled
                      className="bg-slate-50"
                    />
                    <p className="text-xs text-slate-500">Employee ID cannot be changed</p>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Full Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Email</p>
                    <p>{user.email}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Employee ID</p>
                    <p>{user.empId}</p>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={logout}
                  >
                    Logout
                  </Button>
                  <Button 
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
} 