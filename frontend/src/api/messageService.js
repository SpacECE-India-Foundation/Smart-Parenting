/**
 * src/api/messageService.js
 *
 * API helper functions for Parent-Teacher chat messages.
 */

import client from '../api/client';

export const getMessagesForChild = async (childId) => {
  try {
    const { data } = await client.get(`/messages/${childId}`);
    return { data: data.data, error: null };
  } catch (err) {
    return { data: [], error: err.response?.data?.error || err.message };
  }
};

export const sendMessage = async (childId, text, image, audio) => {
  try {
    if (image || audio) {
      const formData = new FormData();
      if (text) formData.append('text', text);
      if (image) formData.append('image', image);
      if (audio) formData.append('audio', audio);

      const { data } = await client.post(`/messages/${childId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { data: data.data, error: null };
    } else {
      const { data } = await client.post(`/messages/${childId}`, { text });
      return { data: data.data, error: null };
    }
  } catch (err) {
    return { data: null, error: err.response?.data?.error || err.message };
  }
};

export const deleteMessage = async (messageId, mode) => {
  try {
    const { data } = await client.patch(`/messages/${messageId}/delete`, { mode });
    return { data: data.data, error: null };
  } catch (err) {
    return { data: null, error: err.response?.data?.error || err.message };
  }
};
