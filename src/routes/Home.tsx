const Home = () => {
  return (
    <>
      <h1>TODO:</h1>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          gap: '8px',
          flexDirection: 'column'
        }}>
        <li>Create authorization Firebase</li>
        <li>Config Firestore</li>
        <li>Navigation panel</li>
        <li>Write types</li>
        <li>Write UI components</li>
      </ul>
    </>
  );
};

export default Home;
