import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
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
          bg: props.colorMode === 'dark' ? 'rgba(26, 32, 44, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
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
}); 