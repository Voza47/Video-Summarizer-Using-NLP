/**
 * Video information interface
 */
export interface VideoInfo {
  title: string;
  author: string;
  views: number;
  length: number;
  language?: string;
  publishDate?: string;
  description?: string;
}

/**
 * API response interface for video summarization
 */
export interface SummarizeResponse {
  summary: string;
  video_info: VideoInfo;
  thumbnail: string;
  is_music_video: boolean;
  has_transcript: boolean;
  success_score: number;
  error?: string;
}

/**
 * Error interface
 */
export interface AppError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * User preferences interface
 */
export interface UserPreferences {
  darkMode: boolean;
  savedVideos: string[];
  language: string;
  summaryFormat: 'concise' | 'detailed';
}

/**
 * Saved summary interface
 */
export interface SavedSummary {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  summary: string;
  timestamp: number;
} 