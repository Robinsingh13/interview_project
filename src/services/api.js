// src/services/api.js
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL;


export const getBanner = async () => {
  return await axios.get(`${API_BASE_URL}/get-banner`);
};

export const updateBanner = async (data) => {
    console.log(data);
  return await axios.post(`${API_BASE_URL}/update-banner`, data);
};
