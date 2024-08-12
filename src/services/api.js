import axios from 'axios';
import API_CONFIG from '../ipconfig';

// Initialize the API base URL
const API_BASE_URL = API_CONFIG.API_URL;

// Create an instance of axios with default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch all banners
export const fetchBanners = async () => {
  try {
    const response = await api.get('/get-banners');
    return response.data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};

// Fetch a single banner by ID
export const fetchBannerById = async (id) => {
  try {
    const response = await api.get(`/get-banner/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching banner with ID ${id}:`, error);
    throw error;
  }
};

// Add a new banner
export const addBanner = async (bannerData) => {
  try {
    const response = await api.post('/add-banner', bannerData);
    return response.data;
  } catch (error) {
    console.error('Error adding banner:', error);
    throw error;
  }
};

// Update an existing banner
export const updateBanner = async (id, bannerData) => {
  try {
    const response = await api.put(`/update-banner/${id}`, bannerData);
    {console.log(response.data)}
    return response.data;
  } catch (error) {
    console.error(`Error updating banner with ID ${id}:`, error);
    throw error;
  }
};

// Update banner visibility
export const updateBannerVisibility = async (id, isVisible) => {
  try {
    const response = await api.put(`/update-banner-visibility/${id}`, { isVisible });
    {console.log(response.data)}
    return response.data;
  } catch (error) {
    console.error(`Error updating visibility for banner with ID ${id}:`, error);
    throw error;
  }
};

export default {
  fetchBanners,
  fetchBannerById,
  addBanner,
  updateBanner,
  updateBannerVisibility,
};
