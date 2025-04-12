"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          // Set default headers for all axios requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
          // You might want to validate the token here with a server request
          // For now we'll just set the user from localStorage if available
          const userData = localStorage.getItem("user");
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        setLoading(false);
      }
    };
    
    checkUserLoggedIn();
  }, []);
  
  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
        userData
      );
      
      if (response.data) {
        toast.success("Registration successful! Please login.");
        router.push("/login");
      }
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };
  
  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        credentials
      );
      
      if (response.data && response.data.token) {
        // Set token in cookie
        Cookies.set("token", response.data.token, { expires: 7 });
        
        // Set user in state and localStorage
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Set default headers for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        
        toast.success("Login successful!");
        router.push("/");
      }
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };
  
  // Logout user
  const logout = () => {
    // Remove token from cookie
    Cookies.remove("token");
    
    // Remove user from state and localStorage
    setUser(null);
    localStorage.removeItem("user");
    
    // Remove default header
    delete axios.defaults.headers.common["Authorization"];
    
    toast.success("Logged out successfully");
    router.push("/login");
  };
  
  // Update user
  const updateUser = async (empId, userData) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${empId}`,
        userData
      );
      
      if (response.data) {
        // Update user in state and localStorage
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        toast.success("Profile updated successfully!");
      }
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Update failed");
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext; 