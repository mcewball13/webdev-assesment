'use client';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import LeadsTable from '../leads-table';
import { useGetLeads } from '../../../api/leads';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';

export default function LeadsListView() {
  const { leads, leadsLoading, leadsError, leadsValidating, mutateLeads } = useGetLeads();

  useEffect(() => {
    console.log('leads: ', leads);
  }, [leads]);

  return (
    <Stack spacing={3} gap={3}>
      {leadsLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Stack direction="column" p={5}>
            <Typography variant="h3">Leads</Typography>
          </Stack>
          <Stack direction="column" p={5}>
            <LeadsTable rows={leads} mutateLeads={mutateLeads} />
          </Stack>
        </>
      )}
    </Stack>
  );
}
