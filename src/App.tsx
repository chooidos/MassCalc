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
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './App.css';
import { actions, selectors } from './modules/elements/store';
import { AppDispatch } from './store';

function App() {
  const dispatch: AppDispatch = useDispatch();

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

  const elementsList = useSelector(selectors.selectElements);
  const selectedElements = useSelector(selectors.selectSelectedElements);

  useEffect(() => {
    dispatch(actions.getElements());
  }, []);
  useEffect(() => {
    console.log(selectedElements);
  }, [selectedElements]);

  const handleElementInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    idx: number,
  ) => {
    const element = elementsList?.find(
      (el) => el.symbol === event.target.value,
    );
    if (element) {
      dispatch(
        actions.updateSelectedElement({
          ...element,
          idx,
          number: 0,
        }),
      );
    }
  };

  const handleElementCountInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    idx: number,
  ) => {
    const element = selectedElements?.find((el) => el.idx === idx);

    if (element) {
      dispatch(
        actions.updateCountSelectedElement({
          ...element,
          number: parseInt(event.target.value),
        }),
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid2 container spacing={2} padding={2}>
        <Grid2
          size={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="body1">Elements</Typography>
        </Grid2>
        {selectedElements.map((el) => (
          <Grid2 key={el.idx} size="grow">
            <TextField
              id="standard-basic"
              autoComplete="false"
              variant="outlined"
              size="small"
              onChange={(event) => handleElementInput(event, el.idx)}
            />
          </Grid2>
        ))}
      </Grid2>
      <Grid2 container spacing={2} padding={2}>
        <Grid2
          size={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="body1">Atom numbers</Typography>
        </Grid2>
        {selectedElements.map((el) => (
          <Grid2 key={el.idx} size="grow">
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="false"
              variant="outlined"
              size="small"
              onChange={(event) => handleElementCountInput(event, el.idx)}
            />
          </Grid2>
        ))}
      </Grid2>
      <Grid2 container spacing={2} padding={2}>
        <Grid2
          size={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="body1">Atom weight</Typography>
        </Grid2>
        {selectedElements.map((el) => (
          <Grid2 key={el.idx} size="grow">
            <TextField
              id="standard-basic"
              autoComplete="false"
              variant="outlined"
              size="small"
              slotProps={{ htmlInput: { sx: { fontSize: 14 } } }}
              value={selectedElements[el.idx - 1].atomic_mass}
            />
          </Grid2>
        ))}
      </Grid2>
      <Grid2 container spacing={2} padding={2}>
        <Grid2
          size={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="body1">Sample weight</Typography>
        </Grid2>
        <Grid2 size={2}>
          <TextField
            id="standard-basic"
            autoComplete="false"
            variant="outlined"
            size="small"
          />
        </Grid2>
        <Grid2 size={6}></Grid2>
        <Grid2
          size={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button variant="contained" size="large">
            Calculate
          </Button>
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
