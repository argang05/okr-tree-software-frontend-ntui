import axios from "axios";
import Cookies from "js-cookie";

// Create API instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add token to each request
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User related API calls
export const userService = {
  // Get all tasks by employee ID
  getUserTasks: async (empId) => {
    return await api.get(`/users/${empId}/tasks`);
  },
  
  // Get employee ID to name mapping
  getEmployeeMapping: async () => {
    return await api.get("/users/empid-name-map");
  }
};

// Objective related API calls
export const objectiveService = {
  // Get all objective trees
  getAllTrees: async () => {
    return await api.get("/objectives/trees");
  },
  
  // Get a specific objective tree
  getTree: async (id) => {
    return await api.get(`/objectives/tree/${id}`);
  },
  
  // Get a specific objective
  getObjective: async (id) => {
    return await api.get(`/objectives/${id}`);
  },
  
  // Create a new objective (root level)
  createObjective: async (data) => {
    return await api.post("/objectives", data);
  },
  
  // Create a sub-objective
  createSubObjective: async (parentId, data) => {
    return await api.post(`/objectives?parentId=${parentId}`, data);
  },
  
  // Update an objective
  updateObjective: async (id, data) => {
    return await api.put(`/objectives/${id}`, data);
  },
  
  // Delete an objective
  deleteObjective: async (id) => {
    return await api.delete(`/objectives/${id}`);
  }
};

// Task related API calls
export const taskService = {
  // Get all tasks for an objective
  getTasksByObjective: async (objectiveId) => {
    return await api.get(`/tasks/objective/${objectiveId}`);
  },
  
  // Add a task to an objective
  addTask: async (objectiveId, data) => {
    return await api.post(`/tasks/${objectiveId}`, data);
  },
  
  // Update a task
  updateTask: async (taskId, data) => {
    return await api.put(`/tasks/${taskId}`, data);
  },
  
  // Delete a task
  deleteTask: async (taskId) => {
    return await api.delete(`/tasks/${taskId}`);
  }
};

export default api; 