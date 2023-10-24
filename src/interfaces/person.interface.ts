import { CommonFireStoreDocument } from './common-firesotre.interface';

export interface Character extends CommonFireStoreDocument {
  name: string;
  realName: string;
  imgSrc: string;
  description: string;
}
