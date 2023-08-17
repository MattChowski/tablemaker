import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { Box, InputBase } from '@mui/material';
import { GridCellProps } from '@/types';
import { useGridStore } from '@/stores/gridStore';
import { shallow } from 'zustand/shallow';

const GridCell = ({ rowIndex, columnId }: GridCellProps) => {
  const { data, setCellData, centerCell, cellPadding, firstColumnIsHeader } =
    useGridStore(
      (state) => ({
        data: state.data,
        setCellData: state.setCellData,
        centerCell: state.centerCell,
        cellPadding: state.cellPadding,
        firstColumnIsHeader: state.firstColumnIsHeader
      }),
      shallow
    );
  const [value, setValue] = React.useState(data[rowIndex][columnId] || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleEnableEdit = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    setCellData(rowIndex, columnId, value);
  }, [columnId, rowIndex, setCellData, value]);

  return (
    <Box
      sx={{
        padding: `${cellPadding === 0 ? 6 : cellPadding}px 12px`,
        width: '100%',
        borderBottom: '0',
        ...(firstColumnIsHeader && {
          '&.column-1': {
            color: '#666666',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            borderRight: '1px solid #ddd',
            '& > div': {
              fontWeight: '500',
              fontSize: '16px',
              textAlign: 'right',
              justifyContent: 'right'
            }
          }
        })
      }}
    >
      {!isEditing ? (
        <Box
          onClick={handleEnableEdit}
          // onKeyDown={handleCellKeyDown}
          tabIndex={0}
          className='cellValue'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            minHeight: '30px',
            height: '100%',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Good Headline Pro, sans-serif',
            transition: 'padding 0.2s ease, background 0.2s ease',
            borderRadius: '12px',
            boxSizing: 'border-box',
            whiteSpace: 'pre-line',
            ...(centerCell && {
              justifyContent: 'center',
              textAlign: 'center'
            }),
            '&:hover': {
              background: 'rgba(235, 60, 0, 0.05)',
              padding: '0px 8px'
            },
            '&:focus-visible': {
              // border: "1px solid rgba(242, 232, 201, 1)",
              background: 'rgba(235, 60, 0, 0.05)',
              padding: '0px 8px',
              outline: 'none'
            },
            '& h1, h2, h3, h4': {
              margin: 0
            },
            '& ul': {
              paddingLeft: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }
          }}
        >
          <ReactMarkdown>{value}</ReactMarkdown>
          {/* {value && value.startsWith('•') && value.split('•').length ? (
            <Box
              component='ul'
              sx={{
                paddingLeft: '16px'
              }}
            >
              {value
                .split('•')
                .slice(1)
                .map((cell, index) => (
                  <Box
                    component='li'
                    key={`${index}-${cell}`}
                    sx={{
                      padding: '4px 0'
                    }}
                  >
                    {cell}
                  </Box>
                ))}
            </Box>
          ) : (
            value
          )} */}
        </Box>
      ) : (
        <InputBase
          autoFocus
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          data-id={columnId}
          multiline
          sx={{
            fontSize: '14px',
            fontFamily: 'Good Headline Pro',
            background: 'rgba(235, 60, 0, 0.05)',
            border: '1px solid rgba(235, 60, 0, 0.2)',
            borderRadius: '12px',
            padding: '2px 8px',
            width: '100%',
            minHeight: '30px',
            '& input': {
              width: '100%'
            }
          }}
        />
      )}
    </Box>
  );
};

export default GridCell;
