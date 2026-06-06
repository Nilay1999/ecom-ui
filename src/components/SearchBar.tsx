import { useState } from 'react';
import { Autocomplete, InputBase, TextField, Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useProductSuggestions } from '../hooks/useProductSuggestions';

interface Props {
  /** 'pill' = compact navbar style, 'field' = full hero TextField. */
  variant?: 'pill' | 'field';
  placeholder?: string;
  initialValue?: string;
  autoFocus?: boolean;
}

/**
 * Shared search input used by the Navbar and Home hero.
 * Single search semantic: both submit to /search?q=, and both share
 * the debounced Trie-backed autocomplete (GET /products/suggest).
 */
export default function SearchBar({
  variant = 'pill',
  placeholder = 'Search games…',
  initialValue = '',
  autoFocus = false,
}: Props) {
  const navigate = useNavigate();
  const [value, setValue] = useState(initialValue);
  const { suggestions, isLoading } = useProductSuggestions(value);

  function submit(query: string) {
    const q = query.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <Autocomplete
      freeSolo
      options={suggestions}
      loading={isLoading}
      inputValue={value}
      onInputChange={(_, v) => setValue(v)}
      onChange={(_, v) => {
        if (typeof v === 'string') submit(v);
      }}
      filterOptions={(x) => x}
      sx={
        variant === 'pill'
          ? { flex: 1, maxWidth: 420, mx: 'auto' }
          : { width: '100%', maxWidth: 480 }
      }
      renderInput={(params) => {
        if (variant === 'field') {
          return (
            <TextField
              {...params}
              autoFocus={autoFocus}
              placeholder={placeholder}
              inputProps={{ ...params.inputProps, 'aria-label': 'Search games' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit(value);
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
          );
        }

        // Pill variant — compact, navbar
        const { InputLabelProps, InputProps, ...rest } = params;
        void InputLabelProps;
        void InputProps;
        return (
          <Box
            ref={params.InputProps.ref}
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'action.hover',
              border: '1px solid',
              borderColor: 'transparent',
              borderRadius: 999,
              px: 2,
              py: 0.5,
              transition: 'background 150ms ease, border-color 150ms ease',
              '&:hover': { bgcolor: 'action.selected' },
              '&:focus-within': { bgcolor: 'background.paper', borderColor: 'divider' },
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />
            <InputBase
              {...rest}
              placeholder={placeholder}
              autoFocus={autoFocus}
              inputProps={{ ...params.inputProps, 'aria-label': 'Search games' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit(value);
              }}
              sx={{ flex: 1, fontSize: 13 }}
            />
          </Box>
        );
      }}
    />
  );
}
