import {
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Image,
  Badge,
  Icon,
  Box,
  Heading,
  Link,
  Divider,
  Flex,
  useColorModeValue,
  Button,
  Tooltip,
  IconButton,
  SlideFade
} from '@chakra-ui/react';
import { 
  FaYoutube, 
  FaExternalLinkAlt, 
  FaMusic, 
  FaClosedCaptioning, 
  FaLanguage, 
  FaClock, 
  FaEye,
  FaShare,
  FaRegBookmark,
  FaBookmark,
  FaDownload
} from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface VideoInfo {
  title: string;
  author: string;
  views: number;
  length: number;
}

interface VideoResultProps {
  videoInfo: VideoInfo | null;
  summary: string;
  thumbnail: string;
  videoUrl: string;
  isMusicVideo: boolean;
  hasTranscript: boolean;
  successScore: number;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

// Format duration from seconds to mm:ss or hh:mm:ss
const formatDuration = (seconds: number) => {
  if (!seconds) return 'Unknown duration';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Format view count with appropriate suffixes (K, M, B)
const formatViews = (views: number) => {
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

// Custom components for markdown rendering
const MarkdownComponents = {
  p: (props: any) => <Text mb={4} lineHeight="tall" {...props} />,
  h1: (props: any) => <Heading as="h1" size="xl" mt={6} mb={4} {...props} />,
  h2: (props: any) => <Heading as="h2" size="lg" mt={5} mb={3} {...props} />,
  h3: (props: any) => <Heading as="h3" size="md" mt={4} mb={2} {...props} />,
  h4: (props: any) => <Heading as="h4" size="sm" mt={3} mb={2} {...props} />,
  ul: (props: any) => <Box as="ul" pl={4} ml={2} my={4} {...props} />,
  ol: (props: any) => <Box as="ol" pl={4} ml={2} my={4} {...props} />,
  li: (props: any) => <Box as="li" pb={1} {...props} />,
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
};

export const VideoResult = ({
  videoInfo,
  summary,
  thumbnail,
  videoUrl,
  isMusicVideo,
  hasTranscript,
  successScore,
  handleImageError
}: VideoResultProps) => {
  const [isSaved, setIsSaved] = useLocalStorage<boolean>(`saved-${videoUrl}`, false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(videoUrl);
    setShowShareOptions(false);
    // You would add a toast notification here
  };
  
  const downloadSummary = () => {
    const element = document.createElement("a");
    const title = videoInfo?.title || "Video Summary";
    const file = new Blob([`# ${title}\n\n${summary}`], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <SlideFade in={true} offsetY="20px">
      <Card w="full" overflow="hidden" bg={cardBg} boxShadow="xl" borderRadius="2xl">
        <Image
          src={thumbnail}
          alt="Video thumbnail"
          h="300px"
          w="full"
          objectFit="cover"
          onError={handleImageError}
        />
        
        {videoInfo && (
          <CardBody>
            <VStack align="start" spacing={4}>
              <Heading size="lg" color={useColorModeValue('gray.800', 'white')} noOfLines={2}>
                {videoInfo.title}
              </Heading>
              
              <HStack spacing={3} wrap="wrap">
                {videoInfo.length > 0 && (
                  <Badge 
                    bg={useColorModeValue('purple.100', 'purple.900')} 
                    color={useColorModeValue('purple.800', 'purple.200')}
                    display="flex" 
                    alignItems="center" 
                    p={2} 
                    borderRadius="full" 
                    fontWeight="medium"
                  >
                    <Icon as={FaClock} mr={2} />
                    {formatDuration(videoInfo.length)}
                  </Badge>
                )}
                
                {videoInfo.views > 0 && (
                  <Badge 
                    bg={useColorModeValue('blue.100', 'blue.900')} 
                    color={useColorModeValue('blue.800', 'blue.200')}
                    display="flex" 
                    alignItems="center" 
                    p={2} 
                    borderRadius="full" 
                    fontWeight="medium"
                  >
                    <Icon as={FaEye} mr={2} />
                    {formatViews(videoInfo.views)}
                  </Badge>
                )}
                
                {isMusicVideo && (
                  <Badge 
                    bg={useColorModeValue('red.100', 'red.900')} 
                    color={useColorModeValue('red.800', 'red.200')}
                    display="flex" 
                    alignItems="center" 
                    p={2} 
                    borderRadius="full" 
                    fontWeight="medium"
                  >
                    <Icon as={FaMusic} mr={2} />
                    Music Video
                  </Badge>
                )}
                
                {hasTranscript && (
                  <Badge 
                    bg={useColorModeValue('green.100', 'green.900')} 
                    color={useColorModeValue('green.800', 'green.200')}
                    display="flex" 
                    alignItems="center" 
                    p={2} 
                    borderRadius="full" 
                    fontWeight="medium"
                  >
                    <Icon as={FaClosedCaptioning} mr={2} />
                    Transcript Available
                  </Badge>
                )}
              </HStack>
              
              <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.300')}>
                By <Text as="span" fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>{videoInfo.author}</Text>
              </Text>
              
              <Flex justify="space-between" w="full">
                <Link 
                  href={videoUrl}
                  isExternal 
                  color={useColorModeValue('red.500', 'red.300')}
                  fontSize="sm"
                  display="flex" 
                  alignItems="center"
                  _hover={{
                    color: useColorModeValue('red.600', 'red.400'),
                    textDecoration: 'none'
                  }}
                >
                  Watch on YouTube <Icon as={FaExternalLinkAlt} ml={2} />
                </Link>
                
                <HStack spacing={2}>
                  <Tooltip label="Save summary" placement="top">
                    <IconButton
                      aria-label="Save summary"
                      icon={isSaved ? <FaBookmark /> : <FaRegBookmark />}
                      size="sm"
                      variant="ghost"
                      colorScheme={isSaved ? "yellow" : "gray"}
                      onClick={() => setIsSaved(!isSaved)}
                    />
                  </Tooltip>
                  
                  <Tooltip label="Share" placement="top">
                    <IconButton
                      aria-label="Share video"
                      icon={<FaShare />}
                      size="sm"
                      variant="ghost"
                      colorScheme="gray"
                      onClick={() => setShowShareOptions(!showShareOptions)}
                    />
                  </Tooltip>
                  
                  <Tooltip label="Download summary" placement="top">
                    <IconButton
                      aria-label="Download summary"
                      icon={<FaDownload />}
                      size="sm"
                      variant="ghost"
                      colorScheme="gray"
                      onClick={downloadSummary}
                    />
                  </Tooltip>
                </HStack>
              </Flex>
              
              {showShareOptions && (
                <Box 
                  p={2} 
                  bg={hoverBg} 
                  borderRadius="md" 
                  w="full"
                  mt={-2}
                >
                  <VStack spacing={2} align="stretch">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      justifyContent="flex-start" 
                      onClick={copyToClipboard}
                    >
                      Copy video URL
                    </Button>
                  </VStack>
                </Box>
              )}
            </VStack>
          </CardBody>
        )}

        {summary && (
          <CardBody pt={0}>
            <Divider my={6} borderColor={useColorModeValue('gray.200', 'gray.700')} />
            
            {isMusicVideo && (
              <Box 
                p={4} 
                bg={useColorModeValue('red.50', 'rgba(254, 178, 178, 0.1)')} 
                borderRadius="xl" 
                mb={6}
              >
                <Flex alignItems="center">
                  <Icon as={FaMusic} mr={3} color={useColorModeValue('red.500', 'red.300')} boxSize={5} />
                  <Text color={useColorModeValue('gray.700', 'gray.300')} fontSize="sm">
                    This appears to be a music video. The summary is based on available information about the song and artist.
                  </Text>
                </Flex>
              </Box>
            )}
            
            {!hasTranscript && !isMusicVideo && (
              <Box 
                p={4} 
                bg={useColorModeValue('yellow.50', 'rgba(250, 240, 137, 0.1)')} 
                borderRadius="xl" 
                mb={6}
              >
                <Flex alignItems="center">
                  <Icon as={FaLanguage} mr={3} color={useColorModeValue('yellow.500', 'yellow.300')} boxSize={5} />
                  <Text color={useColorModeValue('gray.700', 'gray.300')} fontSize="sm">
                    No transcript was found for this video. The summary is based on video metadata only.
                  </Text>
                </Flex>
              </Box>
            )}
            
            <Box 
              className="markdown-body"
              color={useColorModeValue('gray.700', 'gray.300')}
              fontSize="md"
              lineHeight="tall"
              sx={{
                '& > *:first-of-type': { mt: 0 },
                '& h1, & h2, & h3, & h4': {
                  color: useColorModeValue('gray.800', 'white'),
                  fontWeight: 'bold',
                  my: 4
                },
                '& p': { mb: 4 },
                '& ul, & ol': { mb: 4, pl: 4 },
                '& li': { mb: 2 },
                '& a': {
                  color: useColorModeValue('red.500', 'red.300'),
                  textDecoration: 'none',
                  _hover: {
                    color: useColorModeValue('red.600', 'red.400'),
                    textDecoration: 'underline'
                  }
                }
              }}
            >
              <ReactMarkdown components={MarkdownComponents}>
                {summary}
              </ReactMarkdown>
            </Box>
          </CardBody>
        )}
      </Card>
    </SlideFade>
  );
};

export default VideoResult; 