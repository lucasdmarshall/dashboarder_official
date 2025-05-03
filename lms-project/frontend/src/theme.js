import { extendTheme } from '@chakra-ui/react';
import '@fontsource/bree-serif/400.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';

const theme = extendTheme({
  styles: {
    global: {
      '@import': [
        "url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Nunito:wght@300;400;600;700&display=swap')"
      ],
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      }
    }
  },
  fonts: {
    heading: 'Lora, serif',
    body: 'Nunito, sans-serif',
  },
  colors: {
    brand: {
      primary: '#640101',
      secondary: 'black',
      white: 'white',
    }
  },
  components: {
    Button: {
      baseStyle: {
        _hover: {
          transform: 'scale(1.05)',
          boxShadow: 'lg',
        }
      },
      variants: {
        solid: {
          bg: 'brand.primary',
          color: 'white',
          _hover: {
            bg: 'brand.secondary',
          }
        }
      }
    },
    Card: {
      baseStyle: {
        container: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'lg',
          borderRadius: 'xl',
          border: '1px solid rgba(255, 255, 255, 0.125)',
        }
      }
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'xl',
        }
      }
    },
    Heading: {
      baseStyle: {
        fontFamily: 'Lora, serif',
      }
    },
    Text: {
      baseStyle: {
        fontFamily: 'Nunito, sans-serif',
      }
    }
  }
});

export default theme;
