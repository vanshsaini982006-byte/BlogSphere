import api from "./api";

export const getPosts = (params) => api.get("/posts", { params }).then((r) => r.data);
export const getFeaturedPosts = () => api.get("/posts/featured").then((r) => r.data);
export const getPost = (idOrSlug) => api.get(`/posts/${idOrSlug}`).then((r) => r.data);
export const createPost = (data) => api.post("/posts", data).then((r) => r.data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data).then((r) => r.data);
export const deletePost = (id) => api.delete(`/posts/${id}`).then((r) => r.data);
