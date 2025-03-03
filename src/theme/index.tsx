'use client';

import { useMemo } from 'react';
// @mui
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MuiThemeProvider, ThemeOptions } from '@mui/material/styles';
// system
import { palette } from './palette';
import { shadows } from './shadows';
import { typography } from './typography';
import { componentsOverrides } from './overrides';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: Props) {

  const baseOption = useMemo(
    () => ({
      palette: palette('light'),
      shadows: shadows('light'),
      typography,
      shape: { borderRadius: 8 },
    }),
    []
  );

  const memoizedValue = useMemo(
    () =>
        // Base
        baseOption,
    [baseOption]
  );

  const theme = createTheme(memoizedValue as ThemeOptions);

  theme.components = componentsOverrides(theme);

  const themeWithLocale = useMemo(
    () => createTheme(theme),
    [theme]
  );

  return (
    <MuiThemeProvider theme={themeWithLocale}>
        <CssBaseline />
        {children}
    </MuiThemeProvider>
  );
}
