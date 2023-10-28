import { CommonFireStoreDocument } from './common-firesotre.interface';

export interface CharacterFirestore extends CommonFireStoreDocument {
  orderNumber: number;
  name: string;
  fandom: string;
  characterName: string;
  fandomType: string;
  selfMade: string;
  image: string;
  description: string;
}
