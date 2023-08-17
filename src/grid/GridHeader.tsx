import React, { useState } from 'react';

import { Box, IconButton, InputBase, Popper } from '@mui/material';
import AlignHorizontalRightRoundedIcon from '@mui/icons-material/AlignHorizontalRightRounded';
import AlignHorizontalLeftRoundedIcon from '@mui/icons-material/AlignHorizontalLeftRounded';
import AlignHorizontalCenterRoundedIcon from '@mui/icons-material/AlignHorizontalCenterRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { GridHeaderProps } from '@/types';

const GridHeader: React.FC<GridHeaderProps> = ({ initialValue, ...props }) => {
  const [value, setValue] = useState(initialValue || 'Header');
  const [isEditing, setIsEditing] = useState(false);
  const [showAligns, setShowAligns] = useState(false);
  const [align, setAlign] = useState('center');
  const [headerVisible, setHeaderVisible] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleEnableEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setValue(event.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(e.currentTarget as HTMLDivElement);
    setShowAligns(true);
  };

  const handleMouseLeave = () => {
    setShowAligns(false);
  };

  const handleAlignRight = () => {
    setAlign('flex-end');
  };

  const handleAlignLeft = () => {
    setAlign('flex-start');
  };

  const handleResetAlign = () => {
    setAlign('center');
  };

  const handleToggleVisible = () => {
    setHeaderVisible((prevState) => !prevState);
  };

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: align,
        height: '100%',
        padding: align === 'center' ? '16px 12px' : '16px 0px',
        transition: 'opacity .1s ease',
        opacity: headerVisible ? '1' : '0'
      }}
    >
      {!isEditing ? (
        <>
          <Popper
            open={showAligns}
            anchorEl={anchorEl}
            placement='top'
            sx={{
              background: 'white',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 0 15px rgba(0,0,0, 0.1)'
            }}
          >
            <>
              <IconButton onClick={handleAlignLeft}>
                <AlignHorizontalLeftRoundedIcon />
              </IconButton>
              <IconButton onClick={handleResetAlign}>
                <AlignHorizontalCenterRoundedIcon />
              </IconButton>
              <IconButton onClick={handleAlignRight}>
                <AlignHorizontalRightRoundedIcon />
              </IconButton>
              <IconButton onClick={handleToggleVisible}>
                {headerVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </>
          </Popper>

          <Box
            {...props}
            onClick={handleEnableEdit}
            className='cellValue'
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: '0.2s ease',
              borderRadius: '12px',
              color: '#EB3C00',
              minWidth: '50px',
              minHeight: '20px',
              padding: '4px 12px',
              fontSize: '16px',
              fontFamily: 'Good Headline Pro Medium',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              '&:hover': {
                background: 'rgba(235, 60, 0, 0.05)'
              }
            }}
          >
            {value}
          </Box>
        </>
      ) : (
        <InputBase
          autoFocus
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          sx={{
            width: '100%',
            fontSize: '16px',
            fontFamily: 'Good Headline Pro Medium',
            fontWeight: 500,
            background: 'rgba(235, 60, 0, 0.05)',
            borderRadius: '12px',
            padding: '4px 8px',
            margin: align === 'center' ? '0' : '0 12px'
          }}
        />
      )}
    </Box>
  );
};

export const gridHeaderWrapper = () => <GridHeader initialValue='Header' />;

export default GridHeader;
