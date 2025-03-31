import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useSelector } from 'react-redux';

import { selectors } from '../../modules/elements/store';

const ResultingTable = () => {
  const results = useSelector(selectors.selectResults);

  return (
    <Container sx={{ mb: 2 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Element</TableCell>
              <TableCell>Mass</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results?.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.element}</TableCell>
                <TableCell>{row.mass}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ResultingTable;
