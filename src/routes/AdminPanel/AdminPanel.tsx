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
  RadioGroup,
  TextField
} from '@mui/material';
import {
  CollectionReference,
  DocumentData,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useConfirm } from 'material-ui-confirm';
import {
  authUsersCollectionRef,
  cosplayTeamCriteriaCollectionRef,
  cosplayTeamResultsCollectionRef,
  cosplayTeamsCollectionRef,
  firestore,
  kPopSoloCollectionRef,
  kPopSoloCriteriaCollectionRef,
  kPopSoloResultsCollectionRef,
  kPopTeamCriteriaCollectionRef,
  kPopTeamResultsCollectionRef,
  kPopTeamsCollectionRef,
  soloCosplayCriteriaCollectionRef,
  soloCosplayPersonsCollectionRef,
  soloCosplayResultsCollectionRef,
  storage
} from '../../../firebase';
import ZoomImage from '../../components/ZoomImage/ZoomImage';
import { useUser } from '../../contexts/AuthContext';
import { useLoading } from '../../contexts/LoadingContext';
import {
  AuthUser,
  BasicLibFirestore,
  CommonFirestoreWithOrder,
  CommonVote,
  FirestoreCollections
} from '../../interfaces';
import { ResultFirestore } from '../../interfaces/result-firestore.interface';
import { getDocumentRef, getList } from '../../services/firestore.service';
import classes from './admin-panel.module.css';

const AdminPanel = () => {
  const [type, setType] = useState<FirestoreCollections>(FirestoreCollections.soloCosplayPersons);
  const [criteriaType, setCriteriaType] = useState<FirestoreCollections>(
    FirestoreCollections.soloCosplayCriteria
  );
  const [criteriaLabel, setCriteriaLabel] = useState('');
  const [criteriaList, setCriteriaList] = useState<BasicLibFirestore[]>([]);
  const [updatedCriteriaId, setUpdatedCriteriaId] = useState('');
  const [fileData, setFileData] = useState<CommonVote[]>([]);
  const [rows, setRows] = useState<CommonFirestoreWithOrder[]>([]);
  const { user } = useUser();

  const { setLoading } = useLoading();
  const confirm = useConfirm();

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType((event.target as HTMLInputElement).value as FirestoreCollections);
  };

  const handleCriteriaTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCriteriaType((event.target as HTMLInputElement).value as FirestoreCollections);
  };

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
      setFileData(finalResult);
    };
    reader.readAsArrayBuffer(f);
  };

  const uploadFile = async () => {
    try {
      setLoading(true);
      const reqs = [];
      let collection: CollectionReference<DocumentData, DocumentData>;
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
        case FirestoreCollections.kPopSolo:
          collection = kPopSoloCollectionRef;
          break;
        default:
          throw new Error('Unknown type');
      }

      const oldDocs = await getDocs(collection);

      for (const doc of oldDocs.docs) {
        await deleteDoc(doc.ref);
      }

      for (const row of fileData) {
        reqs.push(
          addDoc(collection, {
            createdAt: serverTimestamp(),
            createdBy: user?.id,
            ...row
          })
        );
      }

      await Promise.all(reqs);
      fetchData();
      setLoading(false);
    } catch (error) {
      setLoading(true);
      throw new Error(JSON.stringify(error));
    }
  };

  const resetResults = async () => {
    try {
      await confirm();
      setLoading(true);
      const soloResults = await getList<ResultFirestore>(soloCosplayResultsCollectionRef);
      const teamResults = await getList<ResultFirestore>(cosplayTeamResultsCollectionRef);
      const kpopResults = await getList<ResultFirestore>(kPopTeamResultsCollectionRef);
      const soloKpopResults = await getList<ResultFirestore>(kPopSoloResultsCollectionRef);
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
      for (const result of soloKpopResults) {
        await deleteDoc(getDocumentRef(FirestoreCollections.kPopSoloResults, result.id));
      }

      for (const user of users) {
        await updateDoc(getDocumentRef(FirestoreCollections.authUsers, user.email), {
          soloCosplayFinished: false,
          teamCosplayFinished: false,
          kPopFinished: false,
          teamKPopFinished: false
        });
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      let collectionRef = soloCosplayCriteriaCollectionRef;
      switch (criteriaType) {
        case FirestoreCollections.soloCosplayCriteria:
          collectionRef = soloCosplayCriteriaCollectionRef;
          break;
        case FirestoreCollections.cosplayTeamCriteria:
          collectionRef = cosplayTeamCriteriaCollectionRef;
          break;
        case FirestoreCollections.kPopTeamCriteria:
          collectionRef = kPopTeamCriteriaCollectionRef;
          break;
        case FirestoreCollections.kPopSoloCriteria:
          collectionRef = kPopSoloCriteriaCollectionRef;
          break;

        default:
          console.error('Unknown type');
          break;
      }

      const criteria = await getList<BasicLibFirestore>(collectionRef);
      setCriteriaList(criteria);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      let collectionRef = soloCosplayPersonsCollectionRef;
      switch (type) {
        case FirestoreCollections.soloCosplayPersons:
          collectionRef = soloCosplayPersonsCollectionRef;
          break;
        case FirestoreCollections.cosplayTeams:
          collectionRef = cosplayTeamsCollectionRef;
          break;
        case FirestoreCollections.kPopTeams:
          collectionRef = kPopTeamsCollectionRef;
          break;
        case FirestoreCollections.kPopSolo:
          collectionRef = kPopSoloCollectionRef;
          break;

        default:
          console.error('Unknown type');
          break;
      }

      const result = await getList<CommonFirestoreWithOrder>(collectionRef);
      const sortedList = result.sort((a, b) => a.orderNumber - b.orderNumber);
      setRows(sortedList);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const changeImage = async (event: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    const files = event.target?.files;
    if (!files) return;

    let collectionRef = soloCosplayPersonsCollectionRef;
    switch (type) {
      case FirestoreCollections.soloCosplayPersons:
        collectionRef = soloCosplayPersonsCollectionRef;
        break;
      case FirestoreCollections.cosplayTeams:
        collectionRef = cosplayTeamsCollectionRef;
        break;
      case FirestoreCollections.kPopTeams:
        collectionRef = kPopTeamsCollectionRef;
        break;
      case FirestoreCollections.kPopSolo:
        collectionRef = kPopSoloCollectionRef;
        break;

      default:
        console.error('Unknown type');
        break;
    }
    const storageRef = ref(storage, `${collectionRef.id}/${files[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, files[0]);
    try {
      await uploadTask.on('state_changed', (snapshot) => {
        switch (snapshot.state) {
          case 'running':
            setLoading(true);
            break;
          default:
            setLoading(false);
            break;
        }
      });
      await uploadTask;
      const downloadedURL = await getDownloadURL(uploadTask.snapshot.ref);
      const documentRef = doc(firestore, collectionRef.path, docId);
      await updateDoc(documentRef, { image: downloadedURL });
      await fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const saveCriteria = async () => {
    try {
      setLoading(true);

      if (updatedCriteriaId) {
        await updateDoc(getDocumentRef(criteriaType, updatedCriteriaId), {
          label: criteriaLabel
        });
      } else {
        let collectionRef = soloCosplayCriteriaCollectionRef;
        switch (criteriaType) {
          case FirestoreCollections.soloCosplayCriteria:
            collectionRef = soloCosplayCriteriaCollectionRef;
            break;
          case FirestoreCollections.cosplayTeamCriteria:
            collectionRef = cosplayTeamCriteriaCollectionRef;
            break;
          case FirestoreCollections.kPopTeamCriteria:
            collectionRef = kPopTeamCriteriaCollectionRef;
            break;
          case FirestoreCollections.kPopSoloCriteria:
            collectionRef = kPopSoloCriteriaCollectionRef;
            break;

          default:
            console.error('Unknown type');
            break;
        }

        await addDoc(collectionRef, {
          createdAt: serverTimestamp(),
          createdBy: user?.id,
          label: criteriaLabel,
          order: criteriaList.length + 1
        });
      }
      await fetchCriteria();
      setUpdatedCriteriaId('');
      setCriteriaLabel('');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const deleteCriteria = async (id: string) => {
    try {
      setLoading(true);

      await deleteDoc(getDocumentRef(criteriaType, id));
      await fetchCriteria();

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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
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
            <Button component="label" onClick={fetchData} variant="contained">
              Fetch data
            </Button>
          </div>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">List Type</FormLabel>
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
              {/* <FormControlLabel
                value={FirestoreCollections.kPopSolo}
                control={<Radio />}
                label="Solo K-Pop"
              /> */}
            </RadioGroup>
          </FormControl>
        </div>
        <Button onClick={resetResults} component="label" color="error" variant="contained">
          Reset Results
        </Button>

        {!!fileData.length && (
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
      <Paper
        style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '10px',
          padding: '20px',
          alignItems: 'flex-start'
        }}>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Criteria Type</FormLabel>
          <RadioGroup
            value={criteriaType}
            onChange={handleCriteriaTypeChange}
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={FirestoreCollections.soloCosplayCriteria}
            name="type">
            <FormControlLabel
              value={FirestoreCollections.soloCosplayCriteria}
              control={<Radio />}
              label="Solo Cosplay"
            />
            <FormControlLabel
              value={FirestoreCollections.cosplayTeamCriteria}
              control={<Radio />}
              label="Team Cosplay"
            />
            <FormControlLabel
              value={FirestoreCollections.kPopTeamCriteria}
              control={<Radio />}
              label="K-Pop"
            />
            {/* <FormControlLabel
              value={FirestoreCollections.kPopSoloCriteria}
              control={<Radio />}
              label="Solo K-Pop"
            /> */}
          </RadioGroup>
        </FormControl>
        <Button onClick={fetchCriteria}>Fetch criteria</Button>
        <TextField
          id="outlined-basic"
          value={criteriaLabel}
          onChange={(e) => setCriteriaLabel(e.target.value.trim())}
          label="Criteria label"
          variant="outlined"
        />
        <Button onClick={saveCriteria}>Save criteria</Button>
      </Paper>

      {!!criteriaList.length && (
        <Container maxWidth="md">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 150 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Label</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {criteriaList
                  .sort((x) => x.order)
                  .map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {row.label}
                      </TableCell>
                      <TableCell component="th" align="right" scope="row">
                        <Button
                          onClick={() => {
                            setUpdatedCriteriaId(row.id);
                            setCriteriaLabel(row.label);
                          }}>
                          Edit
                        </Button>
                        <Button
                          color="error"
                          onClick={() => {
                            setUpdatedCriteriaId(row.id);
                            deleteCriteria(row.id);
                          }}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      )}

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
                      <p className={classes.nameCell}>{row.name}</p>
                    </TableCell>
                    <TableCell className={classes.alignRight} align="right">
                      <div className={classes.imageCell}>
                        <ZoomImage url={(row.image as string) || ''} />
                        {row.id && (
                          <Button component="label" color="secondary" variant="contained">
                            Change
                            <input
                              onChange={(e) => changeImage(e, row.id as string)}
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
                        )}
                      </div>
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
