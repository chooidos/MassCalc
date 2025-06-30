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
    <Container
      sx={{
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        minHeight: '20vh',
        maxHeight: '315px',
      }}
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
      <div style={{ position: 'relative', width: '30%' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Molar Mass</TableCell>
                <TableCell>Cp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(results?.molar_mass ?? 0) > 0 && (
                <TableRow>
                  <TableCell>{results?.molar_mass}</TableCell>
                  <TableCell>{results?.c_p}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {(results?.elements?.length ?? 0) > 0 && (
        <Button
          variant="contained"
          size="large"
          sx={{
            p: '5px',
            position: 'absolute',
            bottom: '0px',
            right: '24px',
          }}
          onClick={savePDF}
        >
          Save PDF
        </Button>
      )}
    </Container>
  );
};

export default ResultingTable;
