
// src/api/customers.js
import API from "./axios";

export const getCustomers = (params) => API.get("/customers", { params });
export const getCustomer = (id) => API.get(`/customers/${id}`);
export const createCustomer = (data) => API.post("/customers", data);
export const updateCustomer = (id, data) => API.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => API.delete(`/customers/${id}`);