import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
const Home = () => {
  const onSave = async () => {
    try {
      const docRef = await addDoc(collection(db, 'todos'), {
        test: 'test'
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };
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
        <li>
          Config Firestore <button onClick={onSave}>Test firebase</button>
        </li>
        <li>Navigation panel</li>
        <li>Write types</li>
        <li>Write UI components</li>
      </ul>
    </>
  );
};

export default Home;
