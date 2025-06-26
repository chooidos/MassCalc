import { Button, Grid2, TextField, Typography } from '@mui/material';
import { invoke } from '@tauri-apps/api/core';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from '../../modules/elements/store';
import { AppDispatch } from '../../store';
import InputRow from '../InputRow/InputRow';

const ElementsForm = () => {
  const dispatch: AppDispatch = useDispatch();

  const elementsList = useSelector(selectors.selectElements);
  const selectedElements = useSelector(selectors.selectSelectedElements);
  const sampleWeight = useSelector(selectors.selectSampleWeight);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    idx: number,
    field: 'symbol' | 'number' | 'atomic_mass',
  ) => {
    const { value } = event.target;

    let element = selectedElements.find((el) => el.idx === idx);

    if (field === 'symbol') {
      const foundElement = elementsList.find((el) => el.symbol === value);
      if (foundElement) {
        element = { ...foundElement, idx, number: 0 };
      } else {
        element = { idx, symbol: value, atomic_mass: 0, number: 0 };
      }
    }

    dispatch(
      actions.updateSelectedElement({
        ...element,
        [field]: value,
      }),
    );
  };

  const handleSampleWeightInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    dispatch(actions.updateSampleWeight(event.target.value));
  };

  const sendDataToCalculate = async () => {
    const filteredElements = selectedElements.filter((el) => el.symbol);

    try {
      const result = await invoke<
        {
          element: string;
          mass: number;
        }[]
      >('calculate', {
        input: {
          elements: filteredElements,
          sample_weight: sampleWeight,
        },
      });

      dispatch(actions.updateResults(result));
    } catch (error) {
      dispatch(actions.updateError(`Error in calculation ${error}`));
    }
  };

  return (
    <>
      <InputRow
        label="Elements"
        values={selectedElements}
        type={'symbol'}
        onChange={(event, idx) => handleInputChange(event, idx, 'symbol')}
      />
      <InputRow
        label="Atom numbers"
        values={selectedElements}
        type={'number'}
        onChange={(event, idx) => handleInputChange(event, idx, 'number')}
      />
      <InputRow
        label="Atom weight"
        values={selectedElements}
        type={'atomic_mass'}
        onChange={(event, idx) => handleInputChange(event, idx, 'atomic_mass')}
      />
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
            slotProps={{ htmlInput: { sx: { padding: '5px' } } }}
            value={sampleWeight}
            onChange={handleSampleWeightInput}
          />
        </Grid2>
        <Grid2 size={6} />
        <Grid2
          size={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            size="large"
            onClick={sendDataToCalculate}
          >
            Calculate
          </Button>
        </Grid2>
      </Grid2>
    </>
  );
};

export default ElementsForm;
