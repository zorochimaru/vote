import {
  cosplayTeamResultsCollectionRef,
  kPopTeamResultsCollectionRef,
  soloCosplayResultsCollectionRef
} from '../../../firebase';
import ResultsTable from '../../components/ResultsTable/ResultsTable';
import { useUser } from '../../contexts/AuthContext';

const Results = () => {
  const { user } = useUser();
  return (
    <>
      {(user?.role === 'cosplay' || user?.role === 'admin') && (
        <>
          <h1>Solo Cosplay Results:</h1>
          <ResultsTable collectionRef={soloCosplayResultsCollectionRef} />
          <h1>Team Cosplay Results:</h1>
          <ResultsTable collectionRef={cosplayTeamResultsCollectionRef} />
        </>
      )}
      {(user?.role === 'kPop' || user?.role === 'admin') && (
        <>
          <h1>K-Pop Results:</h1>
          <ResultsTable collectionRef={kPopTeamResultsCollectionRef} />
        </>
      )}
    </>
  );
};

export default Results;
