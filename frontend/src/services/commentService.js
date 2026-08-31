import api from "./api";

export const getComments = (postId) => api.get(`/posts/${postId}/comments`).then((r) => r.data);
export const addComment = (postId, content) => api.post(`/posts/${postId}/comments`, { content }).then((r) => r.data);
export const updateComment = (id, content) => api.put(`/comments/${id}`, { content }).then((r) => r.data);
export const deleteComment = (id) => api.delete(`/comments/${id}`).then((r) => r.data);
