import { createTheme } from '@mui/material/styles';

export const skeuomorphicTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1a2035',
      paper: '#1f2940',
    },
    primary: {
      main: '#00d4ff',
      light: '#5cdfff',
      dark: '#00a0cc',
    },
    secondary: {
      main: '#7551FF',
      light: '#965eff',
      dark: '#5d3fd6',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(127deg, rgba(6, 11, 40, 0.94) 19%, rgba(10, 14, 35, 0.49) 76%)',
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 40px 0 rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          padding: '10px 24px',
          background: 'linear-gradient(127deg, rgba(117, 81, 255, 0.7) 0%, rgba(0, 212, 255, 0.7) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            background: 'linear-gradient(127deg, rgba(117, 81, 255, 0.8) 0%, rgba(0, 212, 255, 0.8) 100%)',
          },
          '&:active': {
            transform: 'translateY(1px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.95rem',
          minWidth: 'auto',
          padding: '12px 24px',
          color: '#ffffff',
          opacity: 0.7,
          '&.Mui-selected': {
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            opacity: 1,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          borderRadius: '12px',
          padding: '4px',
          '& .MuiTabs-indicator': {
            backgroundColor: '#00d4ff',
            height: '3px',
            borderRadius: '1.5px',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(0,0,0,0.02)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500,
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        },
      },
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
});
