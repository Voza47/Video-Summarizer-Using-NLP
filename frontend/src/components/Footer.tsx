import {
  Box,
  Container,
  Text,
  VStack,
  HStack,
  Link,
  Icon,
  useColorModeValue,
  Divider,
  Button
} from '@chakra-ui/react';
import { FaGithub, FaReact, FaPython, FaRobot } from 'react-icons/fa';
import { SiChakraui, SiFastapi } from 'react-icons/si';

interface FooterProps {
  showTechStack?: boolean;
  githubUrl?: string;
}

export const Footer = ({ 
  showTechStack = true,
  githubUrl = 'https://github.com'
}: FooterProps) => {
  const year = new Date().getFullYear();
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  return (
    <Box 
      as="footer" 
      mt={10} 
      py={8}
      borderTop="1px" 
      borderTopColor={borderColor}
      bg={bgColor}
    >
      <Container maxW="container.md" centerContent>
        <VStack spacing={6} textAlign="center">
          <Text 
            fontSize="sm" 
            fontWeight="medium"
            color={textColor}
          >
            Video Summarizer using NLP
          </Text>
          
          {showTechStack && (
            <HStack spacing={4} wrap="wrap" justify="center">
              <Button 
                leftIcon={<Icon as={FaReact} />}
                size="xs" 
                variant="ghost" 
                colorScheme="blue"
                as={Link}
                href="https://reactjs.org"
                isExternal
              >
                React
              </Button>
              
              <Button 
                leftIcon={<Icon as={SiChakraui} />}
                size="xs" 
                variant="ghost" 
                colorScheme="teal"
                as={Link}
                href="https://chakra-ui.com"
                isExternal
              >
                Chakra UI
              </Button>
              
              <Button 
                leftIcon={<Icon as={FaPython} />}
                size="xs" 
                variant="ghost" 
                colorScheme="yellow"
                as={Link}
                href="https://www.python.org"
                isExternal
              >
                Python
              </Button>
              
              <Button 
                leftIcon={<Icon as={SiFastapi} />}
                size="xs" 
                variant="ghost" 
                colorScheme="green"
                as={Link}
                href="https://fastapi.tiangolo.com"
                isExternal
              >
                FastAPI
              </Button>
              
              <Button 
                leftIcon={<Icon as={FaRobot} />}
                size="xs" 
                variant="ghost" 
                colorScheme="purple"
                as={Link}
                href="https://ai.google.dev"
                isExternal
              >
                Gemini AI
              </Button>
            </HStack>
          )}
          
          <Divider borderColor={borderColor} w="50%" />
          
          <VStack spacing={1}>
            <Text fontSize="xs" color={textColor}>
              Powered by Google Gemini AI • Built with FastAPI and React
            </Text>
            
            <Text fontSize="xs" color={textColor}>
              © {year} Video Summarizer using NLP
            </Text>
          </VStack>
          
          <Button
            as="a"
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            leftIcon={<FaGithub />}
            variant="outline"
            colorScheme="gray"
          >
            View on GitHub
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default Footer; 