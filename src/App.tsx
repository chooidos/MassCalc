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
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './App.css';
import { actions, elementsSlise, selectors } from './modules/elements/store';
import { SelectedElement } from './modules/elements/types/elements';
import { AppDispatch } from './store';

function App() {
  const dispatch: AppDispatch = useDispatch();

  const [seletedElements, setSelectedElements] = useState<SelectedElement[]>([
    {
      idx: 1,
    },
    {
      idx: 2,
    },
    {
      idx: 3,
    },
    {
      idx: 4,
    },
    {
      idx: 5,
    },
    {
      idx: 6,
    },
  ]);

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
  const elemenselectedElements = useSelector(selectors.selectSelectedElements);

  useEffect(() => {
    dispatch(actions.getElements());
  }, []);
  useEffect(() => {
    console.log(elemenselectedElements);
  }, [elemenselectedElements])



  const handleElementInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
    const element = elementsList?.find(el => el.symbol === event.target.value);
    if (element) {
      dispatch(elementsSlise.actions.updateSelectedElement({ ...element, idx, number: 0 }));
    }
  };

  const handleElementCountInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid2 container spacing={2} padding={2}>
        <Grid2 size={2} display="flex" justifyContent="center" alignItems="center">
          <Typography variant='body1'>Elements</Typography>
        </Grid2>
        {seletedElements.map(el => (
          <Grid2 key={el.idx} size="grow">
            <TextField id="standard-basic" variant="outlined" size='small' onChange={event => handleElementInput(event, el.idx)} />
          </Grid2>
        ))}
      </Grid2>
      <Grid2 container spacing={2} padding={2}>
        <Grid2 size={2} display="flex" justifyContent="center" alignItems="center">
          <Typography variant='body1' >Atom numbers</Typography>
        </Grid2>
        {seletedElements.map(el => (
          <Grid2 key={el.idx} size="grow">
            <TextField id="standard-basic" variant="outlined" size='small' onChange={event => handleElementCountInput(event, el.idx)} />
          </Grid2>
        ))}
      </Grid2>
      <Grid2 container spacing={2} padding={2}>
        <Grid2 size={2} display="flex" justifyContent="center" alignItems="center">
          <Typography variant='body1' >Atom weight</Typography>
        </Grid2>
        {seletedElements.map(el => (
          <Grid2 key={el.idx} size="grow">
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
