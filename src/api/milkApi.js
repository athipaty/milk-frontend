import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

// GET all records
export const fetchMilk = () => api.get("/");

// GET today summary
export const fetchTodayTotal = () => api.get("/summary/today");

// POST new record
export const createMilk = (payload) => api.post("/", payload);

// PUT update record
export const updateMilk = (id, payload) => api.put(`/${id}`, payload);

// DELETE record
export const deleteMilk = (id) => api.delete(`/${id}`);
