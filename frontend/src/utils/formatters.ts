/**
 * Format duration from seconds to mm:ss or hh:mm:ss
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds) return 'Unknown duration';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format view count with appropriate suffixes (K, M, B)
 */
export const formatViews = (views: number): string => {
  if (!views) return 'Unknown views';
  
  if (views >= 1000000000) {
    return `${(views / 1000000000).toFixed(1)}B views`;
  }
  
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  }
  
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`;
  }
  
  return `${views} views`;
};

/**
 * Extract video ID from various YouTube URL formats
 */
export const extractVideoId = (url: string): string => {
  try {
    // Regular YouTube watch URL
    if (url.includes('v=')) {
      return url.split('v=')[1].split('&')[0];
    }
    
    // Short YouTube URL
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    
    // Embedded YouTube URL
    if (url.includes('embed/')) {
      return url.split('embed/')[1].split('?')[0];
    }
    
    // YouTube Shorts URL
    if (url.includes('shorts/')) {
      return url.split('shorts/')[1].split('?')[0];
    }
    
    return '';
  } catch (error) {
    console.error('Error extracting video ID:', error);
    return '';
  }
};

/**
 * Generate thumbnail URL from video ID
 */
export const generateThumbnailUrl = (videoId: string): string => {
  if (!videoId) return '';
  
  // Try to get the highest quality thumbnail
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
}; 