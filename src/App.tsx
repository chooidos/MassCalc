// import { useState } from "react";
// import { invoke } from "@tauri-apps/api/core";

import {
  Button,
  Container,
  createTheme,
  CssBaseline,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useMemo, useState } from 'react';

import './App.css';

const elements = [
  {
    symbol: '',
    name: null,
    atomic_mass: null,
  },
]

function App() {
  const [elements, setElements] = useState({ 1: {} });
  // const [name, setName] = useState("");

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid2 container spacing={2} padding={2}>
        <Grid2 size={2} display="flex" justifyContent="center" alignItems="center">
          <Typography variant='body1'>Elements</Typography>
        </Grid2>
        {[1, 2, 3, 4, 5, 6].map(el => (
          <Grid2 key={el} size="grow">
            <TextField id="standard-basic" variant="outlined" size='small' />
          </Grid2>
        ))}
      </Grid2>
      <Grid2 container spacing={2} padding={2}>
        <Grid2 size={2} display="flex" justifyContent="center" alignItems="center">
          <Typography variant='body1' >Atom numbers</Typography>
        </Grid2>
        {[1, 2, 3, 4, 5, 6].map(el => (
          <Grid2 key={el} size="grow">
            <TextField id="standard-basic" variant="outlined" size='small' />
          </Grid2>
        ))}
      </Grid2>
      <Grid2 container spacing={2} padding={2}>
        <Grid2 size={2} display="flex" justifyContent="center" alignItems="center">
          <Typography variant='body1' >Atom weight</Typography>
        </Grid2>
        {[1, 2, 3, 4, 5, 6].map(el => (
          <Grid2 key={el} size="grow">
            <TextField id="standard-basic" variant="outlined" size='small' />
          </Grid2>
        ))}
      </Grid2>
      <Grid2 container spacing={2} padding={2}>
        <Grid2 size={2} display="flex" justifyContent="center" alignItems="center">
          <Typography variant='body1' >Sample weight</Typography>
        </Grid2>
        <Grid2 size={2}>
          <TextField id="standard-basic" variant="outlined" size='small' />
        </Grid2>
        <Grid2 size={6}></Grid2>
        <Grid2 size={2} display="flex" justifyContent="center" alignItems="center">
          <Button variant="contained" size="large">Calculate</Button>
        </Grid2>
      </Grid2>
      <Container>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

      </Container>
    </ThemeProvider>
  );
}

export default App;
