import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button'; // Ajout de l'import pour Button

export default function TextFieldBar() {
    // État pour stocker le critère de recherche sélectionné
    const [searchBy, setSearchBy] = useState('numeroEnregistrement');
    const [searchValue, setSearchValue] = useState('');

    const handleChange = (event) => {
        setSearchBy(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleSearch = () => {
        console.log(`Recherche par ${searchBy} avec la valeur: ${searchValue}`);
        // Ici vous ajouterez votre logique de recherche
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            margin: '50px',
          
        }}>
            <Box sx={{ 
                display: 'flex', 
                maxWidth: '1000px',
                width: '100%',
                gap: 2, // Espace entre les éléments
                flexWrap: { xs: 'wrap', md: 'nowrap' } // Wrap sur petits écrans
            }}>
                {/* Liste déroulante */}
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="search-by-label" sx={{
                        '&.Mui-focused': {
                            color: '#e67900',
                        },
                    }}>Rechercher par</InputLabel>
                    <Select
                        labelId="search-by-label"
                        id="search-by-select"
                        value={searchBy}
                        label="Rechercher par"
                        onChange={handleChange}
                        sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(0, 0, 0, 0.23)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#e67900',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#e67900',
                            },
                        }}
                    >
                        <MenuItem value="numeroEnregistrement">Numéro d'enregistrement</MenuItem>
                        <MenuItem value="ribBancaire">RIB Bancaire</MenuItem>
                    </Select>
                </FormControl>

                {/* Champ de recherche */}
                <TextField 
                    id="outlined-basic" 
                    label={searchBy === 'numeroEnregistrement' ? 
                        "Numéro d'enregistrement" : 
                        "RIB Bancaire"}
                    variant="outlined" 
                    fullWidth
                    value={searchValue}
                    onChange={handleSearchChange}
                    sx={{ 
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
                                <SearchIcon 
                                    sx={{ color: '#e67900', cursor: 'pointer' }} 
                                    onClick={handleSearch}
                                />
                            </InputAdornment>
                        ),
                    }}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />

                {}
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    sx={{
                        backgroundColor: '#401804',
                        '&:hover': {
                            backgroundColor: '#d16000',
                        },
                        whiteSpace: 'nowrap',
                        width: '30%',
                    }}
                >
                    Rechercher
                </Button>
            </Box>
        </Box>
    );
}