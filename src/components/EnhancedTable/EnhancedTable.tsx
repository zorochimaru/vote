import { Dialog, DialogTitle } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { getDoc } from 'firebase/firestore';
import { ChangeEvent, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  cosplayTeamsCollectionRef,
  kPopSoloCollectionRef,
  kPopTeamsCollectionRef,
  soloCosplayPersonsCollectionRef
} from '../../../firebase';
import { FirestoreCollections, HeadCell, VoteTypes } from '../../interfaces';
import { getDocumentRef } from '../../services/firestore.service';
import { exhaustiveCheck } from '../../utils';
import InfoRow from '../InfoRow/InfoRow';

// TODO: Remove this interface
interface Data extends Record<string, number | string> {}

interface DetailsDialogProps {
  open: boolean;
  selectedRow: Data;
  onClose: () => void;
  type: VoteTypes;
}

type Order = 'asc' | 'desc';

interface EnhancedTableProps {
  onRequestSort: (event: MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: HeadCell[];
}

const getCollectionRefByVoteType = (type: VoteTypes) => {
  switch (type) {
    case VoteTypes.teamCosplay:
      return cosplayTeamsCollectionRef;
    case VoteTypes.soloCosplay:
      return soloCosplayPersonsCollectionRef;
    case VoteTypes.soloKpop:
      return kPopSoloCollectionRef;
    case VoteTypes.teamKpop:
      return kPopTeamsCollectionRef;
    default:
      exhaustiveCheck(type);
  }
};

const getDataByVoteType = (type: VoteTypes) => {
  switch (type) {
    case VoteTypes.teamCosplay:
      return ['costumeType', 'fandom', 'fandomType', 'image', 'name'];
    case VoteTypes.soloCosplay:
      return ['costumeType', 'fandom', 'fandomType', 'image', 'name'];
    case VoteTypes.soloKpop:
      return ['costumeType', 'fandom', 'fandomType', 'image', 'name'];
    case VoteTypes.teamKpop:
      return ['costumeType', 'fandom', 'fandomType', 'image', 'name'];
    default:
      exhaustiveCheck(type);
  }
};

// TODO: fetch from results and map to id, name, results

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof Data>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// TODO: Fetch criteria and fill headCells with mapping label and first is not numeric

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: string) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {props.headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function DetailsDialog(props: DetailsDialogProps) {
  const { onClose, selectedRow, open, type } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [details, setDetails] = useState<[string, number][] | null>(null);
  const handleClose = () => {
    onClose();
  };

  const getDetails = useCallback(
    async (personId: string) => {
      try {
        const collectionRef = getCollectionRefByVoteType(type);
        const docRef = getDocumentRef(collectionRef.id as FirestoreCollections, personId as string);
        const res = await getDoc(docRef);

        const fieldNames = getDataByVoteType(type);
        const filteredDetails = Object.entries(res.data()!).filter(([key]) =>
          fieldNames.includes(key)
        );
        const imageInfoIndex = filteredDetails.findIndex(([key]) => key === 'image');

        [filteredDetails[imageInfoIndex], filteredDetails[0]] = [
          filteredDetails[0],
          filteredDetails[imageInfoIndex]
        ];
        setDetails(filteredDetails);
      } catch (error) {
        console.error(error);
      }
    },
    [type]
  );

  useEffect(() => {
    if (selectedRow?.personId) {
      getDetails(selectedRow.personId as string);
    }
  }, [selectedRow.personId, getDetails]);

  return (
    <Dialog maxWidth="md" fullWidth onClose={handleClose} open={open}>
      <DialogTitle>Details</DialogTitle>
      <div>
        <div style={{ textAlign: 'center' }}>
          {details?.map(([key, value]) =>
            key === 'image' ? (
              value && <img key={key} width={300} src={value as unknown as string} alt="" />
            ) : (
              <InfoRow key={key} label={key} value={value || ''} />
            )
          )}
        </div>
      </div>
    </Dialog>
  );
}

export default function EnhancedTable({
  rows,
  headCells,
  type
}: {
  rows: Data[];
  headCells: HeadCell[];
  type: VoteTypes;
}) {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Data | null>(null);

  const handleClickOpen = (row: Data) => {
    setSelectedValue(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedValue(null);
  };

  const handleRequestSort = (_event: MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows]
  );

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
              <EnhancedTableHead
                headCells={headCells}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const labelId = `enhanced-table-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={() => handleClickOpen(row)}
                      tabIndex={-1}
                      key={index}
                      sx={{ cursor: 'pointer' }}>
                      {headCells.map((cell) => (
                        <TableCell
                          key={cell.id}
                          component="th"
                          id={labelId}
                          scope="row"
                          align={cell.alignRight ? 'right' : 'left'}
                          padding={cell.disablePadding ? 'none' : 'normal'}>
                          {row[cell.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows
                    }}>
                    <TableCell colSpan={headCells.length} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      {selectedValue && (
        <DetailsDialog onClose={handleClose} type={type} selectedRow={selectedValue} open={open} />
      )}
    </>
  );
}
