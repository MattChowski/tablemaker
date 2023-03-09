import React, { useContext, useState } from 'react'
import { toBlob } from 'html-to-image'

import {
  Box,
  Button,
  styled,
  Slider,
  Stack,
  Checkbox,
  FormControlLabel,
  Typography,
  TextField,
  type ButtonProps,
  IconButton,
  Divider,
} from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { type ColumnDef } from '@tanstack/react-table'

import { GridCell, GridHeader } from '@/MainGridComponents/GridComponents'
import { type ContextType, TableContext } from '@/App'
import { type DataObject, getExportData } from '@/utilities/utils'

interface SidebarProps {
  exportedData: DataObject | null
  setExportData: React.Dispatch<React.SetStateAction<DataObject | null>>
}

interface PropertyProps {
  title: string
  children: React.ReactNode
}

const StyledIconButton = styled(IconButton)(() => ({
  flex: '1',
  borderRadius: '4px',
}))

const StyledButton = styled(Button)<ButtonProps>(() => ({
  color: 'rgba(235, 60, 0, 1)',
  fontSize: '14px',
  fontFamily: 'Good Headline Pro Medium',
  letterSpacing: '1px',
  // background: "rgba(33, 33, 33, 0.05)",
  border: '1px solid rgba(235, 60, 0, 1)',
  borderRadius: '2px',
  '&: hover': {
    background: 'rgba(235, 60, 0, 0.2)',
  },
  '&:focus': {
    outline: 'none',
  },
})) as typeof Button

const StyledPropTitle = styled(Typography)(() => ({
  fontFamily: 'Good Headline Pro Medium',
  fontSize: '14px',
  letterSpacing: '2px',
  color: 'rgba(235, 60, 0, 1)',
  textTransform: 'uppercase',
}))

const Property: React.FC<PropertyProps> = ({ title, children }) => (
  <Box>
    <StyledPropTitle>{title}</StyledPropTitle>
    {children}
  </Box>
)

const Sidebar: React.FC<SidebarProps> = ({ setExportData, exportedData }) => {
  const {
    tableRef,
    centerCell,
    cellPadding,
    firstColumnIsHeader,
    setFirstColumnIsHeader,
    setCenterCell,
    setData,
    setColumns,
    setCellPadding,
  } = useContext(TableContext) as ContextType
  const [filename, setFilename] = useState('')

  const handleAddColumn = () => {
    if (setColumns == null) return

    setColumns((prevState) => [
      ...prevState,
      {
        id: `${prevState.length + 1}`,
        cell: (info) => info.getValue(),
        header: () => <GridHeader data-id={`${prevState.length + 1}`} />,
      },
    ])
  }

  const handleRemoveColumn = () => {
    if (setColumns == null) return

    setColumns((prevState) => {
      if (prevState.length > 1) {
        const newColumns = prevState.slice(0, -1)
        return newColumns
      }
      return prevState
    })
  }

  const handleAddRow = () => {
    if (setData == null) return

    setData((prevState) => [...prevState, null])
  }

  const handleRemoveRow = () => {
    if (setData == null) return

    setData((prevState) => {
      if (prevState.length > 1) {
        const newColumns = prevState.slice(0, -1)
        return newColumns
      }

      return prevState
    })
  }

  const handleDownload = () => {
    if (tableRef?.current) {
      toBlob(tableRef.current)
        .then((blob) => {
          if (blob) {
            const hiddenLink = document.createElement('a')
            hiddenLink.href = URL.createObjectURL(blob)
            hiddenLink.target = '_blank'
            hiddenLink.download = 'table.png'
            hiddenLink.click()
          }

          return true
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  const handleFirstColumnHeader = () => {
    if (setFirstColumnIsHeader == null) return
    setFirstColumnIsHeader(!firstColumnIsHeader)
  }

  const handleCenterCell = () => {
    if (setCenterCell == null) return
    setCenterCell(!centerCell)
  }

  const handleChangeCellPadding = (event: Event, value: number | number[]) => {
    if (setCellPadding == null) return

    setCellPadding(value as number)
  }

  const getTableData = () => {
    if (tableRef?.current) {
      const data = getExportData(tableRef)
      localStorage.setItem('tableData', JSON.stringify(data))

      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data))}`
      const link = document.createElement('a')
      link.href = jsonString
      link.download = `${filename || 'table-data'}.json`
      link.click()
    }
  }

  const loadData = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      const fileReader = new FileReader()
      fileReader.readAsText(event.target.files[0])
      fileReader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          const loadedData: DataObject = JSON.parse(e.target?.result)
          loadedData.dateCreated = Date.now()

          const newHeaders: Array<ColumnDef<any>> = loadedData.headers.map((header, index) => ({
            id: `${index + 1}`,
            cell: (info) => <GridCell initialValue='lol' />,
            header: () => <GridHeader data-id={`${index + 1}`} initialValue={header} />,
          }))

          if (setColumns != null && setData != null) {
            setColumns(newHeaders)
            setData(Array(loadedData.rows.length).fill(null))
            setExportData(loadedData)
          }
        }
      }
    }
  }

  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFilename(e.target.value)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '230px',
        minWidth: '230px',
        height: '100vh',
        borderRight: '1px solid #eee',
        padding: '16px',
        gap: '24px',
      }}
    >
      <Property title='Columns'>
        <Stack
          spacing={1}
          direction='row'
          divider={<Divider orientation='vertical' flexItem />}
          justifyContent='space-around'
          sx={{
            marginTop: '12px',
          }}
        >
          <StyledIconButton onClick={handleRemoveColumn}>
            <RemoveIcon />
          </StyledIconButton>
          <StyledIconButton onClick={handleAddColumn}>
            <AddIcon />
          </StyledIconButton>
        </Stack>
      </Property>
      <Property title='Rows'>
        <Stack
          spacing={1}
          direction='row'
          divider={<Divider orientation='vertical' flexItem />}
          justifyContent='space-around'
          sx={{
            marginTop: '12px',
          }}
        >
          <StyledIconButton onClick={handleRemoveRow}>
            <RemoveIcon />
          </StyledIconButton>
          <StyledIconButton onClick={handleAddRow}>
            <AddIcon />
          </StyledIconButton>
        </Stack>
      </Property>

      <Property title='Cell Height'>
        <Stack
          spacing={2}
          direction='row'
          alignItems='center'
          sx={{
            marginTop: '12px',
          }}
        >
          <RemoveIcon />
          <Slider onChange={handleChangeCellPadding} value={cellPadding} min={6} max={50} />
          <AddIcon />
        </Stack>
      </Property>
      <Property title='Cell Properties'>
        <Stack
          sx={{
            marginTop: '12px',
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={firstColumnIsHeader}
                onChange={handleFirstColumnHeader}
                sx={{
                  '&.Mui-checked': {
                    color: 'rgba(235, 60, 0, 1)',
                  },
                }}
              />
            }
            label='Vertical Header'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={centerCell}
                onChange={handleCenterCell}
                sx={{
                  '&.Mui-checked': {
                    color: 'rgba(235, 60, 0, 1)',
                  },
                }}
              />
            }
            label='Center cell'
          />
        </Stack>
      </Property>

      <Box
        sx={{
          marginTop: 'auto',
        }}
      >
        <Property title='Save/Load'>
          <Stack
            spacing={1}
            sx={{
              marginTop: '12px',
            }}
          >
            <TextField
              onChange={handleFilenameChange}
              value={filename}
              id='standard-basic'
              label='Filename'
              variant='outlined'
            />
            <StyledButton onClick={getTableData} endIcon={<FileDownloadOutlinedIcon />}>
              Export Data
            </StyledButton>
            <StyledButton component='label' endIcon={<FileUploadOutlinedIcon />}>
              Load from file
              <input type='file' hidden onChange={loadData} />
            </StyledButton>
          </Stack>
        </Property>
      </Box>
      <Property title='Export to png'>
        <Stack
          spacing={1}
          sx={{
            marginTop: '12px',
          }}
        >
          <StyledButton onClick={handleDownload} endIcon={<ImageOutlinedIcon />}>
            Generate PNG
          </StyledButton>
        </Stack>
      </Property>
    </Box>
  )
}

export default Sidebar