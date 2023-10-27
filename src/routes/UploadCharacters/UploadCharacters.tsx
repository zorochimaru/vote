import UploadIcon from '@mui/icons-material/Upload';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { firestore } from '../../../firebase';
import classes from './upload-characters.module.css';

const UploadCharacters = () => {
  const [rows, setRows] = useState<any[]>([]);

  const loadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      /* Parse data */
      const bstr = reader.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws) as any[];
      /* Update state */
      setRows(data);
    };
    reader.readAsBinaryString(f);
  };

  const uploadFile = () => {
    const reqs = [];
    for (const row of rows) {
      reqs.push(
        addDoc(collection(firestore, 'soloCosplay'), {
          createdAt: serverTimestamp(),
          createdBy: 'Loged User Id',
          ...row
        })
      );
    }
    Promise.all(reqs).then(() => {
      setRows([]);
    });
  };

  return (
    <div className={classes.wrapper}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <Button component="label" variant="contained">
          Browse file
          <input
            onChange={(e) => loadFile(e)}
            style={{
              clip: 'rect(0 0 0 0)',
              clipPath: 'inset(50%)',
              height: 1,
              overflow: 'hidden',
              position: 'absolute',
              bottom: 0,
              left: 0,
              whiteSpace: 'nowrap',
              width: 1
            }}
            type="file"
          />
        </Button>
        {!!rows.length && (
          <Button
            onClick={uploadFile}
            variant="contained"
            color="success"
            startIcon={<UploadIcon />}
            component="label">
            Upload data
          </Button>
        )}
      </div>
      {!!rows.length && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Fandom</TableCell>
                <TableCell align="right">Character&nbsp;Name</TableCell>
                <TableCell align="right">Fandom&nbsp;Type</TableCell>
                <TableCell align="right">Image</TableCell>
                <TableCell align="right">Self-Made</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.fandom}</TableCell>
                  <TableCell align="right">{row.characterName}</TableCell>
                  <TableCell align="right">{row.fandomType}</TableCell>
                  <TableCell align="right">
                    <CharImage row={row} />
                  </TableCell>
                  <TableCell align="right">{row.selfMade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

const CharImage: React.FC<{ row: any }> = ({ row }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <button aria-describedby={id} className={classes.charImage} onClick={handleClick}>
        <img height={80} src={row.image} alt="" />
      </button>
      <Popover
        id={id}
        open={open}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        anchorEl={anchorEl}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}>
        <img width={300} src={row.image} alt="" />
      </Popover>
    </>
  );
};

export default UploadCharacters;
