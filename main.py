from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi
from pytube import YouTube
import os
import time
import requests
import re
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Google API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")

genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

class VideoURL(BaseModel):
    url: str

def extract_video_id(url):
    try:
        # Handle different YouTube URL formats
        if "v=" in url:
            video_id = url.split("v=")[1].split("&")[0]
        elif "youtu.be/" in url:
            video_id = url.split("youtu.be/")[1].split("?")[0]
        else:
            raise ValueError("Invalid YouTube URL format")
        return video_id
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid YouTube URL: {str(e)}")

def get_video_info_api(video_id):
    """Get video info using YouTube's oEmbed API"""
    try:
        url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            return {
                "title": data.get("title", f"Video {video_id}"),
                "author": data.get("author_name", "Unknown"),
                "description": "Description not available via API",
                "length": 0,  # Not available via oembed
                "views": 0,   # Not available via oembed
                "keywords": [],
                "publish_date": None
            }
    except Exception as e:
        print(f"oEmbed API error: {str(e)}")
    return None

def get_video_info_direct(url, video_id):
    """Get video info by parsing the HTML page"""
    try:
        # Try to get the video page
        response = requests.get(f"https://www.youtube.com/watch?v={video_id}", timeout=10)
        if response.status_code == 200:
            html = response.text
            
            # Extract title
            title_match = re.search(r'<meta name="title" content="([^"]+)"', html)
            title = title_match.group(1) if title_match else f"Video {video_id}"
            
            # Extract channel name
            author_match = re.search(r'<link itemprop="name" content="([^"]+)"', html)
            author = author_match.group(1) if author_match else "Unknown"
            
            # Try to find description
            description_match = re.search(r'<meta name="description" content="([^"]+)"', html)
            description = description_match.group(1) if description_match else "Description not available"
            
            return {
                "title": title,
                "author": author,
                "description": description,
                "length": 0,  # Cannot reliably extract
                "views": 0,   # Cannot reliably extract
                "keywords": [],
                "publish_date": None
            }
    except Exception as e:
        print(f"Direct HTML extraction error: {str(e)}")
    return None

def get_video_info(url):
    try:
        video_id = extract_video_id(url)
        
        # Try using pytube first
        try:
            yt = YouTube(url)
            if yt.title and yt.author:
                return {
                    "title": yt.title,
                    "description": yt.description or "No description available",
                    "author": yt.author,
                    "length": yt.length if hasattr(yt, 'length') else 0,
                    "views": yt.views if hasattr(yt, 'views') else 0,
                    "keywords": yt.keywords if hasattr(yt, 'keywords') else [],
                    "publish_date": str(yt.publish_date) if hasattr(yt, 'publish_date') and yt.publish_date else None
                }
        except Exception as e:
            print(f"pytube error: {str(e)}")
        
        # If pytube fails, try oEmbed API
        oembed_info = get_video_info_api(video_id)
        if oembed_info:
            return oembed_info
            
        # If oEmbed fails, try direct HTML parsing
        direct_info = get_video_info_direct(url, video_id)
        if direct_info:
            return direct_info
            
        # Last resort fallback
        return {
            "title": f"Video {video_id}",
            "description": "Video information unavailable",
            "author": "Unknown",
            "length": 0,
            "views": 0,
            "keywords": [],
            "publish_date": None
        }
        
    except Exception as e:
        print(f"Error in get_video_info: {str(e)}")
        video_id = extract_video_id(url)
        return {
            "title": f"Video {video_id}",
            "description": "Video information unavailable",
            "author": "Unknown",
            "length": 0,
            "views": 0,
            "keywords": [],
            "publish_date": None
        }

def extract_transcript_details(youtube_url):
    try:
        video_id = extract_video_id(youtube_url)
        
        # Try with default language (English)
        try:
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            transcript_text = " ".join([item["text"] for item in transcript_list])
            return transcript_text
        except Exception as e:
            print(f"English transcript not available, trying alternatives: {str(e)}")
            
            # Get available languages
            try:
                transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
                
                # Try to get any manual transcript first (usually higher quality)
                for transcript in transcript_list:
                    try:
                        if not transcript.is_generated:  # Manual transcript
                            fetched_transcript = transcript.fetch()
                            transcript_text = " ".join([item["text"] for item in fetched_transcript])
                            return transcript_text
                    except Exception as e:
                        print(f"Error with manual transcript: {str(e)}")
                        continue
                
                # If no manual transcript, try any generated one
                for transcript in transcript_list:
                    try:
                        fetched_transcript = transcript.fetch()
                        transcript_text = " ".join([item["text"] for item in fetched_transcript])
                        return transcript_text
                    except Exception as e:
                        print(f"Error with auto transcript: {str(e)}")
                        continue
                        
                # If still no transcript, try to get translations
                for transcript in transcript_list:
                    try:
                        # Try to translate to English
                        translated = transcript.translate('en')
                        fetched_transcript = translated.fetch()
                        transcript_text = " ".join([item["text"] for item in fetched_transcript])
                        return transcript_text
                    except Exception as e:
                        print(f"Error with translation: {str(e)}")
                        continue
                        
                # If we get here, no usable transcript was found
                print("No usable transcript found in any language")
                return None
            except Exception as inner_e:
                print(f"Error listing transcripts: {str(inner_e)}")
                return None
                
    except Exception as e:
        print(f"Transcript not available: {str(e)}")
        return None

def is_likely_music_video(video_info):
    """Check if a video is likely a music video based on metadata"""
    if not video_info:
        return False
        
    title = video_info.get('title', '').lower()
    description = video_info.get('description', '').lower()
    keywords = [k.lower() for k in video_info.get('keywords', [])]
    
    # Music-related indicators in title
    music_indicators = [
        "official music video", "official video", "music video", 
        "official audio", "lyric video", "lyrics video",
        "ft.", "feat.", "official song", " - ", 
        "visualizer", "audio", "song", "track"
    ]
    
    for indicator in music_indicators:
        if indicator in title:
            return True
            
    # Check keywords
    music_keywords = ["music", "song", "official audio", "lyrics"]
    for keyword in keywords:
        for indicator in music_keywords:
            if indicator in keyword:
                return True
                
    # Check description
    music_desc_indicators = ["listen on spotify", "available on itunes", "official music video"]
    for indicator in music_desc_indicators:
        if indicator in description:
            return True
            
    return False

def generate_gemini_content(video_info, transcript=None):
    try:
        model_names = [
            "models/gemini-1.5-flash",
            "models/gemini-1.5-flash-001",
            "models/gemini-1.5-flash-latest"
        ]
        
        # Check if it's a music video
        is_music_video = is_likely_music_video(video_info)
        
        # Clean video info for the prompt
        title = video_info.get('title', 'Unknown Title')
        author = video_info.get('author', 'Unknown Creator')
        duration = video_info.get('length', 0)
        duration_formatted = f"{duration // 60}:{duration % 60:02d}" if duration else "Unknown"
        views = video_info.get('views', 0)
        views_formatted = f"{views:,}" if views else "Unknown"
        description = video_info.get('description', 'No description available')
        
        # Create a structured prompt based on video type
        if is_music_video:
            prompt = f"""You are a music expert summarizing a music video. Below are the details:

TITLE: {title}
ARTIST: {author}
DURATION: {duration_formatted}
VIEWS: {views_formatted}

DESCRIPTION:
{description}

TRANSCRIPT/LYRICS:
{transcript if transcript else "No lyrics available"}

Please provide a well-structured summary of this music video that includes:
1. A brief introduction about the song and artist
2. Key themes and emotions expressed in the music and lyrics
3. Notable elements of the video (if determinable from metadata)
4. Musical style and genre analysis
5. Context about the song's release or cultural significance (if apparent)

Format the summary with clear sections and paragraph breaks for readability.
If the transcript/lyrics are unavailable, acknowledge this limitation but still analyze available metadata.
"""
        else:
            prompt = f"""You are an expert content analyst summarizing this YouTube video. Below are the details:

TITLE: {title}
CREATOR: {author}
DURATION: {duration_formatted}
VIEWS: {views_formatted}

DESCRIPTION:
{description}

TRANSCRIPT:
{transcript if transcript else "No transcript available"}

Please provide a comprehensive, well-structured summary that includes:
1. An engaging overview of the video's main topic and purpose
2. The key points, arguments, or information presented (in bullet points if appropriate)
3. Main takeaways and valuable insights for viewers
4. The target audience and why this content would be relevant to them
5. A brief conclusion about the overall value or significance of this content

Format your response with clear headings, paragraph breaks, and bullet points where appropriate.
If the transcript is unavailable, acknowledge this limitation but still analyze available metadata.
"""

        # Try different models until one works
        last_error = None
        for model_name in model_names:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                return response.text
            except Exception as e:
                last_error = str(e)
                print(f"Error with model {model_name}: {str(e)}")
                continue
        
        # If all models fail, provide a fallback response
        if is_music_video:
            return f"This appears to be a music video for '{title}' by {author}. Unable to generate a detailed summary without additional information."
        else:
            return f"This video titled '{title}' by {author} could not be summarized due to technical limitations. Please try watching the video directly."
    
    except Exception as e:
        print(f"Error generating content: {str(e)}")
        return "Unable to generate a summary due to technical difficulties. Please try again with a different video."

@app.get("/")
async def root():
    return {"message": "Video Summarizer using NLP API is running"}

@app.post("/api/summarize")
async def summarize_video(video: VideoURL):
    try:
        # Extract video ID for thumbnail and verification
        video_id = extract_video_id(video.url)
        
        # Get video information using multiple fallback methods
        video_info = get_video_info(video.url)
        video_info["url"] = video.url  # Add URL to video info for reference
        
        # Try to get transcript
        transcript_text = extract_transcript_details(video.url)
        has_transcript = transcript_text is not None and len(transcript_text) > 0
        
        # Check if it's a music video
        is_music = is_likely_music_video(video_info)
        
        # Generate summary using available information
        summary = generate_gemini_content(video_info, transcript_text)
        
        # Set up multiple thumbnail options
        thumbnails = {
            "maxres": f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
            "high": f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg",
            "medium": f"https://img.youtube.com/vi/{video_id}/mqdefault.jpg",
            "default": f"https://img.youtube.com/vi/{video_id}/default.jpg",
            "sddefault": f"https://img.youtube.com/vi/{video_id}/sddefault.jpg",
        }
        
        # Calculate a success score for logging/debugging
        success_score = 0
        if video_info and video_info.get('title') != f"Video {video_id}":
            success_score += 1
        if video_info and video_info.get('author') != "Unknown":
            success_score += 1
        if has_transcript:
            success_score += 3
        if summary and len(summary) > 100:
            success_score += 2
        
        # Log some useful info for debugging
        print(f"Processed video {video_id} | Has transcript: {has_transcript} | Is music: {is_music} | Success score: {success_score}/7")
        
        return {
            "summary": summary,
            "thumbnail_url": thumbnails["maxres"],
            "thumbnail_options": thumbnails,
            "video_info": video_info,
            "video_id": video_id,
            "has_transcript": has_transcript,
            "is_music_video": is_music,
            "success_score": success_score
        }
    except Exception as e:
        error_msg = str(e)
        print(f"Error processing video: {error_msg}")
        
        if "HTTP Error 400" in error_msg or "Invalid YouTube URL" in error_msg:
            raise HTTPException(
                status_code=400,
                detail="Could not access video information. Please ensure the video is public and the URL is correct."
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"An error occurred while processing the video: {error_msg}"
            )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)