import { useState } from 'react'
import {
  Box,
  Container,
  VStack,
  Input,
  Button,
  Text,
  Image,
  useToast,
  Heading,
  Card,
  CardBody,
  InputGroup,
  InputLeftElement,
  useColorMode,
  useColorModeValue,
  Flex,
  Badge,
  Divider,
  Skeleton,
  Link,
  extendTheme,
  ThemeProvider,
  HStack,
  Icon,
  SlideFade,
  ScaleFade,
  ListItem,
  UnorderedList,
  OrderedList,
  IconButton
} from '@chakra-ui/react'
import { FaYoutube, FaLink, FaExternalLinkAlt, FaMusic, FaVideo, FaClosedCaptioning, FaLanguage, FaClock, FaEye } from 'react-icons/fa'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import Header from './components/Header'
import VideoInputForm from './components/VideoInputForm'
import VideoResult from './components/VideoResult'
import LoadingSkeleton from './components/LoadingSkeleton'
import Footer from './components/Footer'
import { SummarizeResponse, VideoInfo } from './types'
import { extractVideoId, generateThumbnailUrl } from './utils/formatters'
import { apiService } from './utils/api'

// Custom theme for the application
const theme = extendTheme({
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
      }
    })
  },
  colors: {
    brand: {
      50: '#ffeaef',
      100: '#ffccd1',
      200: '#ff9ea7',
      300: '#ff707c',
      400: '#ff4356',
      500: '#e53e3e',
      600: '#cc3030',
      700: '#9b2c2c',
      800: '#751f1f',
      900: '#551313',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorMode === 'dark' ? 'red.500' : 'red.500',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'red.600' : 'red.600',
          },
        }),
      },
    },
    Card: {
      baseStyle: (props: any) => ({
        container: {
          borderRadius: 'xl',
          overflow: 'hidden',
          boxShadow: 'lg',
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          transition: 'all 0.3s ease',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'xl',
          },
        },
      }),
    },
    Badge: {
      baseStyle: {
        textTransform: 'none',
      },
    }
  },
})

// Custom components for markdown rendering
const MarkdownComponents = {
  p: (props: any) => <Text mb={4} lineHeight="tall" {...props} />,
  h1: (props: any) => <Heading as="h1" size="xl" mt={6} mb={4} {...props} />,
  h2: (props: any) => <Heading as="h2" size="lg" mt={5} mb={3} {...props} />,
  h3: (props: any) => <Heading as="h3" size="md" mt={4} mb={2} {...props} />,
  h4: (props: any) => <Heading as="h4" size="sm" mt={3} mb={2} {...props} />,
  ul: (props: any) => <UnorderedList my={4} pl={4} spacing={2} {...props} />,
  ol: (props: any) => <OrderedList my={4} pl={4} spacing={2} {...props} />,
  li: (props: any) => <ListItem {...props} />,
  a: (props: any) => <Link color="blue.500" isExternal {...props} />,
  hr: () => <Divider my={4} />,
  blockquote: (props: any) => (
    <Box
      borderLeftWidth="4px"
      borderLeftColor="gray.300"
      pl={4}
      py={2}
      my={4}
      bg="gray.50"
      borderRadius="md"
      {...props}
    />
  ),
}

function App() {
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [fallbackThumbnail, setFallbackThumbnail] = useState('')
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [isMusicVideo, setIsMusicVideo] = useState(false)
  const [hasTranscript, setHasTranscript] = useState(false)
  const [successScore, setSuccessScore] = useState(0)
  const [videoUrl, setVideoUrl] = useState('')
  const toast = useToast()
  const cardBg = useColorModeValue('white', 'gray.800')
  const accentBg = useColorModeValue('red.50', 'red.900')
  const primaryColor = useColorModeValue('red.500', 'red.300')

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const currentSrc = target.src;
    
    // Try different thumbnail qualities in order
    if (currentSrc.includes('maxresdefault')) {
      target.src = `https://img.youtube.com/vi/${extractVideoId(videoUrl)}/hqdefault.jpg`;
    } else if (currentSrc.includes('hqdefault')) {
      target.src = `https://img.youtube.com/vi/${extractVideoId(videoUrl)}/mqdefault.jpg`;
    } else if (currentSrc.includes('mqdefault')) {
      target.src = `https://img.youtube.com/vi/${extractVideoId(videoUrl)}/default.jpg`;
    } else if (fallbackThumbnail && target.src !== fallbackThumbnail) {
      target.src = fallbackThumbnail;
    }
  };

  const handleSubmit = async (url: string) => {
    setLoading(true)
    setSummary('')
    setVideoUrl(url)
    
    try {
      // Try to set thumbnail immediately for better UX
      const videoId = extractVideoId(url)
      const thumbnailUrl = generateThumbnailUrl(videoId)
      setThumbnail(thumbnailUrl)
      
      // Get video summary from API
      const response: SummarizeResponse = await apiService.summarizeVideo(url)
      
      // Update state with API response
      setSummary(response.summary)
      setVideoInfo(response.video_info)
      setIsMusicVideo(response.is_music_video)
      setHasTranscript(response.has_transcript)
      setSuccessScore(response.success_score)
      
      // Set fallback thumbnail if provided
      if (response.thumbnail) {
        setFallbackThumbnail(response.thumbnail)
      }
    } catch (error) {
      // Handle errors
      let errorMessage = 'Failed to summarize video'
      
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      })
      
      // Reset state
      setThumbnail('')
      setVideoInfo(null)
      setSummary('')
    } finally {
      setLoading(false)
    }
  }

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number) => {
    if (!seconds) return 'Unknown length'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Format views with commas
  const formatViews = (views: number) => {
    if (!views) return 'Unknown views'
    return new Intl.NumberFormat().format(views) + ' views'
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Header 
        title="Video Summarizer using NLP" 
        subtitle="Powered by Google Gemini AI"
        showGithubLink={true}
        githubUrl="https://github.com"
      />
      
      {/* Main Content */}
      <Box flex="1" py={8}>
        <Container maxW="container.md">
          <VStack spacing={4}>
            {/* Video Input Form */}
            <VideoInputForm onSubmit={handleSubmit} isLoading={loading} />
            
            {/* Loading Skeleton */}
            <LoadingSkeleton isVisible={loading} />
            
            {/* Video Result */}
            {!loading && thumbnail && videoInfo && (
              <VideoResult
                videoInfo={videoInfo}
                summary={summary}
                thumbnail={thumbnail}
                videoUrl={videoUrl}
                isMusicVideo={isMusicVideo}
                hasTranscript={hasTranscript}
                successScore={successScore}
                handleImageError={handleImageError}
              />
            )}
          </VStack>
        </Container>
      </Box>
      
      {/* Footer */}
      <Footer showTechStack={true} githubUrl="https://github.com" />
    </Box>
  )
}

export default App
