# 🎥 Video Summarizer Using NLP

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/your-username/your-repo/actions)
[![Made with React](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/)
[![Backend: FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)](https://fastapi.tiangolo.com/)
[![Powered by Gemini AI](https://img.shields.io/badge/AI-Gemini-blueviolet)](https://deepmind.google/technologies/gemini/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A powerful web application that **automatically generates comprehensive summaries** of YouTube videos using advanced **Natural Language Processing (NLP)** techniques. This project combines **Google's Gemini AI**, **YouTube's Transcript API**, and **modern web technologies** to offer intelligent video summarization with a clean UI.

## 🖼️ Demo

![Video Summarizer Demo](demo.gif)

## ✨ Features

- 🎯 **Smart Video Analysis**: Automatically extracts and processes video transcripts
- 🤖 **AI-Powered Summarization**: Utilizes Google's Gemini AI for intelligent content analysis
- 🌍**Multi-Language Support**: Handles videos in various languages with automatic translation
- 🧠**Rich Video Metadata**: Extracts comprehensive video information
- **Music Video Detection**: Intelligent detection of music videos
- 💻**Modern Web Interface**: Clean and responsive frontend
- 🔗**RESTful API**: FastAPI backend for efficient video processing

## 🛠️ Tech Stack

### Frontend
- React + TypeScript
- Chakra UI
- Vite
- React Markdown

### Backend
- FastAPI
- Google Gemini AI
- YouTube Transcript API

## 📁 Project Structure

```
├── frontend/                 # React + TypeScript frontend
│   ├── src/                 # Source files
│   │   ├── components/      # React components
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   ├── hooks/          # Custom React hooks
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
│
├── main.py                 # FastAPI backend server
├── .env                    # Environment configuration
├── package-lock.json       # Node.js lock file
└── README.md              # Project documentation
```

## 🔑 Key Highlights

- ✅ Automatic transcript extraction and processing  
- ✅ AI-based summarization using Gemini  
- ✅ Multi-language support and auto-translation  
- ✅ Metadata extraction: title, author, description, etc.  
- ✅ Music video detection  
- ✅ Error handling and CORS-enabled APIs  

## 🎯 Use Cases

- 📚 Educational video summarization  
- 🔬 Research and study support  
- 🎥 Content creators' productivity tool   
- ⏩ Instant video content preview  

## ⚙️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Google API Key

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/video-summarizer.git
cd video-summarizer
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd ../backend
pip install -r requirements.txt
```

4. Set up environment variables
```bash
cp .env.example .env
# Add your Google API key to .env
```

5. Start the development servers
```bash
# Terminal 1 - Backend
cd backend
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📝 Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Paste a YouTube video URL
3. Click "Summarize"
4. View the generated summary and video information

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://deepmind.google/technologies/gemini/)
- [YouTube Transcript API](https://github.com/jdepoix/youtube-transcript-api)
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)
