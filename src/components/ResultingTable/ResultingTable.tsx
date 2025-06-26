import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { invoke } from '@tauri-apps/api/core';
import { useSelector } from 'react-redux';

import { selectors } from '../../modules/elements/store';

const ResultingTable = () => {
  const results = useSelector(selectors.selectResults);

  const savePDF = async () => {
    try {
      await invoke('export_to_pdf', { output: results });
      console.log('PDF saved!');
    } catch (e) {
      console.error('Save cancelled or error:', e);
    }
  };

  return (
    <Container>
      <Button variant="contained" size="large" onClick={savePDF}>
        Save PDF
      </Button>
      <Container
        sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <TableContainer component={Paper} sx={{ width: '50%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Element</TableCell>
                <TableCell>Mass</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results?.elements?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.element}</TableCell>
                  <TableCell>{row.mass}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer component={Paper} sx={{ width: '45%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Molar Mass</TableCell>
                <TableCell>Cp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{results?.molar_mass}</TableCell>
                <TableCell>{results?.c_p}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Container>
  );
};

export default ResultingTable;
