import merge from 'lodash/merge';
import { Theme } from '@mui/material/styles';
//
import Tabs from './components/tabs';
import Table from './components/table';
import Stack from './components/stack';
import Button from './components/button';
import Select from './components/select';
import Checkbox from './components/checkbox';
import TextField from './components/textfield';
import Typography from './components/typography';
import CssBaseline from './components/css-baseline';

// ----------------------------------------------------------------------

export function componentsOverrides(theme: Theme) {
  const components = merge(
    Tabs(theme),
    Table(theme),
    Stack(theme),
    Button(theme),
    Select(theme),
    Checkbox(theme),
    TextField(theme),
    Typography(theme),
    CssBaseline(theme),
  );

  return components;
}
