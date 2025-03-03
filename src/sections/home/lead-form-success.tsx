import React from 'react';
import { Box, Typography, IconButton, Container, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';

interface LeadFormSuccessProps {
    onClose?: () => void;
}

const LeadFormSuccess: React.FC<LeadFormSuccessProps> = ({ onClose }) => {
    return (
        <Container maxWidth="sm">
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    mt: 4,
                    textAlign: 'center',
                    position: 'relative',
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                }}
            >
                {onClose && (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                )}

                <Box sx={{ mb: 3 }}>
                    <CheckCircleOutlineIcon
                        sx={{
                            fontSize: 64,
                            color: 'success.main',
                            mb: 2,
                        }}
                    />
                    <Typography variant="h5" component="h2" gutterBottom>
                        Thank You!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Your submission has been received successfully. We&apos;ll get back to you shortly.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default LeadFormSuccess;
