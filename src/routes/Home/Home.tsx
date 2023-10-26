import { useState } from 'react';
import CharachterPick from '../../components/UI/CharachterPick/CharachterPick';
import { Character } from '../../interfaces';
import classes from './home.module.css';
const mockData = new Array(50).fill({
  createdAt: '2023-10-26T14:37:43.967Z',
  createdBy: 'Anonymous',
  orderNumber: 10,
  description: 'Something',
  id: '123',
  imgSrc: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Roronoa_Zoro.jpg',
  name: 'Anonymous',
  realName: 'Anonymous',
  updatedAt: '2023-10-26T14:37:43.967Z',
  updatedBy: 'Anonymous',
  rated: false
});
const Home = () => {
  const [charachters] = useState<Character[]>(mockData);
  const [selectedCharachter] = useState<Character>(mockData[0]);

  const isActiveCharacter = (id: string): boolean => selectedCharachter.id === id;

  return (
    <div className={classes.wrapper}>
      <div className={classes.descWrapper}>
        <div className={classes.rating}>
          <h2>Rating</h2>
          <div className={classes.questionsWrapper}>
            <div className={classes.row}>
              <div className={classes.column}>Costume</div>
              <div className={classes.column}>☼ ☼ ☼ ☼ ☼</div>
            </div>
            <div className={classes.row}>
              <div className={classes.column}>Costume</div>
              <div className={classes.column}>☼ ☼ ☼ ☼ ☼</div>
            </div>
            <div className={classes.row}>
              <div className={classes.column}>Costume</div>
              <div className={classes.column}>☼ ☼ ☼ ☼ ☼</div>
            </div>
            <div className={classes.row}>
              <div className={classes.column}>Costume</div>
              <div className={classes.column}>☼ ☼ ☼ ☼ ☼</div>
            </div>
            <div className={classes.row}>
              <div className={classes.column}>Costume</div>
              <div className={classes.column}>☼ ☼ ☼ ☼ ☼</div>
            </div>
            <div className={classes.row}>
              <div className={classes.column}>Costume</div>
              <div className={classes.column}>☼ ☼ ☼ ☼ ☼</div>
            </div>
            <div className={classes.row}>
              <div className={classes.column}>Costume</div>
              <div className={classes.column}>☼ ☼ ☼ ☼ ☼</div>
            </div>
            <div className={classes.row}>
              <div className={classes.column}>Costume</div>
              <div className={classes.column}>☼ ☼ ☼ ☼ ☼</div>
            </div>
          </div>

          <button type="button" className={classes.submitBtn}>
            Submit
          </button>
        </div>
        <div className={classes.avatar}>
          <img src={selectedCharachter.imgSrc} alt={selectedCharachter.name} />
        </div>
        <div className={classes.info}>
          <h2>Description</h2>
          <div className={classes.row}>
            <div className={classes.column}>Name</div>
            <div className={classes.column}>Roronoa Zoro</div>
          </div>
          <div className={classes.row}>
            <div className={classes.column}>Real Name</div>
            <div className={classes.column}>Rasim Karimli</div>
          </div>
          <div className={classes.row}>
            <div className={classes.column}>Fandom</div>
            <div className={classes.column}>One Piece</div>
          </div>
          <div className={classes.row}>
            <div className={classes.column}>Note</div>
            <div className={classes.column}>
              Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты.
              Агентство продолжил несколько она жаренные, залетают деревни всемогущая своих.
              Обеспечивает текстов реторический злых о если семь свою, заманивший они, вдали, по
              всей подпоясал! Лучше, раз коварных. Жаренные дороге своего, рот сих переписали
              безорфографичный продолжил жизни, запятых знаках предупредила встретил родного ее?
            </div>
          </div>
        </div>
      </div>

      <div className={classes.charsWrapper}>
        {charachters.map((charachter) => (
          <CharachterPick isActive={isActiveCharacter(charachter.id)} charachter={charachter} />
        ))}
      </div>
    </div>
  );
};

export default Home;
