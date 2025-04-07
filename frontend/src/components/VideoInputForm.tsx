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
  Flex
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
  const inputBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBorder = useColorModeValue('gray.300', 'gray.500');

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
    <Card w="full" bg={cardBg} boxShadow="xl" borderRadius="2xl" position="relative">
      <CardBody>
        <VStack spacing={4}>
          <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.300')}>
            Enter a YouTube video URL to get an AI-generated summary
          </Text>
          
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={FaLink} color={useColorModeValue('gray.400', 'gray.500')} />
            </InputLeftElement>
            
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              bg={inputBg}
              border="2px"
              borderColor={inputBorder}
              onKeyPress={handleKeyPress}
              _hover={{
                borderColor: hoverBorder
              }}
              _focus={{
                borderColor: 'red.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-red-500)'
              }}
              pr="4.5rem"
            />
            
            <InputRightElement width="4.5rem">
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
            <Card 
              position="absolute" 
              top="100%" 
              left={0} 
              right={0} 
              zIndex={10} 
              mt={2} 
              bg={cardBg}
              boxShadow="md"
              borderRadius="md"
              borderWidth="1px"
              borderColor={inputBorder}
            >
              <CardBody p={2}>
                <VStack align="stretch" spacing={0}>
                  <Flex justify="space-between" px={2} py={1}>
                    <Text fontSize="xs" fontWeight="bold" color={useColorModeValue('gray.500', 'gray.400')}>
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
                      px={2}
                      py={1}
                      height="auto"
                      fontSize="sm"
                      onClick={() => selectRecentUrl(recentUrl)}
                      _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                      borderRadius={0}
                    >
                      <Icon as={FaYoutube} mr={2} />
                      <Text isTruncated maxW="calc(100% - 2rem)">
                        {recentUrl}
                      </Text>
                    </Button>
                  ))}
                </VStack>
              </CardBody>
            </Card>
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
          >
            Summarize
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default VideoInputForm; 