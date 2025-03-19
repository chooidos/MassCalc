import { createTheme, ThemeProvider, useMediaQuery } from '@mui/material';
import { FC, useMemo } from 'react';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

const ThemeWrapper: FC<ThemeWrapperProps> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemeWrapper;
