"use client";

import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";

import { LeadForm } from "../lead-form";

export default function Home() {
    return (
        <Stack spacing={3} justifyContent='center' alignItems='center' gap={3}>
            <Stack direction='column' alignItems='center' bgcolor="peachpuff" p={5}>
                <Typography variant="h1" align="center">Get An Assessment Of Your Immigration Case</Typography>
            </Stack>
            <Stack direction='column' alignItems='center' p={5} maxWidth='md' justifyContent='center' gap={2}>
                <Typography variant="h4" align="center">
                    Want to understand your visa options?
                </Typography>
                <Typography variant="h6" align="center">
                    Submit the form below and our team of experiences attorneys will review your information and send a preliminary assessment of your case based on your goals.
                </Typography>
            </Stack>
            <LeadForm />
        </Stack>
    );
}
