"use client";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    TextField, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Button, 
    Box, 
    Grid, 
    Paper,
    Typography,
    ThemeProvider,
    createTheme
} from '@mui/material';

// Create custom theme with emerald colors
const theme = createTheme({
    palette: {
        primary: {
            main: '#059669', // emerald-600
            light: '#d1fae5', // emerald-100
            dark: '#047857', // emerald-700
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    border: '1px solid #d1fae5', // emerald-100
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                outlined: {
                    color: '#059669', // emerald-600
                    borderColor: '#059669', // emerald-600
                    '&:hover': {
                        borderColor: '#047857', // emerald-700
                        backgroundColor: '#d1fae5', // emerald-100
                    },
                },
                contained: {
                    backgroundColor: '#059669', // emerald-600
                    '&:hover': {
                        backgroundColor: '#047857', // emerald-700
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#059669', // emerald-600
                        },
                        '&:hover fieldset': {
                            borderColor: '#047857', // emerald-700
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#047857', // emerald-700
                        },
                    },
                    '& .MuiInputBase-input': {
                        backgroundColor: '#F7F7F7', // light gray
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#059669', // emerald-600
                        },
                        '&:hover fieldset': {
                            borderColor: '#047857', // emerald-700
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#047857', // emerald-700
                            boxShadow: '0 0 0 0.2rem rgba(5, 150, 105, 0.25)', // emerald-600 with 25% opacity
                        },
                    },
                    '& .MuiInputBase-input': {
                        backgroundColor: '#F7F7F7', // light gray
                    },
                },
            },
        },
    },
});



export default function ServiceFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Get current filter values from URL or set defaults
    const [nameFilter, setNameFilter] = useState(searchParams.get('name') || '');
    const [targetAreaFilter, setTargetAreaFilter] = useState(searchParams.get('targetArea') || '');
    const [massageTypeFilter, setMassageTypeFilter] = useState(searchParams.get('massageType') || '');
    const [lowerPriceFilter, setLowerPriceFilter] = useState(Number(searchParams.get('lowerprice')) || 0);
    const [upperPriceFilter, setUpperPriceFilter] = useState(searchParams.get('upperprice') ? Number(searchParams.get('upperprice')) : Infinity);
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '');

    const targetArea = [
        'Head & Shoulder', 
        'Foot', 
        'Neck-Shoulder-Back', 
        'Chair', 
        'Abdominal', 
        'Hand & Arm', 
        'Leg', 
        'Full Body'
    ]

    const massageType = [
        'Thai', 
        'Swedish', 
        'Oil/Aromatherapy', 
        'Herbal Compress',
        'Deep Tissue', 
        'Sports', 
        'Office Syndrome',
        'Shiatsu', 
        'Lomi-Lomi', 
        'Trigger Point',
        'Others'
    ]

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Build query params
        const params = new URLSearchParams();

        // Name
        if (nameFilter) params.append('name', nameFilter);

        // targetArea
        if (targetAreaFilter) params.append('targetArea', targetAreaFilter);

        // massageType
        if (massageTypeFilter) params.append('massageType', massageTypeFilter);

         // Only append lowerPriceFilter if it's not 0
        if (lowerPriceFilter !== 0) params.append('lowerprice', String(lowerPriceFilter));

        // Only append upperPriceFilter if it's not Infinity
        if (upperPriceFilter !== Infinity) params.append('upperprice', String(upperPriceFilter));

        // Sort
        if (sortBy) params.append('sortBy', sortBy);
        
        // Redirect to the same page with filters
        router.push(`/services?${params.toString()}`);
    };
    
    const clearFilters = () => {
        setNameFilter('');
        setTargetAreaFilter('');
        setMassageTypeFilter('');
        setLowerPriceFilter(0);
        setUpperPriceFilter(Infinity);
        setSortBy('');
        router.push('/services');
    };
    
    return (
        <ThemeProvider theme={theme}>
            <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: 'primary.light' }}>
                <form onSubmit={handleFilter}>
                    <Grid container spacing={3}>
                        {/* Shop Name Filter */}
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Service Name"
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                                placeholder="Search by name"
                                variant="outlined"
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                }}
                            />
                        </Grid>

                        {/* Price Range Filter */}
                        <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    type="number"
                                    label="Min Price"
                                    value={lowerPriceFilter === 0 ? '' : lowerPriceFilter}
                                    onChange={(e) => setLowerPriceFilter(Number(e.target.value))}
                                    placeholder="Min price"
                                    inputProps={{ min: 0 }}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: 'primary.main',
                                            },
                                        },
                                    }}
                                />
                                <TextField
                                    type="number"
                                    label="Max Price"
                                    value={upperPriceFilter === Infinity ? '' : upperPriceFilter}
                                    onChange={(e) => setUpperPriceFilter(Number(e.target.value))}
                                    placeholder="Max price"
                                    inputProps={{ min: 0 }}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: 'primary.main',
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </Grid>

                        {/* Massage Type Filter */}
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Massage Type</InputLabel>
                                <Select
                                    value={massageTypeFilter}
                                    label="Massage Type"
                                    onChange={(e) => setMassageTypeFilter(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'primary.light',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'primary.main',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'primary.main',
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="">All Types</MenuItem>
                                    {massageType.map((type) => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Target Area Filter */}
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Target Area</InputLabel>
                                <Select
                                    value={targetAreaFilter}
                                    label="Target Area"
                                    onChange={(e) => setTargetAreaFilter(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'primary.light',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'primary.main',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'primary.main',
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="">All Areas</MenuItem>
                                    {targetArea.map((area) => (
                                        <MenuItem key={area} value={area}>{area}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Sort By Filter */}
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Sort By</InputLabel>
                                <Select
                                    value={sortBy}
                                    label="Sort By"
                                    onChange={(e) => setSortBy(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'primary.light',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'primary.main',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'primary.main',
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="">None</MenuItem>
                                    <MenuItem value="asc">Price: Low to High</MenuItem>
                                    <MenuItem value="desc">Price: High to Low</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Filter Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={clearFilters}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                    borderColor: 'primary.dark',
                                    color: 'primary.dark',
                                },
                            }}
                        >
                            Clear Filters
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                        >
                            Apply Filters
                        </Button>
                    </Box>
                </form>
            </Paper>
        </ThemeProvider>
    );
}