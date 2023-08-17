import { useState } from 'react';

import { Box } from '@mui/material';

import Grid from '@/grid/Grid';
import Sidebar from '@/sidebar/Sidebar';
import { DataObject } from './types';

const App = () => {
  const rawSavedData = localStorage.getItem('tableData');
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
          flex: '1'
        }}
      >
        <Grid exportedData={exportedData} />
      </Box>
    </Box>
  );
};

export default App;
