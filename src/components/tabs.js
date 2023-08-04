import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

export default function CTabs({ value, handleChange, switchTerm }) {
  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        <Tab value="one" label="All Courses" />
        <Tab value="two" label="Selected Courses" />
      </Tabs>
      
      <IconButton onClick={switchTerm} color="secondary" aria-label="switch term">
            <ChangeCircleIcon/>
        </IconButton>
    </Box>
  );
}