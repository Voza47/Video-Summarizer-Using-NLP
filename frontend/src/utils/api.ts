import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * API service for interacting with the backend
 */
export const apiService = {
  /**
   * Get the API health status
   */
  async getHealth() {
    try {
      const response = await axios.get(`${API_URL}/`);
      return response.data;
    } catch (error) {
      console.error('API Health Check Error:', error);
      throw error;
    }
  },

  /**
   * Summarize a YouTube video by URL
   */
  async summarizeVideo(url: string) {
    try {
      const response = await axios.post(`${API_URL}/api/summarize`, { url });
      return response.data;
    } catch (error) {
      console.error('Video Summarization Error:', error);
      
      // Handle specific errors
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        
        if (status === 404) {
          throw new Error('Video not found. Please check the URL and try again.');
        } else if (status === 400) {
          throw new Error('Invalid video URL. Please provide a valid YouTube URL.');
        } else if (status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later or contact support.');
        }
      }
      
      throw new Error('Failed to summarize video. Please try again later.');
    }
  },
  
  /**
   * Extract thumbnail and basic info from a YouTube video URL
   */
  async getVideoInfo(url: string) {
    try {
      const response = await axios.post(`${API_URL}/api/video-info`, { url });
      return response.data;
    } catch (error) {
      console.error('Video Info Error:', error);
      throw new Error('Failed to fetch video information. Please try again later.');
    }
  }
};

export default apiService; 