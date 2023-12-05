import UploadIcon from '@mui/icons-material/Upload';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import * as XLSX from 'xlsx';

import {
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import { addDoc, deleteDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useConfirm } from 'material-ui-confirm';
import {
  authUsersCollectionRef,
  cosplayTeamResultsCollectionRef,
  cosplayTeamsCollectionRef,
  kPopTeamResultsCollectionRef,
  kPopTeamsCollectionRef,
  soloCosplayPersonsCollectionRef,
  soloCosplayResultsCollectionRef
} from '../../../firebase';
import ZoomImage from '../../components/ZoomImage/ZoomImage';
import { useUser } from '../../contexts/AuthContext';
import { useLoading } from '../../contexts/LoadingContext';
import { AuthUser, CommonVote, FirestoreCollections } from '../../interfaces';
import { ResultFirestore } from '../../interfaces/result-firestore.interface';
import { getDocumentRef, getList } from '../../services/firestore.service';
import classes from './admin-panel.module.css';

const AdminPanel = () => {
  const [type, setType] = useState<FirestoreCollections>(FirestoreCollections.soloCosplayPersons);
  const { setLoading } = useLoading();
  const confirm = useConfirm();

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType((event.target as HTMLInputElement).value as FirestoreCollections);
  };

  const [rows, setRows] = useState<CommonVote[]>([]);
  const { user } = useUser();

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
      const data = XLSX.utils.sheet_to_json(ws, { defval: '' }) as CommonVote[];
      /* Update state */
      const finalResult: CommonVote[] = data.map((x, i) => ({
        ...x,
        orderNumber: i + 1
      }));
      setRows(finalResult);
    };
    reader.readAsBinaryString(f);
  };

  const uploadFile = () => {
    const reqs = [];
    let collection = soloCosplayPersonsCollectionRef;
    switch (type) {
      case FirestoreCollections.soloCosplayPersons:
        collection = soloCosplayPersonsCollectionRef;
        break;
      case FirestoreCollections.cosplayTeams:
        collection = cosplayTeamsCollectionRef;
        break;
      case FirestoreCollections.kPopTeams:
        collection = kPopTeamsCollectionRef;
        break;

      default:
        console.error('Unknown type');
        break;
    }

    for (const row of rows) {
      reqs.push(
        addDoc(collection, {
          createdAt: serverTimestamp(),
          createdBy: user?.id,
          ...row
        })
      );
    }
    Promise.all(reqs).then(() => {
      setRows([]);
    });
  };

  const resetResults = async () => {
    try {
      await confirm();
      setLoading(true);
      const soloResults = await getList<ResultFirestore>(soloCosplayResultsCollectionRef);
      const teamResults = await getList<ResultFirestore>(cosplayTeamResultsCollectionRef);
      const kpopResults = await getList<ResultFirestore>(kPopTeamResultsCollectionRef);
      const users = await getList<AuthUser>(authUsersCollectionRef);

      for (const result of soloResults) {
        await deleteDoc(getDocumentRef(FirestoreCollections.soloCosplayResults, result.id));
      }
      for (const result of teamResults) {
        await deleteDoc(getDocumentRef(FirestoreCollections.cosplayTeamResults, result.id));
      }
      for (const result of kpopResults) {
        await deleteDoc(getDocumentRef(FirestoreCollections.kPopTeamResults, result.id));
      }

      for (const user of users) {
        await updateDoc(getDocumentRef(FirestoreCollections.authUsers, user.email), {
          soloCosplayFinished: false,
          teamCosplayFinished: false,
          kPopFinished: false
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
          padding: '20px',
          alignItems: 'flex-start'
        }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
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
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Type</FormLabel>
            <RadioGroup
              value={type}
              onChange={handleTypeChange}
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={FirestoreCollections.soloCosplayPersons}
              name="type">
              <FormControlLabel
                value={FirestoreCollections.soloCosplayPersons}
                control={<Radio />}
                label="Solo Cosplay"
              />
              <FormControlLabel
                value={FirestoreCollections.cosplayTeams}
                control={<Radio />}
                label="Team Cosplay"
              />
              <FormControlLabel
                value={FirestoreCollections.kPopTeams}
                control={<Radio />}
                label="K-Pop"
              />
            </RadioGroup>
          </FormControl>
        </div>
        <Button onClick={resetResults} component="label" color="error" variant="contained">
          Reset Results
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
      </Paper>
      {!!rows.length && (
        <Container maxWidth="md">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 150 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Image</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.orderNumber}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell className={classes.imageCell} align="right">
                      <ZoomImage url={row.image || ''} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      )}
    </div>
  );
};

export default AdminPanel;
