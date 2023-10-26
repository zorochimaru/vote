import { CommonFireStoreDocument } from './common-firesotre.interface';

export interface Character extends CommonFireStoreDocument {
  name: string;
  orderNumber: number;
  realName: string;
  imgSrc: string;
  description: string;
  rated: boolean;
}
