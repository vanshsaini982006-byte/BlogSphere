import api from "./api";

export const getAdminStats = () => api.get("/admin/stats").then((r) => r.data);
export const getAllUsers = () => api.get("/admin/users").then((r) => r.data);
export const getAllPosts = () => api.get("/admin/posts").then((r) => r.data);
export const getAllComments = () => api.get("/admin/comments").then((r) => r.data);
export const adminDeletePost = (id) => api.delete(`/admin/posts/${id}`).then((r) => r.data);
export const adminDeleteComment = (id) => api.delete(`/admin/comments/${id}`).then((r) => r.data);
