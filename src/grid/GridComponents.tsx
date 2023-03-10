import React, { useState, useContext } from 'react'

import { Box, IconButton, InputBase, styled, TableCell, Popper } from '@mui/material'
import AlignHorizontalRightRoundedIcon from '@mui/icons-material/AlignHorizontalRightRounded'
import AlignHorizontalLeftRoundedIcon from '@mui/icons-material/AlignHorizontalLeftRounded'
import AlignHorizontalCenterRoundedIcon from '@mui/icons-material/AlignHorizontalCenterRounded'
import { type ContextType, TableContext } from '@/App'
import { getExportData } from '@/utilities/utils'

interface HeaderProps {
  initialValue?: string
}

export const GridTable = styled('table')(() => ({
  border: 0,
  boxShadow: '0px 0px 25px 0px rgba(0, 0, 0, 0.15)',
}))

export const GridHeader: React.FC<HeaderProps> = ({ initialValue, ...props }) => {
  const { tableRef } = useContext(TableContext) as ContextType
  const [value, setValue] = useState(initialValue || 'Header')
  const [isEditing, setIsEditing] = useState(false)
  const [showAligns, setShowAligns] = useState(false)
  const [align, setAlign] = useState('center')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleEnableEdit = () => {
    setIsEditing(true)
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleBlur = () => {
    if (tableRef) {
      const data = getExportData(tableRef)
      localStorage.setItem('tableData', JSON.stringify(data))
    }
    setIsEditing(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (tableRef) {
        const data = getExportData(tableRef)
        localStorage.setItem('tableData', JSON.stringify(data))
      }
      setIsEditing(false)
    }
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(e.currentTarget as HTMLDivElement)
    setShowAligns(true)
  }

  const handleMouseLeave = () => {
    setShowAligns(false)
  }

  const handleAlignRight = () => {
    setAlign('flex-end')
  }

  const handleAlignLeft = () => {
    setAlign('flex-start')
  }

  const handleResetAlign = () => {
    setAlign('center')
  }

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
              boxShadow: '0 0 15px rgba(0,0,0, 0.1)',
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
                background: 'rgba(235, 60, 0, 0.05)',
              },
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
            margin: align === 'center' ? '0' : '0 12px',
          }}
        />
      )}
    </Box>
  )
}

export const GridCell: React.FC<HeaderProps> = ({ initialValue, ...props }) => {
  const { cellPadding, centerCell, firstColumnIsHeader, tableRef } = useContext(TableContext) as ContextType
  const [value, setValue] = useState(initialValue || '')
  const [isEditing, setIsEditing] = useState(false)

  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleEnableEdit = () => {
    setIsEditing(true)
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(false)
    console.log(event.target.value)
    if (tableRef) {
      const data = getExportData(tableRef)

      if (event.target instanceof HTMLInputElement) {
        const value = event.target.value
        const rowIndex = parseInt(event.target.closest('td')?.dataset.rowindex || '0', 10)
        const cellIndex = parseInt(event.target.closest('td')?.dataset.cellindex || '0', 10)

        if (data) {
          data.rows[rowIndex].values[cellIndex] = value
        }
        console.log({ data })
      }
      localStorage.setItem('tableData', JSON.stringify(data))
    }
  }

  const handleCellKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      setIsEditing(true)
    }
  }

  return (
    <TableCell
      {...props}
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
              justifyContent: 'right',
            },
          },
        }),
      }}
    >
      {!isEditing ? (
        <Box
          onClick={handleEnableEdit}
          onKeyDown={handleCellKeyDown}
          tabIndex={0}
          className='cellValue'
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            minHeight: '30px',
            height: '100%',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Good Headline Pro',
            transition: 'padding 0.2s ease, background 0.2s ease',
            borderRadius: '12px',
            boxSizing: 'border-box',
            whiteSpace: 'pre-line',
            ...(centerCell && {
              justifyContent: 'center',
              textAlign: 'center',
            }),
            '&:hover': {
              background: 'rgba(235, 60, 0, 0.05)',
              padding: '0px 8px',
            },
            '&:focus-visible': {
              // border: "1px solid rgba(242, 232, 201, 1)",
              background: 'rgba(235, 60, 0, 0.05)',
              padding: '0px 8px',
              outline: 'none',
            },
          }}
        >
          {value}
        </Box>
      ) : (
        <InputBase
          autoFocus
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          // onKeyDown={handleInputKeyDown}
          inputRef={inputRef}
          multiline
          sx={{
            fontSize: '14px',
            fontFamily: 'Good Headline Pro',
            background: 'rgba(235, 60, 0, 0.05)',
            border: '1px solid rgba(235, 60, 0, 0.2)',
            borderRadius: '12px',
            padding: '2px 8px',
            width: '100%',
            height: '100%',
            '& input': {
              width: '100%',
            },
          }}
        />
      )}
    </TableCell>
  )
}