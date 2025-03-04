import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import DeleteIcon from '@mui/icons-material/Delete';
import { ILead } from '../../types/types';
import TableHead from '@mui/material/TableHead';
import { Button, Icon, Stack } from '@mui/material';
import { KeyedMutator } from 'swr';
import { deleteLead } from '../../api/leads';
import axios from 'axios';
import { endpoints } from '../../utils/axios';
import { LeadStatus } from '../../types/enums';

interface LeadsTableProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

export function LeadsTable(props: LeadsTableProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const totalPages = Math.ceil(count / rowsPerPage);
  const startPage = Math.max(0, Math.min(page - 2, totalPages - 5));
  const endPage = Math.min(totalPages - 1, startPage + 4);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: 2,
      }}
    >
      <IconButton
        onClick={(e) => onPageChange(e, page - 1)}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      {[...Array(endPage - startPage + 1)].map((_, index) => {
        const pageNumber = startPage + index;
        return (
          <IconButton
            key={pageNumber}
            onClick={(e) => onPageChange(e, pageNumber)}
            disabled={page === pageNumber}
            sx={{
              bgcolor: page === pageNumber ? 'action.selected' : 'transparent',
              fontSize: '.85rem',
              color: 'black',
            }}
          >
            {pageNumber + 1}
          </IconButton>
        );
      })}
      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
}

type TableProps = {
  rows: ILead[];
  mutateLeads: KeyedMutator<ILead[]>;
};

const TABLE_HEAD = [
  { id: 'firstName', label: 'First Name', width: 100 },
  { id: 'createdAt', label: 'Date Submitted', width: 100 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'updateStatus', label: 'Update Status' },
  { id: null, label: '' },
];

export default function CustomPaginationActionsTable(props: TableProps) {
  const { rows, mutateLeads } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteLead = (id: string) => {
    deleteLead(id);
    mutateLeads((currentData: ILead[] | undefined) => {
      if (!currentData) return [];
      return currentData.filter((lead) => lead.id !== id);
    });
  };

  const handleSetReachedOut = async (id: string) => {
    const response = await axios.patch(endpoints.leads, {
      id,
      status: LeadStatus.REACHED_OUT,
    });
    console.log(response);
    mutateLeads((currentData: ILead[] | undefined) => {
      if (!currentData) return [];
      return currentData.map((lead) => {
        if (lead.id === id) lead.status = LeadStatus.REACHED_OUT;
        return lead;
      });
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {TABLE_HEAD.map((head) => (
              <TableCell
                key={head.id}
                sx={{ width: head.width, backgroundColor: 'white', color: 'text.disabled' }}
              >
                {head.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{ width: 50 }}>{row.firstName}</TableCell>
              <TableCell sx={{ width: 100 }}>
                {new Date(row.createdAt || new Date().toLocaleString()).toLocaleString()}
              </TableCell>
              <TableCell sx={{ width: 80 }}>{row.status}</TableCell>
              <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => handleSetReachedOut(row.id)}
                  >
                    Set Reached Out
                  </Button>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleDeleteLead(row.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={LeadsTable}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
