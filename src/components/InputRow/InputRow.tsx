import { Grid2, TextField, Typography } from '@mui/material';
import { FC } from 'react';

import { SelectedElement } from '../../modules/elements/types/elements';

interface InputRowProps {
  label: string;
  values: SelectedElement[];
  type: keyof SelectedElement;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    idx: number,
  ) => void;
}

const InputRow: FC<InputRowProps> = ({ label, values, type, onChange }) => {
  return (
    <Grid2 container spacing={2} paddingBlockStart={2} paddingBlockEnd={2}>
      <Grid2
        size={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="body1">{label}</Typography>
      </Grid2>
      {values.map((el) => (
        <Grid2 key={el.idx} size="grow">
          <TextField
            id="standard-basic"
            autoComplete="false"
            variant="outlined"
            size="small"
            slotProps={{ htmlInput: { sx: { padding: '5px' } } }}
            value={values[el.idx - 1]?.[type] || ''}
            onChange={(event) => onChange(event, el.idx)}
          />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default InputRow;
