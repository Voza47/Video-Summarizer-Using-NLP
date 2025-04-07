import { ChakraProvider, extendTheme, ThemeConfig } from '@chakra-ui/react';
import { ReactNode } from 'react';

// Define the theme configuration
const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

// Define the theme
const theme = extendTheme({
  config,
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
      500: '#e53e3e', // Primary red
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
        outline: (props: any) => ({
          borderColor: props.colorMode === 'dark' ? 'red.300' : 'red.500',
          color: props.colorMode === 'dark' ? 'red.300' : 'red.500',
          _hover: {
            bg: props.colorMode === 'dark' ? 'rgba(229, 62, 62, 0.1)' : 'rgba(229, 62, 62, 0.1)',
          },
        }),
        ghost: (props: any) => ({
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
          _hover: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.100',
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
    Input: {
      variants: {
        filled: (props: any) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.50',
            _hover: {
              bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.100',
            },
            _focus: {
              bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.100',
              borderColor: 'red.500',
            },
          },
        }),
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Badge: {
      baseStyle: {
        textTransform: 'none',
        fontWeight: 'medium',
      },
    },
    Heading: {
      baseStyle: (props: any) => ({
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      }),
    },
    Text: {
      baseStyle: (props: any) => ({
        color: props.colorMode === 'dark' ? 'gray.300' : 'gray.700',
      }),
    },
  },
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  );
};

export default ThemeProvider;
export { theme }; 