import { CommonFireStoreDocument } from './common-firesotre.interface';

export interface Person extends CommonFireStoreDocument {
  characterName: string;
  realName: string;
  imgSrc: string;
  description: string;
}
