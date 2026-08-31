import api from "./api";

export const getUserProfile = (id) => api.get(`/users/${id}`).then((r) => r.data);
export const updateUserProfile = (id, data) => api.put(`/users/${id}`, data).then((r) => r.data);
export const getDashboard = () => api.get("/users/me/dashboard").then((r) => r.data);
