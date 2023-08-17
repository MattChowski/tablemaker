import { useState } from 'react';

import { Box } from '@mui/material';

import Grid from '@/grid/Grid';
import Sidebar from '@/sidebar/Sidebar';
import { DataObject } from './types';
import Tips from './components/Tips';

const App = () => {
  const [exportedData, setExportData] = useState<DataObject | null>(null);

  return (
    <Box
      sx={{
        display: 'flex'
      }}
    >
      <Sidebar setExportData={setExportData} exportedData={exportedData} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: '1',
          position: 'relative'
        }}
      >
        <Tips />
        <Grid exportedData={exportedData} />
      </Box>
    </Box>
  );
};

export default App;
