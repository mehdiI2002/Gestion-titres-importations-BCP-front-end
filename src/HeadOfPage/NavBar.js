import React from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';

export default function NavBar() {
    return (
        <Box sx={{ 
            display: 'flex',
            flexDirection: 'row', // Changed to row
            alignItems: 'center', // Center items vertically
            width: '100%',
            padding: '10px',
            gap: '40px' // Space between logo and search bar
        }}>
            {/* Logo Container */}
            <Box sx={{
                display: 'flex',
                flexShrink: 0, // Prevents logo from shrinking
            }}>
                <img 
                    src="/logo_bp_lg.png" 
                    alt="Banque Centrale Populaire" 
                    style={{
                        height: '150px',
                        objectFit: 'contain',
                    }}
                />
            </Box>
            
            {/* Search Container */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                flex: 1, // Takes remaining space
            }}>
                <TextField 
                    id="outlined-basic" 
                    label="Rechercher un titre d'importation" 
                    variant="outlined" 
                    fullWidth
                    sx={{ 
                        maxWidth: '600px',
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: '#e67900',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#e67900',
                            },
                        },
                        '& label.Mui-focused': {
                            color: '#e67900',
                        },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon sx={{ color: '#e67900' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </Box>
    );
}