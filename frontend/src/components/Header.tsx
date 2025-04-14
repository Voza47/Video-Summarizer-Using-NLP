import { 
  Box, 
  Container, 
  Flex, 
  Heading, 
  IconButton, 
  useColorMode, 
  useColorModeValue,
  HStack,
  Button,
  Text,
  Image
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { FaGithub } from 'react-icons/fa';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showThemeToggle?: boolean;
  showGithubLink?: boolean;
  githubUrl?: string;
}

export const Header = ({
  title,
  subtitle,
  showThemeToggle = true,
  showGithubLink = false,
  githubUrl = 'https://github.com',
}: HeaderProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.85)', 'rgba(26, 32, 44, 0.85)');
  const borderColor = useColorModeValue('rgba(226, 232, 240, 0.5)', 'rgba(74, 85, 104, 0.5)');

  return (
    <Box 
      as="header" 
      position="sticky" 
      top={0} 
      zIndex={10} 
      bg={bgColor}
      boxShadow="sm"
      borderBottom="1px" 
      borderColor={borderColor}
      backdropFilter="blur(10px)"
      transition="all 0.3s ease"
    >
      <Container maxW="container.xl" py={3}>
        <Flex justify="space-between" align="center">
          <Flex align="center">
            <Image 
              src="/logo.svg" 
              alt="Logo" 
              boxSize="32px" 
              mr={2} 
              fallbackSrc="https://via.placeholder.com/32/e53e3e/FFFFFF?text=V" 
            />
            <Box>
              <Heading 
                fontSize={["lg", "xl", "xl"]} 
                color={useColorModeValue('gray.800', 'white')}
                fontWeight="bold"
              >
                {title}
              </Heading>
              {subtitle && (
                <Text 
                  fontSize="xs" 
                  color={useColorModeValue('gray.600', 'gray.400')}
                  display={["none", "block"]}
                >
                  {subtitle}
                </Text>
              )}
            </Box>
          </Flex>
          
          <HStack spacing={2}>
            {showGithubLink && (
              <Button 
                as="a"
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                variant="ghost"
                leftIcon={<FaGithub />}
                display={["none", "flex"]}
                _hover={{
                  bg: useColorModeValue('rgba(237, 242, 247, 0.8)', 'rgba(45, 55, 72, 0.8)')
                }}
              >
                GitHub
              </Button>
            )}
            
            {showThemeToggle && (
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                colorScheme={colorMode === 'light' ? 'gray' : 'yellow'}
                size="sm"
                _hover={{
                  bg: useColorModeValue('rgba(237, 242, 247, 0.8)', 'rgba(45, 55, 72, 0.8)')
                }}
              />
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header; 