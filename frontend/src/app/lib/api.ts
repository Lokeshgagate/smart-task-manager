import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getUsers = () => API.get('/users');
export const createUser = (data: { name: string; email: string }) => API.post('/users', data);

export const getTasks = (priority?: string) => API.get('/tasks', { params: { priority } });
export const getMyTasks = (userId: string) => API.get(`/tasks/user/${userId}`);
export const getBlockedTasks = () => API.get('/tasks/blocked');
export const createTask = (data: any) => API.post('/tasks', data);
export const updateTask = (id: string, data: any) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id: string) => API.delete(`/tasks/${id}`);