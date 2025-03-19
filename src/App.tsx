import { CssBaseline } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import './App.css';
import ElementsForm from './components/ElementsForm/ElementsForm';
import ResultingTable from './components/ResultingTable/ResultingTable';
import ThemeWrapper from './components/ThemeWrapper/ThemeWrapper';
import { actions } from './modules/elements/store';
import { AppDispatch } from './store';

function App() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.getElements());
  }, []);

  return (
    <ThemeWrapper>
      <CssBaseline />
      <ElementsForm />
      <ResultingTable />
    </ThemeWrapper>
  );
}

export default App;
