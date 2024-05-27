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
      {(user?.role === 'cosplay' || user?.role === 'admin') && user?.teamCosplayFinished && (
        <>
          <h1>Team Cosplay Results:</h1>
          <ResultsTable collectionRef={cosplayTeamResultsCollectionRef} />
        </>
      )}
      {(user?.role === 'cosplay' || user?.role === 'admin') && user?.soloCosplayFinished && (
        <>
          <h1>Solo Cosplay Results:</h1>
          <ResultsTable collectionRef={soloCosplayResultsCollectionRef} />
        </>
      )}
      {(user?.role === 'kPop' || user?.role === 'admin') && user?.teamKPopFinished && (
        <>
          <h1>K-Pop Results:</h1>
          <ResultsTable collectionRef={kPopTeamResultsCollectionRef} />
        </>
      )}
      {/* {(user?.role === 'kPop' || user?.role === 'admin') && user?.kPopFinished && (
        <>
          <h1>Solo K-Pop Results:</h1>
          <ResultsTable collectionRef={kPopSoloResultsCollectionRef} />
        </>
      )} */}
    </>
  );
};

export default Results;
