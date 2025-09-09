import BaseApi from "../api/BaseApi";

export const fetchMessages = async (userId, partnerId) => {
  const response = await BaseApi.get(`/messages/${userId}/${partnerId}`);
  return response.data;
};

export const sendMessage = async (senderId, receiverId, message) => {
  const response = await BaseApi.post("/messages", { senderId, receiverId, message });
  return response.data;
};

export const updateMessage = async (messageId, message) => {
  const response = await BaseApi.put(`/messages/${messageId}`, { message });
  return response.data;
};

export const deleteMessage = async (messageId) => {
  await BaseApi.delete(`/messages/${messageId}`);
};
