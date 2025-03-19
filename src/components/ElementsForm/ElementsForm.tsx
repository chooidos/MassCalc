import { Button, Grid2, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from '../../modules/elements/store';
import { AppDispatch } from '../../store';
import InputRow from '../InputRow/InputRow';

const ElementsForm = () => {
  const dispatch: AppDispatch = useDispatch();

  const elementsList = useSelector(selectors.selectElements);
  const selectedElements = useSelector(selectors.selectSelectedElements);
  const sampleWeight = useSelector(selectors.selectSampleWeight);

  useEffect(() => {
    dispatch(actions.deb());
  }, [selectedElements]);

  const handleElementInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    idx: number,
  ) => {
    const { value } = event.target;
    const element = elementsList?.find((el) => el.symbol === value);

    dispatch(
      actions.updateSelectedElement({
        ...element,
        idx,
        symbol: element?.symbol ?? value,
        atomic_mass: element?.atomic_mass ?? 0,
        number: 0,
      }),
    );
  };

  const handleElementCountInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    idx: number,
  ) => {
    const element = selectedElements?.find((el) => el.idx === idx);

    if (element) {
      dispatch(
        actions.updateSelectedElement({
          ...element,
          number: event.target.value,
        }),
      );
    }
  };

  const handleElementWeightInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    idx: number,
  ) => {
    const element = selectedElements?.find((el) => el.idx === idx);

    if (element) {
      dispatch(
        actions.updateSelectedElement({
          ...element,
          atomic_mass: event.target.value,
        }),
      );
    }
  };

  const handleSampleWeightInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    dispatch(actions.updateSampleWeight(event.target.value));
  };
  return (
    <>
      <InputRow
        label="Elements"
        values={selectedElements}
        type={'symbol'}
        onChange={handleElementInput}
      />
      <InputRow
        label="Atom numbers"
        values={selectedElements}
        type={'number'}
        onChange={handleElementCountInput}
      />
      <InputRow
        label="Atom weight"
        values={selectedElements}
        type={'atomic_mass'}
        onChange={handleElementWeightInput}
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
          <Button variant="contained" size="large">
            Calculate
          </Button>
        </Grid2>
      </Grid2>
    </>
  );
};

export default ElementsForm;
