import { styled } from '@mui/material/styles';
import { Box, Paper, Card } from '@mui/material';

export const GlassCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(127deg, rgba(6, 11, 40, 0.94) 19%, rgba(10, 14, 35, 0.49) 76%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.4)',
  },
}));

export const MetricCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'linear-gradient(127deg, rgba(31, 41, 64, 0.94) 19%, rgba(31, 41, 64, 0.49) 76%)',
  borderRadius: '20px',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #00d4ff, #7551FF)',
    opacity: 0.8,
  },
}));

export const ChartContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'linear-gradient(127deg, rgba(31, 41, 64, 0.94) 19%, rgba(31, 41, 64, 0.49) 76%)',
  borderRadius: '16px',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
}));

export const DataGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(3),
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  width: '100%',
  padding: theme.spacing(3),
  background: 'linear-gradient(127deg, rgba(26, 32, 53, 1) 0%, rgba(28, 35, 58, 0.92) 100%)',
  borderRadius: '30px',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
}));

export const StatusBadge = styled(Box)(({ status, theme }) => {
  const colors = {
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#00d4ff',
  };

  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 16px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#ffffff',
    background: `linear-gradient(127deg, ${colors[status]}CC 0%, ${colors[status]}99 100%)`,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: `0 4px 12px ${colors[status]}40`,
    '&::before': {
      content: '""',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
      marginRight: '8px',
      boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
    },
  };
});
