import { CollectionReference, DocumentData } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import EnhancedTable from '../../components/EnhancedTable/EnhancedTable';
import { ResultFirestore } from '../../interfaces/result-firestore.interface';
import { HeadCell } from '../../interfaces/table-header-cell.interface';
import { getList } from '../../services/firestore.service';
interface Result {
  criteriaId: string;
  criteria: string;
  value: number;
}

interface TableRow {
  name: string;
  [criteriaId: string]: number | string;
  summary: number;
}

interface GroupedResults {
  [personNickname: string]: { [criteriaId: string]: number };
}

const ResultsTable = ({
  collectionRef
}: {
  collectionRef: CollectionReference<DocumentData, DocumentData>;
}) => {
  const [results, setResults] = useState<ResultFirestore[]>([]);
  const [rows, setRows] = useState<TableRow[]>([]);
  const [headCell, setHeadCell] = useState<HeadCell[]>([]);

  const fetchResults = useCallback(async () => {
    setResults(await getList<ResultFirestore>(collectionRef));
  }, [collectionRef]);

  const generateHeaders = useCallback(() => {
    if (results.length) {
      const uniqueCriteriaIds = new Set<string>();
      // Collect unique criteria
      results.forEach((entry) => {
        entry.results.forEach((result: Result) => {
          uniqueCriteriaIds.add(result.criteriaId);
        });
      });

      // Convert the set of unique criteria to an array
      const uniqueCriteriaArray = Array.from(uniqueCriteriaIds);

      const headerCells = [
        // Add the "Name" criteria at the beginning
        {
          disablePadding: false,
          id: 'name',
          label: 'Name',
          alignRight: false
        },
        // Add criteria objects based on unique criteria
        ...uniqueCriteriaArray.map((criteriaId) => {
          const result = results[0]?.results.find(
            (result: Result) => result.criteriaId === criteriaId
          );
          const isNumber = result?.value !== undefined && typeof result.value === 'number';

          return {
            disablePadding: false,
            id: criteriaId,
            label: result?.criteria || '', // Handle the case where criteria information is not available
            alignRight: isNumber
          };
        }),
        // Add the "Summary" criteria at the end
        {
          disablePadding: false,
          id: 'summary',
          label: 'Summary',
          alignRight: true
        }
      ];

      setHeadCell(headerCells);
    }
  }, [results]);

  const generateRows = useCallback(() => {
    if (results.length) {
      // Use array.reduce to create the grouped object
      const grouped: GroupedResults = results.reduce((acc, cur) => {
        const personNickname = cur.personNickname;

        if (!acc[personNickname]) {
          acc[personNickname] = {};
        }

        for (const result of cur.results) {
          const { criteriaId, value } = result;

          if (!acc[personNickname][criteriaId]) {
            acc[personNickname][criteriaId] = 0;
          }

          acc[personNickname][criteriaId] += value;
        }

        return acc;
      }, {} as GroupedResults);

      // Use Object.entries and array.map to create the table array
      const table: TableRow[] = Object.entries(grouped).map(([name, criteriaValues]) => {
        const row: TableRow = {
          name,
          summary: 0
        };

        Object.entries(criteriaValues).forEach(([criteriaId, value]) => {
          row[criteriaId] = value;
          row.summary += value as number;
        });

        return row;
      });

      setRows(table);
    }
  }, [results]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  useEffect(() => {
    generateHeaders();
    generateRows();
  }, [generateHeaders, generateRows]);

  return <EnhancedTable headCells={headCell} rows={rows} />;
};

export default ResultsTable;
