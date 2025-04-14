import {
  Card,
  CardBody,
  VStack,
  Input,
  Button,
  Text,
  InputGroup,
  InputLeftElement,
  Icon,
  useColorModeValue,
  useToast,
  InputRightElement,
  IconButton,
  Flex,
  Box
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaYoutube, FaLink, FaHistory, FaTimes } from 'react-icons/fa';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface VideoInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const VideoInputForm = ({ onSubmit, isLoading }: VideoInputFormProps) => {
  const [url, setUrl] = useState('');
  const [recentUrls, setRecentUrls] = useLocalStorage<string[]>('recent-videos', []);
  const [showHistory, setShowHistory] = useState(false);
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');

  const handleSubmit = () => {
    if (!url) {
      toast({
        title: 'Error',
        description: 'Please enter a YouTube URL',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      return;
    }

    // Check if it's a valid YouTube URL
    if (!url.includes('youtube.com/watch') && !url.includes('youtu.be/')) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid YouTube video URL',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      return;
    }

    // Add to recent URLs if not already present
    if (!recentUrls.includes(url)) {
      setRecentUrls([url, ...recentUrls.slice(0, 4)]);
    }
    
    onSubmit(url);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const selectRecentUrl = (selectedUrl: string) => {
    setUrl(selectedUrl);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setRecentUrls([]);
    setShowHistory(false);
  };

  const clearInput = () => {
    setUrl('');
  };

  return (
    <Card
      w="full"
      bg={cardBg}
      boxShadow="xl"
      borderRadius="2xl"
      position="relative"
      overflow="hidden"
    >
      <CardBody p={6}>
        <VStack spacing={6}>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color={textColor}
            textAlign="center"
          >
            Enter a YouTube video URL to get an AI-generated summary
          </Text>
          
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={FaYoutube} color="red.400" boxSize={5} />
            </InputLeftElement>
            
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              bg={inputBg}
              border="1px"
              borderColor={borderColor}
              color={textColor}
              onKeyPress={handleKeyPress}
              _hover={{
                borderColor: 'red.300'
              }}
              _focus={{
                borderColor: 'red.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-red-500)'
              }}
              pr="4.5rem"
              size="lg"
              height="60px"
              fontSize="md"
            />
            
            <InputRightElement width="4.5rem" h="60px">
              {url && (
                <IconButton
                  aria-label="Clear input"
                  h="1.75rem"
                  size="sm"
                  icon={<FaTimes />}
                  onClick={clearInput}
                  colorScheme="gray"
                  variant="ghost"
                />
              )}
              {!url && recentUrls.length > 0 && (
                <IconButton
                  aria-label="Show recent URLs"
                  h="1.75rem"
                  size="sm"
                  icon={<FaHistory />}
                  onClick={() => setShowHistory(!showHistory)}
                  colorScheme="gray"
                  variant="ghost"
                />
              )}
            </InputRightElement>
          </InputGroup>
          
          {showHistory && recentUrls.length > 0 && (
            <Box 
              position="absolute" 
              top="calc(100% - 20px)" 
              left={0} 
              right={0} 
              zIndex={10} 
              bg={cardBg}
              borderRadius="md"
              boxShadow="md"
              borderWidth="1px"
              borderColor={borderColor}
              overflow="hidden"
            >
              <VStack align="stretch" spacing={0}>
                <Flex justify="space-between" px={4} py={2}>
                  <Text fontSize="xs" fontWeight="bold" color={textColor}>
                    RECENT VIDEOS
                  </Text>
                  <Button 
                    size="xs" 
                    variant="ghost" 
                    colorScheme="red" 
                    onClick={clearHistory}
                  >
                    Clear
                  </Button>
                </Flex>
                
                {recentUrls.map((recentUrl, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    justifyContent="flex-start"
                    px={4}
                    py={2}
                    height="auto"
                    fontSize="sm"
                    onClick={() => selectRecentUrl(recentUrl)}
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                    borderRadius={0}
                    color={textColor}
                  >
                    <Icon as={FaYoutube} mr={2} color="red.400" />
                    <Text isTruncated maxW="calc(100% - 2rem)">
                      {recentUrl}
                    </Text>
                  </Button>
                ))}
              </VStack>
            </Box>
          )}
          
          <Button
            w="full"
            size="lg"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Summarizing..."
            bgGradient="linear(to-r, red.500, red.600)"
            color="white"
            _hover={{
              bgGradient: "linear(to-r, red.600, red.700)"
            }}
            leftIcon={<FaYoutube />}
            boxShadow="md"
            height="60px"
            fontSize="lg"
            fontWeight="bold"
            transition="all 0.3s ease"
            _active={{
              transform: "scale(0.98)"
            }}
          >
            Summarize Video
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default VideoInputForm; 