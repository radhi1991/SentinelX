import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import APIInventory from '../components/APIInventory';
import CryptoInventory from '../components/CryptoInventory';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Inventory = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          aria-label="inventory tabs"
        >
          <Tab label="API Inventory" />
          <Tab label="Crypto Inventory" />
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0}>
        <APIInventory />
      </TabPanel>
      
      <TabPanel value={currentTab} index={1}>
        <CryptoInventory />
      </TabPanel>
    </Box>
  );
};

export default Inventory;
