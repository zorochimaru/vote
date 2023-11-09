import { Link } from 'react-router-dom';
import Icon from '../../components/UI/Icon/Icon';
import { useUser } from '../../contexts/AuthContext';
import classes from './home.module.css';
const Home = () => {
  const { user } = useUser();
  return (
    <div className={classes.wrapper}>
      {(user?.role === 'cosplay' || user?.role === 'admin') && (
        <>
          {!user.soloCosplayFinished && (
            <Link to="/solo-cosplay-vote">
              <div className={classes.voteItem}>
                <Icon size={40} icon="person" />
                <p>Solo Cosplay Vote</p>
              </div>
            </Link>
          )}
          {!user.teamCosplayFinished && (
            <Link to="/team-cosplay-vote">
              <div className={classes.voteItem}>
                <Icon size={40} icon="groups" />
                <p>Team Cosplay Vote</p>
              </div>
            </Link>
          )}
        </>
      )}
      {(user?.role === 'k-pop' || user?.role === 'admin') && (
        <Link to="/k-pop-vote">
          <div className={classes.voteItem}>
            <Icon size={40} icon="artist" />
            <p>K-Pop Vote</p>
          </div>
        </Link>
      )}
      {((user?.soloCosplayFinished && user.teamCosplayFinished) || user?.kpopFinished) && (
        <Link to="/results">
          <div className={classes.voteItem}>
            <Icon size={40} icon="trophy" />
            <p>Results</p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Home;
