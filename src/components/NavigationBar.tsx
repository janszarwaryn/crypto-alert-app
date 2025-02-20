import React, { useContext } from 'react';
import { AppBar, Toolbar, Button, Box, Tab, Tabs, useTheme, useMediaQuery } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { StreamContext } from '../context/StreamContext';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

const NavigationBar: React.FC = () => {
  const { isStreaming, startStream, stopStream } = useContext(StreamContext);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleStreamToggle = () => {
    if (isStreaming) {
      stopStream();
    } else {
      startStream();
    }
  };

  const currentTab = location.pathname === '/alerts' ? 1 : 0;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    navigate(newValue === 0 ? '/monitor' : '/alerts');
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: 'background.paper',
        backgroundImage: 'none',
        borderBottom: 1,
        borderColor: 'divider'
      }}
      elevation={0}
    >
      <Toolbar 
        sx={{ 
          gap: 2,
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 1, sm: 2 }
        }}
      >
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons={isMobile ? "auto" : false}
          allowScrollButtonsMobile
          sx={{
            minHeight: { xs: 48, sm: 48 },
            '& .MuiTab-root': {
              minHeight: { xs: 48, sm: 48 },
              padding: { xs: '6px 12px', sm: '12px 16px' },
              textTransform: 'none',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 500,
              color: 'text.secondary',
              minWidth: { xs: 'auto', sm: 90 },
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
            '& .MuiTabs-indicator': {
              height: 3,
            },
          }}
        >
          <Tab 
            icon={<ShowChartIcon />} 
            iconPosition="start" 
            label={isMobile ? "" : "Monitor"}
            aria-label="Monitor"
            sx={{ 
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 1
            }}
          />
          <Tab 
            icon={<NotificationsActiveIcon />} 
            iconPosition="start" 
            label={isMobile ? "" : "Alerts"}
            aria-label="Alerts"
            sx={{ 
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 1
            }}
          />
        </Tabs>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant={isStreaming ? 'outlined' : 'contained'}
          onClick={handleStreamToggle}
          startIcon={isStreaming ? <StopIcon /> : <PlayArrowIcon />}
          sx={{
            minWidth: 120,
            height: 40,
            textTransform: 'none',
            fontWeight: 500,
            ...(isStreaming && {
              borderColor: 'error.main',
              color: 'error.main',
              '&:hover': {
                borderColor: 'error.dark',
                backgroundColor: 'error.main',
                color: 'white'
              }
            })
          }}
        >
          {isStreaming ? 'Stop Stream' : 'Start Stream'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;