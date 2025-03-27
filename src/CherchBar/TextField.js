import React, { useState, useRef } from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export default function TextFieldBar({ onSearchResults }) {
    const [searchBy, setSearchBy] = useState('numeroEnregistrement');
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const isSearchInProgress = useRef(false);

    const handleChange = (event) => {
        setSearchBy(event.target.value);
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        
        // Si le champ est vidé, réinitialiser la recherche
        if (!value) {
            onSearchResults(null);
        }
    };

    const handleSearch = async () => {
        // Ne rien faire si déjà en cours de recherche ou valeur vide
        if (isSearchInProgress.current || !searchValue.trim()) {
            if (!searchValue.trim()) {
                onSearchResults(null);
            }
            return;
        }

        try {
            // Marquer la recherche comme en cours
            isSearchInProgress.current = true;
            setLoading(true);

            // Construire l'endpoint selon le critère sélectionné
            let endpoint;
            if (searchBy === 'numeroEnregistrement') {
                endpoint = `/researchByNumEnregistrement/${searchValue}`;
            } else if (searchBy === 'ribBancaire') {
                endpoint = `/researchByRibBancaire/${searchValue}`;
            }

            // Utiliser fetch pour appeler l'API
            const fullEndpoint = `http://localhost:8089${endpoint}`;
            console.log("Envoi d'une seule requête à:", fullEndpoint);
            
            const response = await fetch(fullEndpoint);
            const result = await response.json();
            console.log("Requête terminée : ", result);
            
            // Mettre à jour les résultats
            if (response.ok) {
                onSearchResults(result || []); // Assurez-vous que result est transmis correctement
            } else {
                console.error("Erreur de recherche:", result);
                onSearchResults([]);
            }
        } catch (err) {
            console.error("Erreur de recherche:", err);
            onSearchResults([]);
        } finally {
            setLoading(false);
            // Délai avant de permettre une nouvelle recherche pour éviter les doubles clics
            setTimeout(() => {
                isSearchInProgress.current = false;
            }, 300);
        }
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
                gap: 2,
                flexWrap: { xs: 'wrap', md: 'nowrap' }
            }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="search-by-label" sx={{ '&.Mui-focused': { color: '#e67900' } }}>
                        Rechercher par
                    </InputLabel>
                    <Select
                        labelId="search-by-label"
                        id="search-by-select"
                        value={searchBy}
                        label="Rechercher par"
                        onChange={handleChange}
                        sx={{
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.23)' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#e67900' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e67900' },
                        }}
                    >
                        <MenuItem value="numeroEnregistrement">Numéro d'enregistrement</MenuItem>
                        <MenuItem value="ribBancaire">RIB Bancaire</MenuItem>
                    </Select>
                </FormControl>

                <TextField 
                    id="outlined-basic" 
                    label={searchBy === 'numeroEnregistrement' ? "Numéro d'enregistrement" : "RIB Bancaire"}
                    variant="outlined" 
                    fullWidth
                    value={searchValue}
                    onChange={handleSearchChange}
                    disabled={loading}
                    sx={{ 
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#e67900' },
                            '&.Mui-focused fieldset': { borderColor: '#e67900' },
                        },
                        '& label.Mui-focused': { color: '#e67900' },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    <SearchIcon 
                                        sx={{ color: '#e67900', cursor: 'pointer' }} 
                                        onClick={handleSearch}
                                    />
                                )}
                            </InputAdornment>
                        ),
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearch();
                        }
                    }}
                />

                <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={loading}
                    sx={{
                        backgroundColor: '#401804',
                        '&:hover': {
                            backgroundColor: '#d16000',
                        },
                        whiteSpace: 'nowrap',
                        width:'30%'
                    }}
                >
                    {loading ? "Recherche..." : "Rechercher"}
                </Button>
            </Box>
        </Box>
    );
}