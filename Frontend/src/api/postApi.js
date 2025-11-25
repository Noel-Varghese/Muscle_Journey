import axios from "axios";

const API = "http://localhost:8000";

export const likePost = async (postId) => {
  return await axios.post(`${API}/posts/${postId}/like`);
};

export const unlikePost = async (postId) => {
  return await axios.delete(`${API}/posts/${postId}/like`);
};

export const getLikeCount = async (postId) => {
  return await axios.get(`${API}/posts/${postId}/likes/count`);
};
