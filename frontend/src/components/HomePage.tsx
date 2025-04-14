import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useColorMode,
  useColorModeValue,
  Flex,
  ScaleFade,
  SlideFade,
  Fade,
  keyframes,
  chakra
} from '@chakra-ui/react';
import { FaVideo, FaBrain, FaCommentAlt, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import BackgroundAnimation from './BackgroundAnimation';

// Create animated components with framer-motion
const MotionBox = chakra(motion.div);

// Keyframes for pulsating effect
const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

// Keyframes for rotating border effect
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const HomePage = () => {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const accentColor = useColorModeValue('red.500', 'red.300');
  const borderColor = useColorModeValue('red.200', 'red.700');
  
  const [headingVisible, setHeadingVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  // Choose the background animation type based on color mode
  const animationType = colorMode === 'dark' ? 'net' : 'fog';

  // Staggered animations on load
  useEffect(() => {
    const timer1 = setTimeout(() => setHeadingVisible(true), 300);
    const timer2 = setTimeout(() => setTaglineVisible(true), 800);
    const timer3 = setTimeout(() => setFeaturesVisible(true), 1300);
    const timer4 = setTimeout(() => setButtonVisible(true), 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <Box height="100vh" width="100%" overflow="hidden" position="relative">
      {/* Background Animation */}
      <BackgroundAnimation 
        type={animationType}
        color={colorMode === 'dark' ? '#ff5555' : '#ff3333'}
        backgroundColor={colorMode === 'dark' ? '#1a202c' : '#f7fafc'}
        mouseControls={true}
        touchControls={true}
        scale={1.0}
        scaleMobile={1.0}
        speed={colorMode === 'dark' ? 1.0 : 3.0}
      />
      
      {/* Content overlay */}
      <Box 
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg={colorMode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)'}
        backdropFilter="blur(1px)"
        zIndex={1}
      />
      
      {/* Main content */}
      <Container maxW="container.xl" h="100vh" display="flex" alignItems="center" position="relative" zIndex={2}>
        <VStack spacing={6} align="center" textAlign="center" w="full">
          {/* 3D Logo/Icon with pulsating effect */}
          <Box position="relative" mb={4}>
            <MotionBox
              animation={`${pulse} 3s infinite ease-in-out`}
              borderRadius="full"
              bg={`rgba(${colorMode === 'dark' ? '255, 85, 85, 0.2' : '255, 51, 51, 0.15'})`}
              w="100px"
              h="100px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
              zIndex={2}
            >
              <Icon as={FaVideo} w={12} h={12} color={accentColor} />
            </MotionBox>
            <Box
              position="absolute"
              top="-10px"
              left="-10px"
              right="-10px"
              bottom="-10px"
              borderRadius="full"
              borderWidth="2px"
              borderColor={accentColor}
              opacity={0.6}
              animation={`${spin} 10s infinite linear`}
            />
          </Box>
          
          {/* Heading with reveal animation */}
          <ScaleFade in={headingVisible} initialScale={0.8}>
            <Heading
              as="h1"
              size="2xl"
              bgGradient={`linear(to-r, ${accentColor}, purple.500)`}
              bgClip="text"
              letterSpacing="tight"
              fontWeight="extrabold"
            >
              Video Summarizer
            </Heading>
          </ScaleFade>
          
          {/* Tagline with reveal animation */}
          <SlideFade in={taglineVisible} offsetY="20px">
            <Text fontSize="lg" color={textColor} maxW="container.md">
              Transform lengthy videos into concise, intelligent summaries using advanced NLP technology.
            </Text>
          </SlideFade>
          
          {/* Features with reveal animation */}
          <Fade in={featuresVisible}>
            <HStack spacing={4} mt={4} justify="center">
              <VStack 
                bg={colorMode === 'dark' ? 'rgba(26, 32, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)'}
                backdropFilter="blur(10px)"
                borderRadius="xl"
                p={4}
                boxShadow="md"
                w="220px"
                h="160px"
                justify="center"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Icon as={FaVideo} w={8} h={8} color={accentColor} />
                <Heading size="sm" mt={1}>AI-Powered</Heading>
                <Text fontSize="sm">Uses advanced AI to analyze video content</Text>
              </VStack>
              
              <VStack 
                bg={colorMode === 'dark' ? 'rgba(26, 32, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)'}
                backdropFilter="blur(10px)"
                borderRadius="xl"
                p={4}
                boxShadow="md"
                w="220px"
                h="160px"
                justify="center"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Icon as={FaBrain} w={8} h={8} color={accentColor} />
                <Heading size="sm" mt={1}>Smart Summaries</Heading>
                <Text fontSize="sm">Creates structured, context-aware summaries</Text>
              </VStack>
              
              <VStack 
                bg={colorMode === 'dark' ? 'rgba(26, 32, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)'}
                backdropFilter="blur(10px)"
                borderRadius="xl"
                p={4}
                boxShadow="md"
                w="220px"
                h="160px"
                justify="center"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Icon as={FaCommentAlt} w={8} h={8} color={accentColor} />
                <Heading size="sm" mt={1}>Any YouTube Video</Heading>
                <Text fontSize="sm">Works with any public YouTube video in seconds</Text>
              </VStack>
            </HStack>
          </Fade>
          
          {/* Call to action button with reveal animation */}
          <ScaleFade in={buttonVisible} initialScale={0.9}>
            <Button
              as={RouterLink}
              to="/app"
              size="md"
              rightIcon={<FaArrowRight />}
              colorScheme="red"
              bgGradient={`linear(to-r, ${accentColor}, purple.500)`}
              _hover={{
                bgGradient: `linear(to-r, ${accentColor}, purple.600)`,
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              mt={6}
              px={6}
              py={5}
              fontSize="md"
            >
              Get Started
            </Button>
          </ScaleFade>
        </VStack>
      </Container>
    </Box>
  );
};

export default HomePage; 