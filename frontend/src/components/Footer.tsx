import {
  Box,
  Container,
  Flex,
  Link,
  Text,
  Icon,
  HStack,
  Divider,
  useColorModeValue,
  VStack,
  Badge
} from '@chakra-ui/react';
import { FaGithub, FaReact, FaPython, FaCode, FaBrain, FaYoutube } from 'react-icons/fa';

interface FooterProps {
  showTechStack?: boolean;
  githubUrl?: string;
}

const Footer = ({ showTechStack = true, githubUrl = '#' }: FooterProps) => {
  const bgColor = useColorModeValue('rgba(247, 250, 252, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const linkColor = useColorModeValue('red.500', 'red.300');
  const badgeBg = useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(45, 55, 72, 0.7)');
  const borderColor = useColorModeValue('rgba(226, 232, 240, 0.5)', 'rgba(74, 85, 104, 0.5)');
  
  return (
    <Box 
      as="footer" 
      pt={6} 
      pb={6}
      bg={bgColor}
      mt={8}
      borderTopWidth="1px"
      borderTopColor={borderColor}
      backdropFilter="blur(10px)"
      boxShadow="0 -5px 20px rgba(0, 0, 0, 0.05)"
    >
      <Container maxW="container.xl">
        <VStack spacing={6} align="stretch">
          {showTechStack && (
            <Box>
              <Text 
                fontSize="sm" 
                fontWeight="bold" 
                mb={3} 
                textAlign="center"
                color={textColor}
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Built with
              </Text>
              <Flex 
                justify="center" 
                wrap="wrap" 
                gap={3}
              >
                <Badge 
                  display="flex" 
                  alignItems="center" 
                  px={3} 
                  py={2} 
                  borderRadius="full" 
                  fontSize="xs"
                  bg={badgeBg}
                  color={textColor}
                  boxShadow="0 1px 2px rgba(0,0,0,0.05)"
                  backdropFilter="blur(5px)"
                >
                  <Icon as={FaReact} mr={1} color="blue.400" /> React
                </Badge>
                <Badge 
                  display="flex" 
                  alignItems="center" 
                  px={3} 
                  py={2} 
                  borderRadius="full" 
                  fontSize="xs"
                  bg={badgeBg}
                  color={textColor}
                  boxShadow="0 1px 2px rgba(0,0,0,0.05)"
                  backdropFilter="blur(5px)"
                >
                  <Icon as={FaCode} mr={1} color="blue.600" /> TypeScript
                </Badge>
                <Badge 
                  display="flex" 
                  alignItems="center" 
                  px={3} 
                  py={2} 
                  borderRadius="full" 
                  fontSize="xs"
                  bg={badgeBg}
                  color={textColor}
                  boxShadow="0 1px 2px rgba(0,0,0,0.05)"
                  backdropFilter="blur(5px)"
                >
                  <Icon as={FaPython} mr={1} color="green.500" /> FastAPI
                </Badge>
                <Badge 
                  display="flex" 
                  alignItems="center" 
                  px={3} 
                  py={2} 
                  borderRadius="full" 
                  fontSize="xs"
                  bg={badgeBg}
                  color={textColor}
                  boxShadow="0 1px 2px rgba(0,0,0,0.05)"
                  backdropFilter="blur(5px)"
                >
                  <Icon as={FaBrain} mr={1} color="purple.500" /> Advanced AI
                </Badge>
                <Badge 
                  display="flex" 
                  alignItems="center" 
                  px={3} 
                  py={2} 
                  borderRadius="full" 
                  fontSize="xs"
                  bg={badgeBg}
                  color={textColor}
                  boxShadow="0 1px 2px rgba(0,0,0,0.05)"
                  backdropFilter="blur(5px)"
                >
                  <Icon as={FaYoutube} mr={1} color="red.500" /> YouTube API
                </Badge>
              </Flex>
            </Box>
          )}
          
          <Divider borderColor={borderColor} />
          
          <Flex justify="center" align="center" fontSize="sm">
            <Text color={textColor} textAlign="center">
              © {new Date().getFullYear()} Video Summarizer
              <Text as="span" mx={2}>•</Text>
              <Link 
                href={githubUrl} 
                isExternal 
                color={linkColor}
                _hover={{ textDecoration: 'none', color: 'red.400' }}
                fontWeight="medium"
                display="inline-flex"
                alignItems="center"
              >
                <Icon as={FaGithub} mr={1} /> View on GitHub
              </Link>
            </Text>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default Footer; 