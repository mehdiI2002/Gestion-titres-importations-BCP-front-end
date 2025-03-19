import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ResponsiveDialog from './ResponsiveDialog';
import Refus from './RefusComponent';

export default function ButtonContainer({numeroMessage}) {
    const [comment, setComment] = React.useState('');
    const [error, setError] = React.useState(false);
    
    return (
        <Stack 
            spacing={2} 
            sx={{ 
                width: '70%', 
                padding: '20px'
            }}
        >
            <TextField
                multiline
                rows={4}
                value={comment}
                onChange={(e) => {
                    setComment(e.target.value);
                    if (error) setError(false);
                }}
                placeholder="Saisir le motif "
                variant="outlined"
                fullWidth
                error={error}
                helperText={error ? "Veuillez saisir un motif de refus" : ""}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            borderColor: '#e67900',
                        },
                    },
                }}
            />
            <Stack 
                direction="row" 
                spacing={2} 
                justifyContent="center"
            >
                <ResponsiveDialog numeroMessage={numeroMessage} />
                <Refus comment={comment} setError={setError}  numeroMessage={numeroMessage}/>
            </Stack>
        </Stack>
    );
}